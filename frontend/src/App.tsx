import { useEffect, useMemo, useState, type ChangeEvent } from "react";
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
      setBusy(true);
      setError("");
      const endpoint = register ? "/api/auth/register" : "/api/auth/login";
      const body = register ? {username,password,master_password:master} : {username,password};
      const data = await api(endpoint,{method:"POST",body:JSON.stringify(body)});
      saveToken(data.access_token);
      onLogin(data.user);
    } catch(e) {
      setError(e instanceof Error ? e.message : "Не удалось выполнить запрос");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page auth-state">
      <form className="auth-card auth-form" onSubmit={(event)=>{event.preventDefault();void submit()}}>
        <h1>CarManager Monitor</h1>
        <p>{register ? "Создайте аккаунт" : "Войдите в аккаунт"}</p>
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Логин" autoComplete="username" minLength={3} maxLength={50} required />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Пароль (минимум 8 символов)" type="password" autoComplete={register ? "new-password" : "current-password"} minLength={8} maxLength={128} required />
        {register && <input value={master} onChange={e=>setMaster(e.target.value)} placeholder="Мастер-пароль" type="password" autoComplete="off" maxLength={128} required />}
        {error && <span className="auth-error">{error}</span>}
        <button type="submit" disabled={busy}>{busy ? "Подождите..." : register ? "Зарегистрироваться" : "Войти"}</button>
        <button type="button" className="auth-switch" onClick={()=>{setRegister(v=>!v);setError("")}}>{register ? "У меня уже есть аккаунт" : "Создать аккаунт"}</button>
      </form>
    </div>
  );
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

function FilterModal({initial,onClose,onSaved,brands,fuel,mission,color,options,sido}:{initial:Filter|null;onClose:()=>void;onSaved:(f:Filter)=>void;brands:Option[];fuel:Option[];mission:Option[];color:Option[];options:Option[];sido:Option[]}){
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
  const toggle=(key:"fuel_ids"|"mission_ids"|"color_ids"|"option_ids"|"sido_ids",id:string)=>patch({[key]:f[key].includes(id)?f[key].filter(x=>x!==id):[...f[key],id]} as Partial<FilterDraft>);
  return <div className="filter-overlay"><div className="filter-modal">
    <div className="filter-modal-header"><div><h1>{initial?"Редактировать фильтр":"Новый фильтр"}</h1><p>Настройте параметры поиска</p></div><button className="close-button" onClick={onClose}>×</button></div>
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
      <div className="field"><label>Цвет</label><div className="preset-list">{color.length?color.map(x=><button type="button" className={f.color_ids.includes(x.id)?"preset active":"preset"} key={x.id} onClick={()=>toggle("color_ids",x.id)}>{x.name}</button>):<span>Нет данных</span>}</div></div>
      <div className="field"><label>Опции</label><div className="preset-list">{options.length?options.map(x=><button type="button" className={f.option_ids.includes(x.id)?"preset active":"preset"} key={x.id} onClick={()=>toggle("option_ids",x.id)}>{x.name}</button>):<span>Нет данных</span>}</div></div>
      <div className="field"><label>Регион</label><div className="preset-list">{sido.length?sido.map(x=><button type="button" className={f.sido_ids.includes(x.id)?"preset active":"preset"} key={x.id} onClick={()=>toggle("sido_ids",x.id)}>{x.name}</button>):<span>Нет данных</span>}</div></div>
      <div className="field"><label>Аварийность</label><select value={f.accident||""} onChange={e=>patch({accident:e.target.value||null})}><option value="">Не важно</option><option value="0">Без ДТП</option><option value="1">С ДТП</option></select></div>
      <div className="form-actions"><button type="button" className="cancel-button" onClick={onClose}>Отмена</button><button className="save-button" disabled={saving}>{saving?"Сохранение...":initial?"Сохранить":"Добавить фильтр"}</button></div>
    </form>
  </div></div>
}

