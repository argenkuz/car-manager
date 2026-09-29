import { useEffect, useMemo, useState } from "react";
import "./styles.css";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type Brand = { id: string; name: string };
type Model = { id: string; name: string };
type Car = { id:string; title:string; brand?:string; model?:string; year?:number; mileage?:number; price?:number; location?:string; url?:string; image_url?:string };
type Filter = {
  id:number; name:string; enabled:boolean; brand_id:string|null; model_id:string|null;
  min_year:number|null; max_year:number|null; min_mileage:number|null; max_mileage:number|null;
  min_price:number|null; max_price:number|null;
};

const emptyFilter = {
  name:"Новый фильтр", enabled:true, brand_id:null, model_id:null,
  min_year:null,max_year:null,min_mileage:null,max_mileage:null,min_price:null,max_price:null
};

async function api(path:string, options:RequestInit={}) {
  const res = await fetch(API + path, {headers:{"Content-Type":"application/json",...(options.headers||{})},...options});
  const data = await res.json().catch(()=>({}));
  if (!res.ok) throw new Error(data.detail || "Ошибка запроса");
  return data;
}
const fmt=(n:number|null|undefined)=>n==null?"—":new Intl.NumberFormat("ru-RU").format(n);
const intervalLabel=(n:number)=>n<60?\`каждые \${n} мин\`:\`каждые \${Math.round(n/60)} ч\`;

export default function App(){
  const [brands,setBrands]=useState<Brand[]>([]);
  const [models,setModels]=useState<Model[]>([]);
  const [filters,setFilters]=useState<Filter[]>([]);
  const [filter,setFilter]=useState({...emptyFilter});
  const [editing,setEditing]=useState<number|null>(null);
  const [cars,setCars]=useState<Car[]>([]);
  const [loading,setLoading]=useState(true);
  const [searching,setSearching]=useState(false);
  const [error,setError]=useState("");
  const [monitor,setMonitor]=useState({enabled:false,interval_minutes:10,next_run_at:null as string|null});
  const [settingsSaving,setSettingsSaving]=useState(false);

  async function load(){
    try{
      setLoading(true); setError("");
      const [b,f,m]=await Promise.all([api("/api/catalog/brands"),api("/api/filters"),api("/api/monitor/status")]);
      setBrands(b.items||[]); setFilters(f||[]); setMonitor(m);
    }catch(e){setError(e instanceof Error?e.message:"Backend недоступен")}
    finally{setLoading(false)}
  }
  useEffect(()=>{void load()},[]);

  useEffect(()=>{
    if(!filter.brand_id){setModels([]);return}
    api("/api/catalog/brands/"+encodeURIComponent(filter.brand_id)+"/models")
      .then(d=>setModels(d.items||[])).catch(()=>setModels([]));
  },[filter.brand_id]);

  const active=useMemo(()=>filters.filter(f=>f.enabled).length,[filters]);

  async function saveFilter(){
    try{
      setError("");
      const payload={...filter,
        min_year:filter.min_year||null,max_year:filter.max_year||null,
        min_mileage:filter.min_mileage||null,max_mileage:filter.max_mileage||null,
        min_price:filter.min_price||null,max_price:filter.max_price||null};
      const saved:Filter=editing
        ? await api("/api/filters/"+editing,{method:"PATCH",body:JSON.stringify(payload)})
        : await api("/api/filters",{method:"POST",body:JSON.stringify(payload)});
      setFilters(v=>editing?v.map(x=>x.id===saved.id?saved:x):[...v,saved]);
      setEditing(null); setFilter({...emptyFilter});
    }catch(e){setError(e instanceof Error?e.message:"Не удалось сохранить фильтр")}
  }
  async function removeFilter(id:number){
    if(!confirm("Удалить фильтр?")) return;
    try{await api("/api/filters/"+id,{method:"DELETE"});setFilters(v=>v.filter(x=>x.id!==id))}
    catch(e){setError(e instanceof Error?e.message:"Не удалось удалить фильтр")}
  }
  async function toggleFilter(f:Filter){
    const saved=await api("/api/filters/"+f.id,{method:"PATCH",body:JSON.stringify({...f,enabled:!f.enabled})});
    setFilters(v=>v.map(x=>x.id===f.id?saved:x));
  }
  async function search(){
    try{
      setSearching(true);setError("");
      const data=await api("/api/search",{method:"POST",body:JSON.stringify(filter)});
      setCars(data.items||[]);
      if(!(data.items||[]).length) setError("Автомобили не найдены или CarManager search ещё не настроен.");
    }catch(e){setError(e instanceof Error?e.message:"Поиск не выполнен")}
    finally{setSearching(false)}
  }
  async function updateMonitor(patch:Partial<typeof monitor>){
    try{
      setSettingsSaving(true);
      const data=await api("/api/monitor/settings",{method:"PATCH",body:JSON.stringify(patch)});
      setMonitor(data);
    }catch(e){setError(e instanceof Error?e.message:"Не удалось изменить монитор")}
    finally{setSettingsSaving(false)}
  }

  return <div className="page">
    <header className="topbar">
      <div><div className="eyebrow">CARMANAGER MONITOR</div><h1>Мониторинг автомобилей</h1></div>
      <div className={monitor.enabled?"status on":"status"}><span/> {monitor.enabled?"Монитор работает":"Монитор выключен"}</div>
    </header>

    <main className="layout">
      <aside className="sidebar">
        <div className="card">
          <div className="card-title">МОНИТОРИНГ</div>
          <div className="monitor-row"><div><b>{monitor.enabled?"Включён":"Выключен"}</b><small>{intervalLabel(monitor.interval_minutes)}</small></div>
            <button className={monitor.enabled?"switch active":"switch"} onClick={()=>void updateMonitor({enabled:!monitor.enabled})} disabled={settingsSaving}>{monitor.enabled?"ON":"OFF"}</button>
          </div>
          <div className="intervals">
            {[1,5,10,15,30,60].map(n=><button key={n} className={monitor.interval_minutes===n?"selected":""} onClick={()=>void updateMonitor({interval_minutes:n})}>{intervalLabel(n)}</button>)}
          </div>
          {monitor.next_run_at&&<div className="next">Следующая проверка: {new Date(monitor.next_run_at+"Z").toLocaleString("ru-RU")}</div>}
          <button className="secondary" onClick={()=>void api("/api/monitor/run-once").then(load).catch(e=>setError(e.message))}>Проверить сейчас</button>
        </div>

        <div className="card">
          <div className="card-title">{editing?"РЕДАКТИРОВАНИЕ ФИЛЬТРА":"НОВЫЙ ФИЛЬТР"}</div>
          <input placeholder="Название фильтра" value={filter.name} onChange={e=>setFilter({...filter,name:e.target.value})}/>
          <label>Марка</label>
          <select value={filter.brand_id||""} onChange={e=>setFilter({...filter,brand_id:e.target.value||null,model_id:null})}>
            <option value="">Все марки</option>{brands.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <label>Модель</label>
          <select value={filter.model_id||""} disabled={!filter.brand_id} onChange={e=>setFilter({...filter,model_id:e.target.value||null})}>
            <option value="">Все модели</option>{models.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
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
          {loading?<div className="empty">Загрузка...</div>:filters.length===0?<div className="empty">Фильтров пока нет. Создайте первый слева.</div>:
          <div className="filter-list">{filters.map(f=><div className={f.enabled?"filter-item":"filter-item disabled"} key={f.id}>
            <div><strong>{f.name}</strong><span>{f.brand_id||"Все марки"} {f.model_id?"/ "+f.model_id:""} · {f.min_price||"0"} — {f.max_price||"∞"} · {f.min_mileage||"0"} — {f.max_mileage||"∞"} км</span></div>
            <div className="actions"><button onClick={()=>void toggleFilter(f)}>{f.enabled?"Выкл":"Вкл"}</button><button onClick={()=>{setEditing(f.id);setFilter({...f})}}>Изменить</button><button className="danger" onClick={()=>void removeFilter(f.id)}>Удалить</button></div>
          </div>)}</div>}
        </div>

        <div className="card">
          <div className="section-head"><div><div className="eyebrow">ПОИСК</div><h2>Автомобили</h2></div><button className="search-button" onClick={()=>void search()} disabled={searching}>{searching?"Поиск...":"Искать по CarManager"}</button></div>
          {cars.length===0?<div className="empty large"><div className="car-icon">🚗</div><h3>Результаты появятся здесь</h3><p>Поиск использует авторизованную сессию CarManager. Каталог, фильтры, дедупликация, мониторинг и Telegram вынесены в backend.</p></div>:
          <div className="cars">{cars.map(c=><article className="car" key={c.id}>{c.image_url&&<img src={c.image_url}/>}<div className="car-body"><div className="car-title">{c.title}</div><div className="car-meta">{c.year||"—"} · {fmt(c.mileage)} км · {fmt(c.price)}</div><div className="car-location">{c.location||"—"}</div>{c.url&&<a href={c.url} target="_blank" rel="noreferrer">Открыть объявление →</a>}</div></article>)}</div>}
        </div>
      </section>
    </main>
  </div>
}

function NumberField({title,value,set}:{title:string,value:number|null,set:(v:number|null)=>void}){
  return <div><label>{title}</label><input type="number" value={value??""} onChange={e=>set(e.target.value?Number(e.target.value):null)}/></div>
}
