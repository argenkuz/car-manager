# Car Manager Research Plan

## Scope

This repository is for technical research around the public and client-side behavior of Car Manager.

The work is intentionally separated from `encore`.

## Phase 1 — Public surface

- Check the public website.
- Check redirects and HTTP status codes.
- Extract public links, scripts and forms.
- Record public resources without attempting authentication bypass.

## Phase 2 — Mobile application

The Android application is the primary subject:

- package: `kr.co.autocafe.carmanager`
- application name: Car Manager / 카매니저

When an APK is obtained through an authorized source, inspect it locally for:
- package structure;
- embedded URLs;
- API base URLs;
- endpoint path strings;
- HTTP client libraries;
- authentication flow;
- request/response models.

Do not extract or use private credentials, session tokens or personal data.

## Phase 3 — API mapping

For every discovered endpoint, record:

| Field | Meaning |
|---|---|
| method | HTTP method |
| path | endpoint path |
| auth | public / authenticated / unknown |
| parameters | query/path/body parameters |
| response | observed response shape |
| source | website / APK / runtime observation |
| status | confirmed / needs verification |

No endpoint should be treated as confirmed merely because its name appears inside an APK.

## Phase 4 — Reproduction

Only reproduce requests that are:
- public; or
- performed using an account and credentials belonging to the user.

Store sanitized examples. Never commit passwords, access tokens, cookies or personal information.

## Phase 5 — Integration

Only after the API behavior is understood should we decide whether a client, parser or monitoring service is useful.

Possible future structure:

```
src/
├── api/
├── discovery/
├── models/
├── client/
└── cli/
```

The exact architecture should follow what the research discovers rather than copying the Encar project.