function FilterCard({f,onToggle,onEdit,onDelete}:{f:Filter;onToggle:()=>void;onEdit:()=>void;onDelete:()=>void}) {
  function formatYear() {
    if (f.min_year == null && f.max_year == null) return null;
    return (f.min_year != null ? String(f.min_year) : "—") + " – " + (f.max_year != null ? String(f.max_year) : "—");
  }
  function formatPrice() {
    if (f.min_price == null && f.max_price == null) return null;
    return (f.min_price != null ? f.min_price.toLocaleString("ru-RU") : "0") + " – " + (f.max_price != null ? f.max_price.toLocaleString("ru-RU") : "∞");
  }
  function formatMileage() {
    if (f.min_mileage == null && f.max_mileage == null) return null;
    return (f.min_mileage != null ? f.min_mileage.toLocaleString("ru-RU") : "0") + " – " + (f.max_mileage != null ? f.max_mileage.toLocaleString("ru-RU") : "∞") + " км";
  }
  const year=formatYear(), price=formatPrice(), mileage=formatMileage();
  const carName=[f.brand_id,f.model_id].filter(Boolean).join(" · ");
  return (
    <div className={`filter-card ${f.enabled ? "" : "filter-card-disabled"}`}>
      <div className="filter-card-header">
        <div>
          <div className="filter-name">{f.name}</div>
          {carName && <div className="filter-car-name">{carName}</div>}
        </div>
        <button type="button" className={`filter-toggle ${f.enabled ? "active" : ""}`} onClick={onToggle} aria-label={f.enabled ? "Выключить фильтр" : "Включить фильтр"}><span /></button>
      </div>
      <div className="filter-tags">
        {year && <span className="filter-tag">📅 {year}</span>}
        {price && <span className="filter-tag">💰 {price}</span>}
        {mileage && <span className="filter-tag">🛣 {mileage}</span>}
        {f.fuel_ids.length>0 && <span className="filter-tag">⛽ {f.fuel_ids.length} топливо</span>}
        {f.mission_ids.length>0 && <span className="filter-tag">{f.mission_ids.length} КПП</span>}
        {f.color_ids.length>0 && <span className="filter-tag">🎨 {f.color_ids.length} цвет</span>}
        {f.sido_ids.length>0 && <span className="filter-tag">📍 {f.sido_ids.length} регион</span>}
      </div>
      <div className="filter-card-actions">
        <button type="button" className="filter-edit-button" onClick={onEdit}>✎ Изменить</button>
        <button type="button" className="filter-delete-button" onClick={onDelete}>🗑 Удалить</button>
      </div>
    </div>
  );
}

