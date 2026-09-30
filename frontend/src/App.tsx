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
  name:"", enabled:true, brand_id:null, model_id:null, model_detail_id:null, grade_id:null, grade_detail_id:null,
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
  if (!res.ok) {
    const detail = Array.isArray(data.detail)
      ? data.detail.map((x:any)=>x.msg || x.message || JSON.stringify(x)).join("; ")
      : (typeof data.detail === "string" ? data.detail : "Ошибка запроса");
    throw new Error(detail);
  }
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

function FilterModal({initial,onClose,onSaved,brands,fuel,mission}:{initial:Filter|null;onClose:()=>void;onSaved:(f:Filter)=>void;brands:Option[];fuel:Option[];mission:Option[]}){
  const [f,setF]=useState<FilterDraft>(initial?{...initial}:{...emptyFilter});
  const [models,setModels]=useState<Option[]>([]);
  const [details,setDetails]=useState<Option[]>([]);
  const [grades,setGrades]=useState<Option[]>([]);
  const [error,setError]=useState("");
  const [saving,setSaving]=useState(false);
  const patch=(p:Partial<FilterDraft>)=>setF(v=>({...v,...p}));
  useEffect(()=>{if(!f.brand_id){setModels([]);return} api("/api/catalog/brands/"+encodeURIComponent(f.brand_id)+"/models").then(d=>setModels(d.items||[])).catch(()=>setModels([]))},[f.brand_id]);
  useEffect(()=>{if(!f.model_id){setDetails([]);return} api("/api/catalog/models/"+encodeURIComponent(f.model_id)+"/details").then(d=>setDetails(d.items||[])).catch(()=>setDetails([]))},[f.model_id]);
  useEffect(()=>{if(!f.model_detail_id){setGrades([]);return} api("/api/catalog/model-details/"+encodeURIComponent(f.model_detail_id)+"/grades").then(d=>setGrades(d.items||[])).catch(()=>setGrades([]))},[f.model_detail_id]);
  const num=(k:"min_year"|"max_year"|"min_mileage"|"max_mileage"|"min_price"|"max_price",v:string)=>patch({[k]:v===""?null:Number(v)} as Partial<FilterDraft>);
  async function save(){
    setError("");
    if(f.min_year!=null&&(f.min_year<1900||f.min_year>2100)){setError("Год должен быть от 1900 до 2100");return}
    if(f.min_year!=null&&f.max_year!=null&&f.min_year>f.max_year){setError("Год от не может быть больше года до");return}
    if(f.min_mileage!=null&&f.max_mileage!=null&&f.min_mileage>f.max_mileage){setError("Пробег от не может быть больше пробега до");return}
    if(f.min_price!=null&&f.max_price!=null&&f.min_price>f.max_price){setError("Цена от не может быть больше цены до");return}
    try{setSaving(true);const saved:Filter=await api(initial?"/api/filters/"+initial.id:"/api/filters",{method:initial?"PATCH":"POST",body:JSON.stringify({...f,name:f.name.trim()||"Новый фильтр"})});onSaved(saved)}
    catch(e){setError(e instanceof Error?e.message:"Не удалось сохранить фильтр")}finally{setSaving(false)}
  }
  const toggle=(key:"fuel_ids"|"mission_ids",id:string)=>patch({[key]:f[key].includes(id)?f[key].filter(x=>x!==id):[...f[key],id]} as Partial<FilterDraft>);
  return <div className="filter-overlay"><div className="filter-modal">
    <div className="filter-modal-header"><div><h2>{initial?"Редактировать фильтр":"Новый фильтр"}</h2><p>Настройте параметры поиска автомобиля</p></div><button className="close-button" onClick={onClose}>×</button></div>
    {error&&<div className="form-error">{error}</div>}
    <form className="filter-form" onSubmit={e=>{e.preventDefault();void save()}}>
      <div className="field"><label>Название фильтра</label><input value={f.name} onChange={e=>patch({name:e.target.value})} placeholder="Например: BMW X5"/></div>
      <div className="field"><label>Марка</label><select value={f.brand_id||""} onChange={e=>patch({brand_id:e.target.value||null,model_id:null,model_detail_id:null,grade_id:null,grade_detail_id:null})}><option value="">Все марки</option>{brands.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></div>
      <div className="field"><label>Модель</label><select value={f.model_id||""} disabled={!f.brand_id} onChange={e=>patch({model_id:e.target.value||null,model_detail_id:null,grade_id:null,grade_detail_id:null})}><option value="">{f.brand_id?"Все модели":"Сначала выберите марку"}</option>{models.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></div>
      <div className="field"><label>Поколение / версия</label><select value={f.model_detail_id||""} disabled={!f.model_id} onChange={e=>patch({model_detail_id:e.target.value||null,grade_id:null,grade_detail_id:null})}><option value="">Все поколения</option>{details.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></div>
      <div className="field"><label>Комплектация</label><select value={f.grade_id||""} disabled={!f.model_detail_id} onChange={e=>patch({grade_id:e.target.value||null,grade_detail_id:null})}><option value="">Любая комплектация</option>{grades.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></div>
      <div className="field"><label>Год выпуска</label><div className="field-row"><select value={f.min_year??""} onChange={e=>num("min_year",e.target.value)}><option value="">От</option>{Array.from({length:30},(_,i)=>2026-i).map(y=><option key={y}>{y}</option>)}</select><select value={f.max_year??""} onChange={e=>num("max_year",e.target.value)}><option value="">До</option>{Array.from({length:30},(_,i)=>2026-i).map(y=><option key={y}>{y}</option>)}</select></div></div>
      <div className="field"><label>Цена, KRW</label><div className="field-row"><input type="number" min="0" value={f.min_price??""} onChange={e=>num("min_price",e.target.value)} placeholder="От"/><input type="number" min="0" value={f.max_price??""} onChange={e=>num("max_price",e.target.value)} placeholder="До"/></div><div className="preset-list">{[500,1000,1500,2000,2500,3000,4000,5000].map(v=><button type="button" className="preset" key={v} onClick={()=>patch({max_price:v})}>{v}</button>)}</div></div>
      <div className="field"><label>Пробег, км</label><div className="field-row"><input type="number" min="0" value={f.min_mileage??""} onChange={e=>num("min_mileage",e.target.value)} placeholder="От"/><input type="number" min="0" value={f.max_mileage??""} onChange={e=>num("max_mileage",e.target.value)} placeholder="До"/></div><div className="preset-list">{[30000,50000,70000,90000,120000,150000,200000].map(v=><button type="button" className="preset" key={v} onClick={()=>patch({max_mileage:v})}>{fmt(v)}</button>)}</div></div>
      <div className="field"><label>Топливо</label><div className="preset-list">{fuel.length?fuel.map(x=><button type="button" className={f.fuel_ids.includes(x.id)?"preset active":"preset"} key={x.id} onClick={()=>toggle("fuel_ids",x.id)}>{x.name}</button>):<span>Нет данных</span>}</div></div>
      <div className="field"><label>Коробка передач</label><div className="preset-list">{mission.length?mission.map(x=><button type="button" className={f.mission_ids.includes(x.id)?"preset active":"preset"} key={x.id} onClick={()=>toggle("mission_ids",x.id)}>{x.name}</button>):<span>Нет данных</span>}</div></div>
      <div className="form-actions"><button type="button" className="cancel-button" onClick={onClose}>Отмена</button><button className="save-button" disabled={saving}>{saving?"Сохранение...":initial?"Сохранить":"Добавить фильтр"}</button></div>
    </form>
  </div></div>
}

function FilterCard({f,onToggle,onEdit,onDelete}:{f:Filter;onToggle:()=>void;onEdit:()=>void;onDelete:()=>void}){
  const summary=[f.brand_id?"Марка: "+f.brand_id:"Все марки",f.model_id?"Модель: "+f.model_id:"Все модели",f.min_year||f.max_year?"Год: "+(f.min_year||"—")+"–"+(f.max_year||"—"):"Любой год",f.min_price||f.max_price?"Цена: "+fmt(f.min_price)+"–"+fmt(f.max_price):"Любая цена",f.min_mileage||f.max_mileage?"Пробег: "+fmt(f.min_mileage)+"–"+fmt(f.max_mileage)+" км":"Любой пробег"].join(" · ");
  return <div className={f.enabled?"filter-card":"filter-card filter-card-disabled"}><div className="filter-summary"><strong>{f.name}</strong><span>{summary}</span></div><div className="filter-card-actions"><button onClick={onToggle}>{f.enabled?"Выключить":"Включить"}</button><button onClick={onEdit}>Изменить</button><button className="danger" onClick={onDelete}>Удалить</button></div></div>
}

function Dashboard({user,onLogout}:{user:User;onLogout:()=>void}){
  const[filters,setFilters]=useState<Filter[]>([]),[brands,setBrands]=useState<Option[]>([]),[fuel,setFuel]=useState<Option[]>([]),[mission,setMission]=useState<Option[]>([]),[monitor,setMonitor]=useState<Monitor>({enabled:false,interval_minutes:10,next_run_at:null}),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[modal,setModal]=useState<"filter"|"telegram"|null>(null),[editing,setEditing]=useState<Filter|null>(null),[error,setError]=useState(""),[cars,setCars]=useState<Car[]>([]),[searching,setSearching]=useState(false);
  async function load(){try{setLoading(true);setError("");const[b,f,m,c]=await Promise.all([api("/api/catalog/brands"),api("/api/filters"),api("/api/monitor/status"),api("/api/catalog/car-filters")]);setBrands(b.items||[]);setFilters(f||[]);setMonitor(m);const norm=(a:any[],id:string,name:string)=> (a||[]).map(x=>({id:String(x[id]??""),name:String(x[name]??"")})).filter(x=>x.id&&x.name);setFuel(norm(c.fuel,"FKeyNo","FuelName"));setMission(norm(c.mission,"MKeyNo","MissionName"))}catch(e){setError(e instanceof Error?e.message:"Не удалось загрузить данные")}finally{setLoading(false)}}
  useEffect(()=>{void load()},[]);
  const active=useMemo(()=>filters.filter(x=>x.enabled).length,[filters]);
  async function toggle(f:Filter){try{const x=await api("/api/filters/"+f.id,{method:"PATCH",body:JSON.stringify({...f,enabled:!f.enabled})});setFilters(v=>v.map(y=>y.id===x.id?x:y))}catch(e){setError(e instanceof Error?e.message:"Не удалось изменить фильтр")}}
  async function del(f:Filter){if(!confirm("Удалить фильтр «"+f.name+"»?"))return;try{await api("/api/filters/"+f.id,{method:"DELETE"});setFilters(v=>v.filter(x=>x.id!==f.id))}catch(e){setError(e instanceof Error?e.message:"Не удалось удалить фильтр")}}
  async function monitorPatch(p:Partial<Monitor>){try{setSaving(true);const x=await api("/api/monitor/settings",{method:"PATCH",body:JSON.stringify(p)});setMonitor(x)}catch(e){setError(e instanceof Error?e.message:"Не удалось изменить монитор")}finally{setSaving(false)}}
  function exported(){const b=new Blob([JSON.stringify({version:1,exported_at:new Date().toISOString(),filters},null,2)],{type:"application/json"}),u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download="carmanager-monitor-filters.json";a.click();URL.revokeObjectURL(u)}
  async function imported(e:ChangeEvent<HTMLInputElement>){const file=e.target.files?.[0];e.target.value="";if(!file)return;try{const p=JSON.parse(await file.text());if(!Array.isArray(p?.filters))throw new Error("Некорректный JSON");for(const x of p.filters){const created=await api("/api/filters",{method:"POST",body:JSON.stringify({...empty,...x})});setFilters(v=>[...v,created])}}catch(x){setError(x instanceof Error?x.message:"Не удалось импортировать")}}
  async function search(){try{setSearching(true);setError("");await api("/api/monitor/run-once",{method:["P","O","S","T"].join("")});await load()}catch(e){setError(e instanceof Error?e.message:"Проверка не выполнена")}finally{setSearching(false)}}
  return <div className="page"><header className="app-header"><div className="app-logo">CarManager <span>Монитор</span></div><div className="app-header-actions"><button className="logout-button" onClick={onLogout}>Выйти</button><button className={monitor.enabled?"power-button active":"power-button"} onClick={()=>void monitorPatch({enabled:!monitor.enabled})} disabled={saving}>⏻</button></div></header><main className="dashboard">
  <section className={monitor.enabled?"monitor-status enabled":"monitor-status disabled"}><strong>{loading?"Загрузка монитора...":monitor.enabled?"Монитор работает":"Монитор выключен"}</strong><span>{monitor.enabled?"Проверка "+interval(monitor.interval_minutes):"Нажмите кнопку питания справа вверху"}</span>{monitor.enabled&&<small>Следующая проверка: {monitor.next_run_at?new Date(monitor.next_run_at+"Z").toLocaleString("ru-RU"):"—"}</small>}</section>
  <section className="dashboard-card"><div className="section-title">КАК ЧАСТО ПРОВЕРЯТЬ</div><div className="interval-list">{[1,5,10,15,30,60].map(n=><button key={n} className={monitor.interval_minutes===n?"interval-button active":"interval-button"} onClick={()=>void monitorPatch({interval_minutes:n})} disabled={saving}>{interval(n)}</button>)}</div></section>
  <section className="dashboard-card filters-section"><div className="section-title">КАКИЕ МАШИНЫ ИСКАТЬ</div>{error&&<div className="dashboard-error">{error}</div>}{loading?<div className="dashboard-message">Загрузка фильтров...</div>:filters.length===0?<div className="dashboard-message">Пока нет фильтров</div>:<div className="filters-list">{filters.map(f=><FilterCard key={f.id} f={f} onToggle={()=>void toggle(f)} onEdit={()=>{setEditing(f);setModal("filter")}} onDelete={()=>void del(f)}/>)}</div>}<button className="add-filter-button" onClick={()=>{setEditing(null);setModal("filter")}}>+ Добавить фильтр</button><div className="import-export"><button className="outline-button" onClick={exported} disabled={!filters.length}>↓ Экспорт JSON</button><label className="outline-button">↑ Импорт JSON<input hidden type="file" accept=".json,application/json" onChange={e=>void imported(e)}/></label></div></section>
  <section className="dashboard-card telegram-card"><div className="section-title">TELEGRAM УВЕДОМЛЕНИЯ</div><button className="outline-button" onClick={()=>setModal("telegram")}>Управление получателями</button></section>
  <section className="dashboard-card journal-card"><div className="journal-header"><div className="section-title">СОСТОЯНИЕ</div><span>{active} активных фильтр(ов)</span></div><div className="journal"><div>[INFO] Планировщик: {monitor.enabled?"включён":"выключен"}</div><div>[INFO] Интервал: {interval(monitor.interval_minutes)}</div><div>[INFO] Активных фильтров: {active}</div><div>[INFO] Следующая проверка: {monitor.next_run_at?new Date(monitor.next_run_at+"Z").toLocaleString("ru-RU"):"—"}</div></div><div className="journal-actions"><button className="outline-button" onClick={()=>void load()}>Обновить</button><button className="outline-button" onClick={()=>setError("")}>Очистить ошибки</button></div></section>
  <section className="dashboard-card"><div className="section-title">ПОИСК</div><button className="primary-button" onClick={()=>void search()} disabled={searching}>{searching?"Поиск...":"Проверить сейчас"}</button>{cars.length>0&&<div className="car-results">{cars.map(c=><article className="car-result" key={c.id}>{c.image_url&&<img src={c.image_url}/>}<div><h3>{c.title}</h3><p>{c.year||"—"} · {fmt(c.mileage)} км · {fmt(c.price)}</p><p>{c.location||"—"}</p></div></article>)}</div>}</section>
</main>{modal==="filter"&&<FilterModal initial={editing} onClose={()=>{setModal(null);setEditing(null)}} onSaved={f=>{setFilters(v=>editing?v.map(x=>x.id===f.id?f:x):[...v,f]);setEditing(null);setModal(null)}} brands={brands} fuel={fuel} mission={mission}/>} {modal==="telegram"&&<TelegramSettings onClose={()=>setModal(null)}/>}</div>
}
function MultiSelect({title,items,selected,set}:{title:string;items:Option[];selected:string[];set:(v:string[])=>void}){
  const toggle=(id:string)=>set(selected.includes(id)?selected.filter(x=>x!==id):[...selected,id]);
  return <div className="multi"><label>{title}{selected.length?" ("+selected.length+")":""}</label><div className="multi-list">{items.length===0?<span className="muted">Нет данных</span>:items.map(x=><label className="check" key={x.id}><input type="checkbox" checked={selected.includes(x.id)} onChange={()=>toggle(x.id)}/><span>{x.name}</span></label>)}</div></div>;
}

function NumberField({title,value,set,min,max}:{title:string,value:number|null,set:(v:number|null)=>void,min?:number,max?:number}){
  return <div><label>{title}</label><input type="number" min={min} max={max} value={value??""} onChange={e=>set(e.target.value===""?null:Number(e.target.value))}/></div>
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
