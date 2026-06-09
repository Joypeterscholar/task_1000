# MantisBT Setup Guide — Simple Books API

## What Mantis does in this project

MantisBT is the bug tracker. Every time a test fails — whether from
Postman (Newman) or JMeter — a bug is automatically filed in Mantis
via the GitHub Actions pipeline.

---

## 1. Get a free Mantis instance

### Option A — InfinityFree (recommended, free)
1. Sign up at https://infinityfree.net
2. You get a free subdomain: `yourname.infinityfree.net`
3. Download MantisBT from https://mantisbt.org/download.php
4. Upload files via InfinityFree File Manager
5. Create a MySQL DB in their control panel
6. Visit `yourname.infinityfree.net/mantis` to run installer

### Option B — Install locally for demo
```bash
# Using Docker
docker run -d -p 8989:80 \
  -e MANTIS_DB_HOST=host.docker.internal \
  vimagick/mantisbt
# Open http://localhost:8989
```

---

## 2. Create the project in Mantis

1. Log in as admin
2. Go to **Manage → Manage Projects → Create New Project**
3. Fill in:
   - Name: `Simple Books API`
   - Status: `Development`
   - Description: `CRUD API tested with Postman and JMeter`
4. Click **Add Project**

---

## 3. Add categories

Inside the project, go to **Manage → Manage Projects → Simple Books API → Categories**:

- `API Functional`     ← for Postman failures
- `Performance`        ← for JMeter threshold breaches
- `Infrastructure`     ← for CI/deploy failures

---

## 4. Get your API token

1. Log into Mantis
2. Click your username (top right) → **My Account**
3. Click **API Tokens** tab
4. Click **Generate New Token** → name it `github-actions`
5. **Copy the token** — you only see it once!

---

## 5. Add these GitHub Secrets

Go to your repo → **Settings → Secrets → Actions**:

| Secret               | Value                                     |
|---------------------|-------------------------------------------|
| `MANTIS_URL`         | e.g. `https://yourname.infinityfree.net/mantis` |
| `MANTIS_TOKEN`       | The token you just copied                 |
| `MANTIS_PROJECT_ID`  | The number shown next to your project     |

---

## Bug Report Templates

### Template 1 — Postman / Newman failure

```
Summary:    POST /books returns 500 instead of 201
Category:   API Functional
Severity:   Major
Priority:   High

Steps:
1. Send POST /books with valid body {"title":"Test","author":"Author"}
2. Check response

Expected: 201 Created with book object
Actual:   500 Internal Server Error

Tool: Postman (Newman)
CI Run: [paste GitHub Actions run URL]
```

### Template 2 — JMeter performance breach

```
Summary:    GET /books p95 latency exceeds 500ms under load
Category:   Performance
Severity:   Minor
Priority:   Normal

Steps:
1. Run: jmeter -n -t jmeter/books-load-test.jmx -JUSERS=10
2. Check p95 column in HTML report

Expected: p95 < 500ms
Actual:   p95 = 820ms

Tool: Apache JMeter
CI Run: [paste GitHub Actions run URL]
```

---

## How it connects to GitHub Actions

When the CI pipeline detects a failure it runs:

```bash
curl -X POST "https://your-mantis/api/rest/issues" \
  -H "Authorization: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "summary": "Test failure in CI",
    "category": { "name": "API Functional" },
    "project":  { "id": YOUR_PROJECT_ID },
    "severity": { "name": "major" }
  }'
```

This automatically creates a bug in Mantis without you doing anything manually.