function Dashboard({user,onLogout}:{user:User;onLogout:()=>void}){
  const [filters,setFilters]=useState<Filter[]>([]),[brands,setBrands]=useState<Option[]>([]),[fuel,setFuel]=useState<Option[]>([]),[mission,setMission]=useState<Option[]>([]),[color,setColor]=useState<Option[]>([]),[options,setOptions]=useState<Option[]>([]),[sido,setSido]=useState<Option[]>([]);
  const [monitor,setMonitor]=useState<Monitor>({enabled:false,interval_minutes:10,next_run_at:null}),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[telegramUnlocked,setTelegramUnlocked]=useState(false),[telegramMasterPassword,setTelegramMasterPassword]=useState(""),[telegramIdInput,setTelegramIdInput]=useState(""),[telegramRecipients,setTelegramRecipients]=useState<{telegram_id:number;created_at:string}[]>([]),[telegramLoading,setTelegramLoading]=useState(false),[telegramError,setTelegramError]=useState(""),[editing,setEditing]=useState<Filter|null>(null),[modal,setModal]=useState<"filter"|null>(null),[error,setError]=useState("");
  const normalize=(a:any[],ids:string[],names:string[]):Option[] => (a||[]).map(x=>{const id=ids.map(k=>x?.[k]).find(v=>v!==undefined&&v!==null&&String(v)!=="");const name=names.map(k=>x?.[k]).find(v=>v!==undefined&&v!==null&&String(v)!=="");return{id:String(id??""),name:String(name??"")}}).filter(x=>x.id&&x.name);
  async function load(){
    try{setLoading(true);setError("");const[b,f,m,c]=await Promise.all([api("/api/catalog/brands"),api("/api/filters"),api("/api/monitor/status"),api("/api/catalog/car-filters")]);setBrands(b.items||[]);setFilters(f||[]);setMonitor(m);setFuel(normalize(c.fuel,["FKeyNo","id","Id"],["FuelName","name","Name"]));setMission(normalize(c.mission,["MKeyNo","id","Id"],["MissionName","name","Name"]));setColor(normalize(c.color,["CKeyNo","id","Id"],["ColorName","name","Name"]));setOptions(normalize([...(c.option_base||[]),...(c.option_etc||[])],["CarOptionNo","OptionNo","id","Id"],["CarOptionName","OptionName","name","Name"]));setSido(normalize(c.sido,["SKeyNo","SidoNo","SiDoNo","id","Id"],["SidoName","SiDoName","name","Name"]))}catch(e){setError(e instanceof Error?e.message:"Не удалось загрузить данные")}finally{setLoading(false)}
  }
  useEffect(()=>{void load()},[]);
  const active=useMemo(()=>filters.filter(x=>x.enabled).length,[filters]);
  async function toggle(f:Filter){try{setError("");const x=await api("/api/filters/"+f.id,{method:"PATCH",body:JSON.stringify({...f,enabled:!f.enabled})});setFilters(v=>v.map(y=>y.id===x.id?x:y))}catch(e){setError(e instanceof Error?e.message:"Не удалось изменить фильтр")}}
  async function del(f:Filter){if(!confirm("Удалить фильтр «"+f.name+"»?"))return;try{setError("");await api("/api/filters/"+f.id,{method:"DELETE"});setFilters(v=>v.filter(x=>x.id!==f.id))}catch(e){setError(e instanceof Error?e.message:"Не удалось удалить фильтр")}}
  async function monitorPatch(p:Partial<Monitor>){try{setSaving(true);setError("");const x=await api("/api/monitor/settings",{method:"PATCH",body:JSON.stringify(p)});setMonitor(x)}catch(e){setError(e instanceof Error?e.message:"Не удалось изменить состояние монитора")}finally{setSaving(false)}}
  async function clearCache(){try{setSaving(true);setError("");await api("/api/catalog/cache/clear",{method:"POST"});await load()}catch(e){setError(e instanceof Error?e.message:"Не удалось очистить кэш")}finally{setSaving(false)}}
  async function openTelegram(){const password=window.prompt("Введите мастер-пароль:");if(!password)return;try{setTelegramLoading(true);setTelegramError("");const data=await api("/api/telegram/recipients",{headers:{"X-Master-Password":password}});setTelegramMasterPassword(password);setTelegramRecipients(data);setTelegramUnlocked(true)}catch(e){setTelegramError(e instanceof Error?e.message:"Не удалось открыть управление Telegram")}finally{setTelegramLoading(false)}}
  async function addTelegram(){const id=Number(telegramIdInput);if(!Number.isSafeInteger(id)||id<=0){setTelegramError("Введите корректный Telegram ID");return}try{setTelegramLoading(true);setTelegramError("");const recipient=await api("/api/telegram/recipients",{method:"POST",headers:{"X-Master-Password":telegramMasterPassword},body:JSON.stringify({telegram_id:id})});setTelegramRecipients(v=>v.some(x=>x.telegram_id===recipient.telegram_id)?v:[...v,recipient]);setTelegramIdInput("")}catch(e){setTelegramError(e instanceof Error?e.message:"Не удалось добавить Telegram ID")}finally{setTelegramLoading(false)}}
  async function removeTelegram(id:number){if(!confirm("Удалить Telegram ID "+id+"?"))return;try{setTelegramLoading(true);setTelegramError("");await api("/api/telegram/recipients/"+id,{method:"DELETE",headers:{"X-Master-Password":telegramMasterPassword}});setTelegramRecipients(v=>v.filter(x=>x.telegram_id!==id))}catch(e){setTelegramError(e instanceof Error?e.message:"Не удалось удалить Telegram ID")}finally{setTelegramLoading(false)}}
  function exported(){const b=new Blob([JSON.stringify({version:1,exported_at:new Date().toISOString(),filters},null,2)],{type:"application/json"}),u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download="carmanager-monitor-filters.json";a.click();URL.revokeObjectURL(u)}
  async function imported(e:ChangeEvent<HTMLInputElement>){const file=e.target.files?.[0];e.target.value="";if(!file)return;try{const p=JSON.parse(await file.text());if(!Array.isArray(p?.filters))throw new Error("Некорректный JSON");for(const x of p.filters){const created=await api("/api/filters",{method:"POST",body:JSON.stringify({...emptyFilter,...x})});setFilters(v=>[...v,created])}}catch(x){setError(x instanceof Error?x.message:"Не удалось импортировать")}}
  return <div className="page"><header className="app-header"><div className="app-logo">CarManager <span>Монитор</span></div><div className="app-header-actions"><button type="button" className="logout-button" onClick={onLogout}>Выйти</button><button type="button" className={monitor.enabled?"power-button active":"power-button"} onClick={()=>void monitorPatch({enabled:!monitor.enabled})} disabled={saving} aria-label={monitor.enabled?"Выключить монитор":"Включить монитор"}>⏻</button></div></header>
  <main className="dashboard">
    <section className={monitor.enabled?"monitor-status enabled":"monitor-status disabled"}><strong>{loading?"Загрузка монитора...":monitor.enabled?"Монитор работает":"Монитор выключен"}</strong><span>{loading?"Получаем настройки...":monitor.enabled?"Проверка каждые "+(monitor.interval_minutes===60?"1 час":monitor.interval_minutes+" мин"):"Нажмите кнопку справа вверху"}</span>{monitor.enabled&&!loading&&<small className="monitor-next-run">Следующая проверка: {monitor.next_run_at?new Date(monitor.next_run_at.endsWith("Z")?monitor.next_run_at:monitor.next_run_at+"Z").toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"}):"—"}</small>}</section>
    <section className="dashboard-card"><div className="section-title">КАК ЧАСТО ПРОВЕРЯТЬ</div><div className="interval-list">{[1,2,5,10,30,60].map(n=><button type="button" key={n} className={monitor.interval_minutes===n?"interval-button active":"interval-button"} onClick={()=>void monitorPatch({interval_minutes:n})} disabled={saving||loading}>{n===60?"1 час":n+" мин"}</button>)}</div></section>
    <section className="dashboard-card filters-section"><div className="section-title">КАКИЕ МАШИНЫ ИСКАТЬ</div>{error&&<div className="dashboard-error">{error}</div>}{loading?<div className="dashboard-message">Загрузка фильтров...</div>:filters.length===0?<div className="dashboard-message">Пока нет фильтров</div>:<div className="filters-list">{filters.map(f=><FilterCard key={f.id} f={f} onToggle={()=>void toggle(f)} onEdit={()=>{setEditing(f);setModal("filter")}} onDelete={()=>void del(f)}/>)}</div>}<button type="button" className="add-filter-button" onClick={()=>{setEditing(null);setModal("filter")}}>+ Добавить фильтр</button><div className="import-export"><button type="button" className="outline-button" onClick={exported} disabled={loading||!filters.length}>↓ Экспорт JSON</button><label className="outline-button">↑ Импорт JSON<input hidden type="file" accept=".json,application/json" onChange={e=>void imported(e)}/></label></div></section>
    <section className="dashboard-card telegram-card"><div className="section-title">TELEGRAM УВЕДОМЛЕНИЯ</div>{!telegramUnlocked?<div className="telegram-management"><div className="telegram-status-row"><span className="telegram-status-dot"/><div><strong>Получатели уведомлений</strong><span>Управление доступно по мастер-паролю</span></div></div><button type="button" className="outline-button telegram-manage-button" onClick={()=>void openTelegram()} disabled={telegramLoading}>{telegramLoading?"Проверка...":"Управление получателями"}</button>{telegramError&&<div className="telegram-management-error">{telegramError}</div>}</div>:<div className="telegram-management"><div className="telegram-recipient-header"><div><strong>Получатели уведомлений</strong><span>Новые автомобили отправляются всем ID из списка</span></div><button type="button" className="outline-button telegram-lock-button" onClick={()=>{setTelegramUnlocked(false);setTelegramMasterPassword("");setTelegramIdInput("");setTelegramError("");setTelegramRecipients([])}}>Заблокировать</button></div>{telegramError&&<div className="telegram-management-error">{telegramError}</div>}<div className="telegram-recipient-list">{telegramRecipients.length===0?<div className="telegram-empty">Получатели ещё не добавлены</div>:telegramRecipients.map(r=><div className="telegram-recipient" key={r.telegram_id}><span>{r.telegram_id}</span><button type="button" className="telegram-delete-button" onClick={()=>void removeTelegram(r.telegram_id)} disabled={telegramLoading}>Удалить</button></div>)}</div><div className="telegram-add-row"><input type="number" min="1" value={telegramIdInput} onChange={e=>setTelegramIdInput(e.target.value)} placeholder="Telegram ID" disabled={telegramLoading}/><button type="button" className="primary-button" onClick={()=>void addTelegram()} disabled={telegramLoading||!telegramIdInput.trim()}>Добавить</button></div></div>}</section>
    <section className="dashboard-card journal-card"><div className="journal-header"><div className="section-title">СОСТОЯНИЕ</div><span>{active} активных фильтра(ов)</span></div><div className="journal"><div>[INFO] Планировщик {monitor.enabled?"работает":"выключен"}</div><div>[INFO] Интервал пользователя: {monitor.interval_minutes===60?"1 час":monitor.interval_minutes+" мин"}</div><div>[INFO] Активных фильтров: {active}</div><div>[INFO] Следующая проверка: {monitor.next_run_at?new Date(monitor.next_run_at.endsWith("Z")?monitor.next_run_at:monitor.next_run_at+"Z").toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"}):"—"}</div></div><div className="journal-actions"><button type="button" className="outline-button" onClick={()=>void load()} disabled={loading||saving}>Обновить</button><button type="button" className="outline-button" onClick={()=>void clearCache()} disabled={saving}>Очистить кэш</button><button type="button" className="outline-button" onClick={()=>setError("")}>Очистить ошибки</button></div></section>
  </main>
  {modal==="filter"&&<FilterModal initial={editing} onClose={()=>{setModal(null);setEditing(null)}} onSaved={f=>{setFilters(v=>editing?v.map(x=>x.id===f.id?f:x):[...v,f]);setEditing(null);setModal(null)}} brands={brands} fuel={fuel} mission={mission} color={color} options={options} sido={sido}/>}
</div>
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
