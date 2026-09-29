import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type Brand = { id: string; name: string };
type Model = { id: string; name: string };

export default function App() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [message, setMessage] = useState("Загрузка каталога...");

  useEffect(() => {
    fetch(API + "/api/catalog/brands")
      .then((r) => r.json())
      .then((data) => {
        setBrands(data.items || []);
        setMessage(data.items?.length ? "Каталог загружен" : "Каталог пока пуст");
      })
      .catch(() => setMessage("Backend недоступен"));
  }, []);

  useEffect(() => {
    if (!brand) {
      setModels([]);
      setModel("");
      return;
    }
    fetch(API + "/api/catalog/brands/" + brand + "/models")
      .then((r) => r.json())
      .then((data) => setModels(data.items || []))
      .catch(() => setModels([]));
  }, [brand]);

  return (
    <div className="page">
      <header>
        <div>
          <small>CARMANAGER MONITOR</small>
          <h1>Мониторинг автомобилей</h1>
        </div>
        <span className="badge">{message}</span>
      </header>

      <main>
        <section className="panel filters">
          <h2>Фильтры</h2>

          <label>Марка</label>
          <select value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="">Все марки</option>
            {brands.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>

          <label>Модель</label>
          <select value={model} onChange={(e) => setModel(e.target.value)} disabled={!brand}>
            <option value="">Все модели</option>
            {models.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>

          <div className="row">
            <Field title="Год от" />
            <Field title="Год до" />
          </div>
          <div className="row">
            <Field title="Пробег от" />
            <Field title="Пробег до" />
          </div>
          <div className="row">
            <Field title="Цена от" />
            <Field title="Цена до" />
          </div>

          <button>Найти автомобили</button>
        </section>

        <section className="panel results">
          <div className="result-head">
            <div><small>РЕЗУЛЬТАТЫ</small><h2>Автомобили</h2></div>
            <strong>0</strong>
          </div>
          <div className="empty">
            <div>🚗</div>
            <h3>Пока нет результатов</h3>
            <p>Интерфейс и API готовы. После подключения реального search-запроса CarManager здесь появятся автомобили.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

function Field({ title }: { title: string }) {
  return <div className="field"><label>{title}</label><input type="number" /></div>;
}