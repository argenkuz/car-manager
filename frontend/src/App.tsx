import { useEffect, useMemo, useState } from "react";
import "./styles.css";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type Brand = { id: string; name: string };
type Model = { id: string; name: string };
type Option = { id: string; name: string };
type Car = { id:string; title:string; brand?:string; model?:string; year?:number; mileage?:number; price?:number; location?:string; url?:string; image_url?:string };
type Filter = {
  id:number; name:string; enabled:boolean; brand_id:string|null; model_id:string|null;
  model_detail_id:string|null; grade_id:string|null; grade_detail_id:string|null;
  min_year:number|null; max_year:number|null; min_mileage:number|null; max_mileage:number|null;
  min_price:number|null; max_price:number|null;
  fuel_ids:string[]; mission_ids:string[]; color_ids:string[]; option_ids:string[];
  accident:string|null; sido_ids:string[]; sido_area_ids:string[]; danji_ids:string[];
};
type FilterDraft = {
  name:string; enabled:boolean; brand_id:string|null; model_id:string|null;
  model_detail_id:string|null; grade_id:string|null; grade_detail_id:string|null;
  min_year:number|null; max_year:number|null; min_mileage:number|null; max_mileage:number|null;
  min_price:number|null; max_price:number|null;
  fuel_ids:string[]; mission_ids:string[]; color_ids:string[]; option_ids:string[];
  accident:string|null; sido_ids:string[]; sido_area_ids:string[]; danji_ids:string[];
};
type User = { id:number; username:string; role:string; is_active:boolean };
type Monitor = { enabled:boolean; interval_minutes:number; next_run_at:string|null };

const emptyFilter: FilterDraft = {
  name:"Новый фильтр", enabled:true, brand_id:null, model_id:null, model_detail_id:null, grade_id:null, grade_detail_id:null,
  min_year:null,max_year:null,min_mileage:null,max_mileage:null,min_price:null,max_price:null,
  fuel_ids:[],mission_ids:[],color_ids:[],option_ids:[],accident:null,sido_ids:[],sido_area_ids:[],danji_ids:[]
};

function token() { return localStorage.getItem("car_manager_access_token"); }
function saveToken(value:string) { localStorage.setItem("car_manager_access_token", value); }
function clearToken() { localStorage.removeItem("car_manager_access_token"); }

async function api(path:string, options:RequestInit={}) {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  const access = token();
  if (access) headers.set("Authorization", "Bearer " + access);
  const res = await fetch(API + path, {...options, headers});
  const data = await res.json().catch(()=>({}));
  if (res.status === 401) clearToken();
  if (!res.ok) throw new Error(data.detail || "Ошибка запроса");
  return data;
}

const fmt=(n:number|null|undefined)=>n==null?"—":new Intl.NumberFormat("ru-RU").format(n);
const intervalLabel=(n:number)=>n<60?"каждые "+n+" мин":"каждые "+Math.round(n/60)+" ч";

function LoginScreen({onLogin}:{onLogin:(user:User)=>void}) {
  const [register,setRegister]=useState(false);
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [master,setMaster]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);

  async function submit() {
    try {
      setBusy(true); setError("");
      const endpoint = register ? "/api/auth/register" : "/api/auth/login";
      const body = register
        ? {username,password,master_password:master}
        : {username,password};
      const data = await api(endpoint,{method:"POST",body:JSON.stringify(body)});
      saveToken(data.access_token);
      onLogin(data.user);
    } catch(e) {
      setError(e instanceof Error ? e.message : "Не удалось выполнить запрос");
    } finally { setBusy(false); }
  }

  return <div className="auth-page">
    <div className="auth-card">
      <div className="eyebrow">CARMANAGER MONITOR</div>
      <h1>{register?"Создать аккаунт":"Вход"}</h1>
      <p className="auth-subtitle">{register?"Для создания аккаунта требуется мастер-пароль.":"Войдите в мониторинг автомобилей."}</p>
      {error&&<div className="error">{error}</div>}
      <label>Логин</label>
      <input autoFocus value={username} onChange={e=>setUsername(e.target.value)} placeholder="Введите логин"/>
      <label>Пароль</label>
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Введите пароль"/>
      {register&&<>
        <label>Мастер-пароль</label>
        <input type="password" value={master} onChange={e=>setMaster(e.target.value)} placeholder="Введите мастер-пароль"/>
      </>}
      <button className="primary auth-submit" onClick={()=>void submit()} disabled={busy}>
        {busy?(register?"Создание...":"Вход..."):(register?"Создать аккаунт":"Войти")}
      </button>
      <button className="link auth-switch" onClick={()=>{setRegister(!register);setError("")}}>
        {register?"У меня уже есть аккаунт":"Нет аккаунта? Создать аккаунт"}
      </button>
    </div>
  </div>;
}

