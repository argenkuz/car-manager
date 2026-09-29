# CarManager backend

Run from backend:

    python -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt

Copy .env.example to .env and fill credentials locally.

    uvicorn app.main:app --reload --port 8000

Endpoints:

    GET /health
    GET /api/catalog/brands
    GET /api/catalog/brands/{brand_id}/models
    GET /api/catalog/models?q=bmw
    POST /api/filters/preview
    GET /api/monitor/status
