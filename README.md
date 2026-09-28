# Car Manager Research

Отдельный тестовый репозиторий для исследования **Car Manager (카매니저)**.

Официальное приложение:
- Google Play package: `kr.co.autocafe.carmanager`

## Главное

Этот проект **не является частью `encore`**.

Сначала исследуем Car Manager отдельно и только после подтверждения фактического API/поведения будем принимать архитектурные решения.

## Что уже есть

- HTTP-клиент с таймаутом и redirect handling.
- Проверка публичного сайта.
- Проверка страницы приложения Google Play.
- Извлечение публичных ссылок, JavaScript-файлов и HTML-форм.
- Unit-тесты.
- GitHub Actions для запуска тестов.

## Запуск

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
pytest -q
python -m src.probe
```

Для другого адреса:

```bash
CAR_MANAGER_URL=https://www.carmanager.co.kr python -m src.probe
```

## Следующий этап

Следующий технический шаг — получить APK из разрешённого источника и исследовать его локально:

1. найти base URL;
2. найти API paths;
3. определить модели запросов;
4. определить авторизацию;
5. проверить только разрешённые/public запросы;
6. зафиксировать подтверждённые endpoints.

Подробный план: `docs/research-plan.md`.

## Статус

- [x] Репозиторий создан
- [x] Ветка `test-setup`
- [x] Исследовательский каркас
- [x] HTTP client
- [x] Public page discovery
- [x] Tests
- [x] GitHub Actions
- [ ] APK analysis
- [ ] API mapping
- [ ] First integration