function TelegramSettings({onClose}:{onClose:()=>void}) {
  const [master,setMaster]=useState("");
  const [verified,setVerified]=useState(false);
  const [telegramId,setTelegramId]=useState("");
  const [recipients,setRecipients]=useState<{telegram_id:number;created_at:string}[]>([]);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);

  async function verify() {
    try {
      setBusy(true); setError("");
      const data=await api("/api/telegram/recipients",{headers:{"X-Master-Password":master}});
      setRecipients(data); setVerified(true);
    } catch(e) { setError(e instanceof Error?e.message:"Мастер-пароль неверный"); }
    finally { setBusy(false); }
  }

  async function add() {
    const id=Number(telegramId);
    if(!Number.isInteger(id)||id<=0){setError("Введите корректный Telegram ID");return;}
    try {
      setBusy(true); setError("");
      await api("/api/telegram/recipients",{method:"POST",headers:{"X-Master-Password":master},body:JSON.stringify({telegram_id:id})});
      const data=await api("/api/telegram/recipients",{headers:{"X-Master-Password":master}});
      setRecipients(data); setTelegramId("");
    } catch(e){setError(e instanceof Error?e.message:"Не удалось добавить Telegram ID");}
    finally{setBusy(false);}
  }

  async function remove(id:number) {
    try {
      setBusy(true); setError("");
      await api("/api/telegram/recipients/"+id,{method:"DELETE",headers:{"X-Master-Password":master}});
      setRecipients(v=>v.filter(x=>x.telegram_id!==id));
    } catch(e){setError(e instanceof Error?e.message:"Не удалось удалить Telegram ID");}
    finally{setBusy(false);}
  }

  return <div className="modal-backdrop">
    <div className="modal-card">
      <div className="section-head"><div><div className="eyebrow">НАСТРОЙКИ</div><h2>Telegram</h2></div><button onClick={onClose}>×</button></div>
      <p className="auth-subtitle">Управление получателями защищено мастер-паролем.</p>
      {error&&<div className="error">{error}</div>}
      {!verified ? <>
        <label>Мастер-пароль</label>
        <input type="password" value={master} onChange={e=>setMaster(e.target.value)} placeholder="Введите мастер-пароль"/>
        <button className="primary" onClick={()=>void verify()} disabled={busy}>{busy?"Проверка...":"Подтвердить"}</button>
      </> : <>
        <label>Telegram ID</label>
        <div className="telegram-add"><input value={telegramId} onChange={e=>setTelegramId(e.target.value)} placeholder="Например, 1100664785"/><button className="primary" onClick={()=>void add()} disabled={busy}>Добавить</button></div>
        <div className="telegram-list">
          {recipients.length===0?<div className="empty">Получателей пока нет.</div>:recipients.map(x=><div className="telegram-row" key={x.telegram_id}><span>{x.telegram_id}</span><button className="danger" onClick={()=>void remove(x.telegram_id)} disabled={busy}>Удалить</button></div>)}
        </div>
      </>}
    </div>
  </div>;
}

