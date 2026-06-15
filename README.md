# Simple Books API – Automated Testing and CI/CD Pipeline Documentation

# Overview

This project demonstrates how multiple quality assurance and DevOps tools can be integrated into a single automated workflow.

The pipeline combines:

* Jest (Unit Testing)
* Postman + Newman (API Functional Testing)
* Apache JMeter (Performance Testing)
* MantisBT (Defect Tracking)
* GitHub Actions (Continuous Integration)
* Render (Continuous Deployment)

The goal is to ensure that code changes are automatically tested, performance-validated, defects reported, and successful builds deployed without manual intervention.

---

# System Architecture

```
Developer Push
      │
      ▼
GitHub Repository
      │
      ▼
GitHub Actions Workflow
      │
      ├────────► Jest Unit Tests
      │
      ├────────► Postman Collection (Newman)
      │                │
      │                ▼
      │          Functional Validation
      │                │
      │          Failure?
      │                ▼
      │            MantisBT Issue
      │
      ├────────► Apache JMeter
      │                │
      │                ▼
      │          Load Testing
      │                │
      │          Threshold Breach?
      │                ▼
      │            MantisBT Issue
      │
      ▼
All Tests Pass
      │
      ▼
Render Deployment
      │
      ▼
Live Application
```

---

# Project Structure

```
task_1000
│
├── src/
│     ├── server.js
│     └── routes
│
├── tests/
│     └── unit tests
│
├── postman/
│     └── simple-books.postman_collection.json
│
├── jmeter/
│     └── books-load-test.jmx
│
├── results/
│
├── .github/
│     └── workflows/
│            ci.yml
│
└── package.json
```

---

# Tool 1: Jest

## Purpose

Performs unit testing on application logic.

## Installation

```bash
npm install --save-dev jest
```

## Running Locally

```bash
npm test
```

## Example Test

```javascript
describe("Books API", () => {
    test("returns status 200", async () => {
        expect(200).toBe(200);
    });
});
```

---

# Tool 2: Postman

## Purpose

Validates API functionality.

Tests:

* GET books
* POST book
* PUT book
* DELETE book

## Collection

```
postman/simple-books.postman_collection.json
```

---

# Tool 3: Newman

## Purpose

Runs Postman collections automatically.

## Installation

```bash
npm install -g newman
```

## Execute Collection

```bash
newman run postman/simple-books.postman_collection.json
```

## HTML Reports

```bash
npm install -g newman-reporter-htmlextra
```

Run:

```bash
newman run collection.json \
--reporters cli,htmlextra \
--reporter-htmlextra-export report.html
```

---

# Tool 4: Apache JMeter

## Purpose

Performance and load testing.

Simulates multiple users interacting with:

* GET /api/books
* POST /api/books
* PUT /api/books/{id}
* DELETE /api/books/{id}

---

## JMeter Installation

Download:

```
https://archive.apache.org/dist/jmeter/binaries/
```

Version used:

```
5.6.3
```

---

## Running Tests

```bash
jmeter -n \
-t jmeter/books-load-test.jmx \
-l results.jtl \
-e -o report
```

---

## Parameters

```
USERS = 2
RAMP-UP = 2 seconds
LOOPS = 2
```

---

## Metrics Collected

* Throughput
* Error Rate
* Average Response Time
* 95th Percentile (P95)

---

## Threshold Validation

Python script:

```python
if err_rate > MAX_ERROR_RATE:
    sys.exit(1)

if p95 > MAX_P95_MS:
    sys.exit(1)
```

Current limits:

```yaml
MAX_ERROR_RATE: 5
MAX_P95_MS: 2000
```

---

# Tool 5: MantisBT

## Purpose

Automatic defect management.

When tests fail, GitHub Actions creates issues in Mantis automatically.

---

## Required Secrets

```
MANTIS_URL
MANTIS_TOKEN
MANTIS_PROJECT_ID
```

---

## Issue Categories

### Functional Failures

Generated from Newman failures.

Category:

```
API Functional
```

Severity:

```
Major
```

Priority:

```
High
```

---

### Performance Failures

Generated from JMeter threshold breaches.

Category:

```
Performance
```

Severity:

```
Minor
```

Priority:

```
Normal
```

---

# Tool 6: GitHub Actions

## Purpose

Automates the complete QA process.

Workflow location:

```
.github/workflows/ci.yml
```

---

# Pipeline Sequence

## Stage 1

### Jest Tests

```yaml
npm ci
npm test
```

---

## Stage 2

### Newman Tests

Starts API:

```yaml
node src/server.js
```

Executes:

```yaml
newman run collection.json
```

Uploads HTML report.

---

## Stage 3

### JMeter Load Testing

Downloads JMeter.

Runs:

```yaml
jmeter -n ...
```

Generates:

```
results.jtl
HTML Report
```

Thresholds are validated.

---

## Stage 4

### MantisBT

If failures occur:

```bash
curl POST /api/rest/issues
```

creates defect tickets automatically.

---

## Stage 5

### Deployment

Triggered only when:

* Jest passes
* Newman passes
* JMeter passes

Condition:

```yaml
needs:
  - jest
  - postman
  - jmeter
```

---

# Tool 7: Render

## Purpose

Continuous Deployment.

---

## Deployment Hook

Render provides:

```
https://api.render.com/deploy/...
```

Stored in GitHub Secret:

```
RENDER_DEPLOY_HOOK_URL
```

---

## Application URL

Stored as:

```
RENDER_API_URL
```

---

## Deployment Step

```yaml
curl -X POST $RENDER_DEPLOY_HOOK_URL
```

---

# GitHub Secrets

Required:

```
MANTIS_URL
MANTIS_TOKEN
MANTIS_PROJECT_ID

RENDER_DEPLOY_HOOK_URL
RENDER_API_URL
```

---

# Reports Generated

## Postman

Artifact:

```
postman-report.html
```

Contains:

* Passed tests
* Failed tests
* Response times

---

## JMeter

Artifact:

```
jmeter-html/
```

Contains:

* Throughput
* Error percentage
* Response time graphs
* P95 latency

---

# CI/CD Flow Summary

1. Developer pushes code.
2. GitHub Actions starts.
3. Jest executes unit tests.
4. Newman executes API tests.
5. JMeter performs load testing.
6. Failures create MantisBT defects.
7. Successful builds trigger Render deployment.
8. Application becomes available online.

---

# Technologies Used

* Node.js
* Express
* Jest
* Postman
* Newman
* Apache JMeter 5.6.3
* Python
* GitHub Actions
* MantisBT
* Render

---

# Objective

To demonstrate a fully automated software quality assurance pipeline where:

* Testing is continuous.
* Performance validation is enforced.
* Defects are automatically tracked.
* Deployment occurs only after successful validation.

This approach supports DevOps and continuous quality practices and can be adapted to other API projects with minimal modifications.