function Dashboard({user,onLogout}:{user:User;onLogout:()=>void}) {
  const [brands,setBrands]=useState<Brand[]>([]);
  const [models,setModels]=useState<Model[]>([]);
  const [details,setDetails]=useState<Option[]>([]);
  const [grades,setGrades]=useState<Option[]>([]);
  const [gradeDetails,setGradeDetails]=useState<Option[]>([]);
  const [fuel,setFuel]=useState<Option[]>([]);
  const [mission,setMission]=useState<Option[]>([]);
  const [colors,setColors]=useState<Option[]>([]);
  const [options,setOptions]=useState<Option[]>([]);
  const [sido,setSido]=useState<Option[]>([]);
  const [areas,setAreas]=useState<Option[]>([]);
  const [danji,setDanji]=useState<Option[]>([]);
  const [filters,setFilters]=useState<Filter[]>([]);
  const [filter,setFilter]=useState<FilterDraft>({...emptyFilter});
  const [editing,setEditing]=useState<number|null>(null);
  const [cars,setCars]=useState<Car[]>([]);
  const [loading,setLoading]=useState(true);
  const [searching,setSearching]=useState(false);
  const [error,setError]=useState("");
  const [monitor,setMonitor]=useState<Monitor>({enabled:false,interval_minutes:10,next_run_at:null});
  const [settingsSaving,setSettingsSaving]=useState(false);
  const [telegramOpen,setTelegramOpen]=useState(false);

  async function load(){
    try{
      setLoading(true);setError("");
      const [b,f,m,catalog]=await Promise.all([api("/api/catalog/brands"),api("/api/filters"),api("/api/monitor/status"),api("/api/catalog/car-filters")]);
      setBrands(b.items||[]);setFilters(f||[]);setMonitor(m);
      const normalize=(arr:any[],idKeys:string[],nameKeys:string[]):Option[] => (arr||[]).map(x=>({id:String(idKeys.map(k=>x[k]).find(v=>v!=null)??""),name:String(nameKeys.map(k=>x[k]).find(v=>v!=null)??"")})).filter(x=>x.id&&x.name);
      setFuel(normalize(catalog.fuel,["FKeyNo"],["FuelName"]));
      setMission(normalize(catalog.mission,["MKeyNo"],["MissionName"]));
      setColors(normalize(catalog.color,["CKeyNo"],["ColorName"]));
      setOptions(normalize([...(catalog.option_base||[]),...(catalog.option_etc||[])],["CarOptionNo"],["CarOptionName"]));
      setSido(normalize(catalog.sido,["SiDoNo"],["SiDoCodeFullName","SiDoCodeName"]));
    }catch(e){setError(e instanceof Error?e.message:"Backend недоступен")}
    finally{setLoading(false)}
  }
  useEffect(()=>{void load()},[]);
  useEffect(()=>{
    if(!filter.brand_id){setModels([]);return}
    api("/api/catalog/brands/"+encodeURIComponent(filter.brand_id)+"/models").then(d=>setModels(d.items||[])).catch(()=>setModels([]));
  },[filter.brand_id]);
  useEffect(()=>{
    if(!filter.model_id){setDetails([]);return}
    api("/api/catalog/models/"+encodeURIComponent(filter.model_id)+"/details").then(d=>setDetails(d.items||[])).catch(()=>setDetails([]));
  },[filter.model_id]);
  useEffect(()=>{
    if(!filter.model_detail_id){setGrades([]);return}
    api("/api/catalog/model-details/"+encodeURIComponent(filter.model_detail_id)+"/grades").then(d=>setGrades(d.items||[])).catch(()=>setGrades([]));
  },[filter.model_detail_id]);
  useEffect(()=>{
    if(!filter.grade_id){setGradeDetails([]);return}
    api("/api/catalog/grades/"+encodeURIComponent(filter.grade_id)+"/details").then(d=>setGradeDetails(d.items||[])).catch(()=>setGradeDetails([]));
  },[filter.grade_id]);
  useEffect(()=>{
    if(!filter.sido_ids.length){setAreas([]);setDanji([]);return}
    api("/api/catalog/sido/"+filter.sido_ids[0]+"/areas").then(d=>setAreas(d.items||[])).catch(()=>setAreas([]));
  },[filter.sido_ids]);
  useEffect(()=>{
    if(!filter.sido_area_ids.length){setDanji([]);return}
    api("/api/catalog/sido-areas/"+filter.sido_area_ids[0]+"/danji").then(d=>setDanji(d.items||[])).catch(()=>setDanji([]));
  },[filter.sido_area_ids]);

  const active=useMemo(()=>filters.filter(f=>f.enabled).length,[filters]);
  const patchFilter=(p:Partial<FilterDraft>)=>setFilter(v=>({...v,...p}));
  const clearFrom=(level:"brand"|"model"|"detail"|"grade")=>{
    if(level==="brand")patchFilter({model_id:null,model_detail_id:null,grade_id:null,grade_detail_id:null});
    if(level==="model")patchFilter({model_detail_id:null,grade_id:null,grade_detail_id:null});
    if(level==="detail")patchFilter({grade_id:null,grade_detail_id:null});
    if(level==="grade")patchFilter({grade_detail_id:null});
  };

  async function saveFilter(){
    try{
      setError("");
      const payload={...filter,min_year:filter.min_year||null,max_year:filter.max_year||null,min_mileage:filter.min_mileage||null,max_mileage:filter.max_mileage||null,min_price:filter.min_price||null,max_price:filter.max_price||null};
      const saved:Filter=editing?await api("/api/filters/"+editing,{method:"PATCH",body:JSON.stringify(payload)}):await api("/api/filters",{method:"POST",body:JSON.stringify(payload)});
      setFilters(v=>editing?v.map(x=>x.id===saved.id?saved:x):[...v,saved]);setEditing(null);setFilter({...emptyFilter});
    }catch(e){setError(e instanceof Error?e.message:"Не удалось сохранить фильтр")}
  }
  async function removeFilter(id:number){
    if(!confirm("Удалить фильтр?"))return;
    try{await api("/api/filters/"+id,{method:"DELETE"});setFilters(v=>v.filter(x=>x.id!==id))}
    catch(e){setError(e instanceof Error?e.message:"Не удалось удалить фильтр")}
  }
  async function toggleFilter(f:Filter){
    try{const saved=await api("/api/filters/"+f.id,{method:"PATCH",body:JSON.stringify({...f,enabled:!f.enabled})});setFilters(v=>v.map(x=>x.id===f.id?saved:x))}
    catch(e){setError(e instanceof Error?e.message:"Не удалось изменить фильтр")}
  }
  async function search(){
    try{setSearching(true);setError("");const data=await api("/api/search",{method:"POST",body:JSON.stringify(filter)});setCars(data.items||[]);if(!(data.items||[]).length)setError("Автомобили не найдены или поиск CarManager ещё не настроен.")}
    catch(e){setError(e instanceof Error?e.message:"Поиск не выполнен")}finally{setSearching(false)}
  }
  async function updateMonitor(patch:Partial<Monitor>){
    try{setSettingsSaving(true);const data=await api("/api/monitor/settings",{method:"PATCH",body:JSON.stringify(patch)});setMonitor(data)}
    catch(e){setError(e instanceof Error?e.message:"Не удалось изменить монитор")}finally{setSettingsSaving(false)}
  }

  return <div className="page">
    <header className="topbar">
      <div><div className="eyebrow">CARMANAGER MONITOR</div><h1>Мониторинг автомобилей</h1></div>
      <div className="top-actions"><span className="user-badge">{user.username}</span><button onClick={()=>setTelegramOpen(true)}>Настройки</button><button onClick={onLogout}>Выйти</button></div>
    </header>
    <main className="layout">
      <aside className="sidebar">
        <div className="card">
          <div className="card-title">МОНИТОРИНГ</div>
          <div className="monitor-row"><div><b>{monitor.enabled?"Включён":"Выключен"}</b><small>{intervalLabel(monitor.interval_minutes)}</small></div><button className={monitor.enabled?"switch active":"switch"} onClick={()=>void updateMonitor({enabled:!monitor.enabled})} disabled={settingsSaving}>{monitor.enabled?"ON":"OFF"}</button></div>
          <div className="intervals">{[1,5,10,15,30,60].map(n=><button key={n} className={monitor.interval_minutes===n?"selected":""} onClick={()=>void updateMonitor({interval_minutes:n})}>{intervalLabel(n)}</button>)}</div>
          {monitor.next_run_at&&<div className="next">Следующая проверка: {new Date(monitor.next_run_at+"Z").toLocaleString("ru-RU")}</div>}
          <button className="secondary" onClick={()=>void api("/api/monitor/run-once").then(load).catch(e=>setError(e.message))}>Проверить сейчас</button>
        </div>
        <div className="card">
          <div className="card-title">{editing?"РЕДАКТИРОВАНИЕ ФИЛЬТРА":"НОВЫЙ ФИЛЬТР"}</div>
          <input placeholder="Название фильтра" value={filter.name} onChange={e=>setFilter({...filter,name:e.target.value})}/>
          <label>Марка</label>
          <select value={filter.brand_id||""} onChange={e=>setFilter({...filter,brand_id:e.target.value||null,model_id:null})}><option value="">Все марки</option>{brands.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select>
          <label>Модель</label>
          <select value={filter.model_id||""} disabled={!filter.brand_id} onChange={e=>setFilter({...filter,model_id:e.target.value||null})}><option value="">Все модели</option>{models.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select>
          <div className="grid2"><NumberField title="Год от" value={filter.min_year} set={v=>setFilter({...filter,min_year:v})}/><NumberField title="Год до" value={filter.max_year} set={v=>setFilter({...filter,max_year:v})}/></div>
          <div className="grid2"><NumberField title="Пробег от" value={filter.min_mileage} set={v=>setFilter({...filter,min_mileage:v})}/><NumberField title="Пробег до" value={filter.max_mileage} set={v=>setFilter({...filter,max_mileage:v})}/></div>
          <div className="grid2"><NumberField title="Цена от" value={filter.min_price} set={v=>setFilter({...filter,min_price:v})}/><NumberField title="Цена до" value={filter.max_price} set={v=>setFilter({...filter,max_price:v})}/></div>
          <button className="primary" onClick={()=>void saveFilter()}>{editing?"Сохранить изменения":"Добавить фильтр"}</button>
          {editing&&<button className="link" onClick={()=>{setEditing(null);setFilter({...emptyFilter})}}>Отмена</button>}
        </div>
      </aside>
      <section className="content">
        {error&&<div className="error">{error}<button onClick={()=>setError("")}>×</button></div>}
        <div className="card filters-card">
          <div className="section-head"><div><div className="eyebrow">АКТИВНЫЕ ФИЛЬТРЫ</div><h2>Ваши запросы</h2></div><b>{active} / {filters.length}</b></div>
          {loading?<div className="empty">Загрузка...</div>:filters.length===0?<div className="empty">Фильтров пока нет. Создайте первый слева.</div>:<div className="filter-list">{filters.map(f=><div className={f.enabled?"filter-item":"filter-item disabled"} key={f.id}><div><strong>{f.name}</strong><span>{f.brand_id||"Все марки"} {f.model_id?"/ "+f.model_id:""} · {f.min_price||"0"} — {f.max_price||"∞"} · {f.min_mileage||"0"} — {f.max_mileage||"∞"} км</span></div><div className="actions"><button onClick={()=>void toggleFilter(f)}>{f.enabled?"Выкл":"Вкл"}</button><button onClick={()=>{setEditing(f.id);setFilter({...f})}}>Изменить</button><button className="danger" onClick={()=>void removeFilter(f.id)}>Удалить</button></div></div>)}</div>}
        </div>
        <div className="card">
          <div className="section-head"><div><div className="eyebrow">ПОИСК</div><h2>Автомобили</h2></div><button className="search-button" onClick={()=>void search()} disabled={searching}>{searching?"Поиск...":"Искать по CarManager"}</button></div>
          {cars.length===0?<div className="empty large"><div className="car-icon">🚗</div><h3>Результаты появятся здесь</h3><p>Поиск использует авторизованную сессию CarManager.</p></div>:<div className="cars">{cars.map(c=><article className="car" key={c.id}>{c.image_url&&<img src={c.image_url}/>}<div className="car-body"><div className="car-title">{c.title}</div><div className="car-meta">{c.year||"—"} · {fmt(c.mileage)} км · {fmt(c.price)}</div><div className="car-location">{c.location||"—"}</div>{c.url&&<a href={c.url} target="_blank" rel="noreferrer">Открыть объявление →</a>}</div></article>)}</div>}
        </div>
      </section>
    </main>
    {telegramOpen&&<TelegramSettings onClose={()=>setTelegramOpen(false)}/>}
  </div>;
}

function MultiSelect({title,items,selected,set}:{title:string;items:Option[];selected:string[];set:(v:string[])=>void}){
  const toggle=(id:string)=>set(selected.includes(id)?selected.filter(x=>x!==id):[...selected,id]);
  return <div className="multi"><label>{title}{selected.length?" ("+selected.length+")":""}</label><div className="multi-list">{items.length===0?<span className="muted">Нет данных</span>:items.map(x=><label className="check" key={x.id}><input type="checkbox" checked={selected.includes(x.id)} onChange={()=>toggle(x.id)}/><span>{x.name}</span></label>)}</div></div>;
}

function NumberField({title,value,set}:{title:string,value:number|null,set:(v:number|null)=>void}){
  return <div><label>{title}</label><input type="number" value={value??""} onChange={e=>set(e.target.value?Number(e.target.value):null)}/></div>
}

export default function App(){
  const [user,setUser]=useState<User|null>(null);
  const [checking,setChecking]=useState(true);
  useEffect(()=>{
    if(!token()){setChecking(false);return}
    api("/api/auth/me").then(setUser).catch(()=>clearToken()).finally(()=>setChecking(false));
  },[]);
  function logout(){clearToken();setUser(null);}
  if(checking)return <div className="auth-page"><div className="auth-card">Проверка сессии...</div></div>;
  return user?<Dashboard user={user} onLogout={logout}/>:<LoginScreen onLogin={setUser}/>;
}
