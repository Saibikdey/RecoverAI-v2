# RecoverAI

> **AI-Assisted Revenue Recovery with Deterministic Safety Guardrails**

RecoverAI is a synthetic payment-recovery decisioning system that combines contextual AI diagnosis, structured risk assessment, economic evaluation, and deterministic policy controls to decide how failed payments should be handled.

> **AI RECOMMENDS. ECONOMICS EVALUATES. POLICY ENGINE DECIDES.**

The project was originally developed for the **Razorpay AI Buildathon 2026 — Track 03: AI Revenue Recovery** and has since been evolved into a portfolio-grade decisioning architecture.

---

## 📌 Problem

Failed digital payments are not all the same.

A blind retry strategy can repeatedly retry permanent failures, waste intervention costs, increase customer fatigue, and potentially create unsafe behavior around sensitive payment events.

For example:

* A temporary bank outage may justify a retry.
* An expired card should not be retried.
* A suspected fraud event should be contained immediately.
* A high-value or VIP transaction may require human escalation.
* A low-confidence AI recommendation should not be executed autonomously.

The challenge is therefore not simply **"should we retry?"**

It is:

> **What is the safest and most economically sensible recovery action for this specific failed payment?**

---

## 💡 Solution

RecoverAI processes each failed payment through a controlled decision pipeline:

```text
Payment Event
      │
      ▼
┌──────────────────────────────────────────────┐
│ 1. IDEMPOTENCY / EVENT GUARD                 │
│ • Unique event_id validation                 │
│ • Duplicate execution blocked                │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ 2. STRUCTURED RISK ASSESSMENT                │
│ • Financial exposure                         │
│ • Security / fraud risk                      │
│ • Customer fatigue                           │
│ • Recovery feasibility                       │
│ • Operational urgency                        │
│ • Key risk factors                           │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ 3. AI DIAGNOSTIC LAYER                       │
│ • Contextual root-cause analysis             │
│ • Confidence score                           │
│ • Recommended recovery action                │
│ • Explanation + key factors                  │
│ • Deterministic fallback when unavailable    │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ 4. ECONOMIC EVALUATION                       │
│ • Evaluates candidate actions                │
│ • Simulated recovery probability             │
│ • Expected gross recovery                    │
│ • Intervention cost                          │
│ • Expected net recovery                      │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ 5. DETERMINISTIC POLICY ENGINE               │
│              FINAL AUTHORITY                 │
│ • Action whitelist                           │
│ • Fraud zero-tolerance                       │
│ • Maximum retry guard                        │
│ • Confidence threshold                       │
│ • Expired-card protection                    │
│ • High-value / VIP escalation                │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ 6. POLICY-APPROVED SIMULATION                │
│ • Synthetic recovery outcome                 │
│ • Recovery cost                              │
│ • Net recovery                               │
│ • Fraud loss prevented                       │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ 7. AUDIT & ANALYTICS                         │
│ • Decision reasoning                         │
│ • Policy overrides                           │
│ • Risk profile                               │
│ • Economic evaluation                        │
│ • Idempotency events                         │
│ • Comparative strategy metrics               │
└──────────────────────────────────────────────┘
```

### Architectural principle

The AI layer **never has direct execution authority**.

The AI produces an advisory diagnosis and recommended action. Economic evaluation measures the expected value of available actions. The deterministic Policy Engine then validates the recommendation against hard safety rules and remains the **final execution authority**.

This separation makes the system easier to audit, test, and reason about.

---

## ⚠️ Important: Simulation Only

> **RecoverAI is a controlled synthetic simulation, not a live payment system.**

* All payment records are **100% synthetic**.
* No real money is moved.
* No real payment credentials are used.
* No live banking or payment gateway is connected.
* Recovery outcomes and financial values are generated using documented synthetic probability assumptions.
* Reported recovery metrics are **simulation results**, not production performance claims.
* Seed `42` provides deterministic reproducibility for demonstrations.
* A separate 20-seed evaluation tests whether the strategy gap persists across different synthetic transaction mixes.
* The 20-seed evaluation does **not** establish real-world statistical significance.
* AI confidence is an internal policy signal, **not a calibrated real-world probability of correctness**.

The simulator is intentionally treated as an experimental evaluation environment.

---

# 🛡️ Deterministic Safety Model

RecoverAI uses explicit guardrails between AI recommendations and simulated execution.

| Guardrail                | Trigger                      | Policy Response                  |
| ------------------------ | ---------------------------- | -------------------------------- |
| **Idempotency**          | Duplicate `event_id`         | `DUPLICATE_BLOCKED`              |
| **Action Whitelist**     | Unauthorized proposed action | `ESCALATE`                       |
| **Fraud Protection**     | `SUSPECTED_FRAUD`            | `NO_ACTION`                      |
| **Expired Card**         | `CARD_EXPIRED`               | `ALTERNATE_PAYMENT`              |
| **Maximum Retries**      | Prior retries ≥ 3            | `ALTERNATE_PAYMENT` / `ESCALATE` |
| **Confidence Threshold** | Confidence < 0.65            | `ESCALATE`                       |
| **High-Value / VIP**     | Amount ≥ ₹50,000 or VIP      | `ESCALATE`                       |

### Why deterministic policy?

LLMs are probabilistic systems. Financial decisioning requires predictable boundaries.

RecoverAI therefore follows:

```text
LLM recommendation
       │
       ▼
Deterministic validation
       │
       ├── Unsafe → Override
       │
       └── Safe → Authorize
```

The LLM cannot bypass the Policy Engine.

---

## 🧠 Structured Risk Profile

Before the AI diagnosis is generated, RecoverAI creates a deterministic risk profile containing:

* **Financial exposure**
* **Security risk**
* **Customer fatigue risk**
* **Recovery feasibility**
* **Operational urgency**
* **Customer tier**
* **Retry history**
* **Key risk factors**

This structured context is passed to the AI diagnostic layer so that the model does not reason from the error code alone.

For example, the same `DO_NOT_HONOR` failure can require different handling depending on:

* transaction amount
* customer tier
* previous retries
* security risk
* recovery feasibility

---

# 💰 Economics Evaluation

RecoverAI does not treat the AI recommendation as automatically economically optimal.

The economic layer evaluates the available policy-compatible actions using the synthetic outcome model.

For each candidate action, it estimates:

```text
Expected Gross Recovery
        -
Intervention Cost
        =
Expected Net Recovery
```

The system records:

* recommended action
* recommended action expected net recovery
* economically optimal action
* economically optimal expected net recovery
* simulated recovery probability
* intervention cost

### Important architectural distinction

**Economics evaluates. Policy decides.**

The economic evaluation does **not** override the deterministic safety policy.

A financially attractive action can still be rejected if it violates a safety rule.

---

# 📊 Seed 42 Strategy Comparison

The default demonstration uses **100 synthetic failed payments with seed 42**.

| Metric                            |         RecoverAI |   Simple Rule |   Blind Retry |
| --------------------------------- | ----------------: | ------------: | ------------: |
| Revenue at Risk                   |     ₹3,636,475.84 | ₹3,636,475.84 | ₹3,636,475.84 |
| Gross Recovered                   | **₹2,674,177.71** | ₹2,039,557.48 | ₹1,003,861.09 |
| Intervention Cost                 |     **₹2,555.00** |     ₹1,155.00 |     ₹5,360.00 |
| Net Recovered                     | **₹2,671,622.71** | ₹2,038,402.48 |   ₹998,501.09 |
| Revenue Recovery                  |        **73.54%** |        56.09% |        27.61% |
| Transaction Recovery              |         **84.0%** |         65.0% |         24.0% |
| RecoverAI Retries                 |            **32** |             — |             — |
| Wasted / Failed RecoverAI Retries |             **0** |             — |             — |
| Policy Overrides                  |            **15** |             — |             — |
| Fraud Blocks                      |         **5 / 5** |             — |             — |

All monetary values above represent **synthetic simulated outcomes**.

---

# 🔬 20-Seed Robustness Evaluation

To reduce dependence on a single random transaction mix, RecoverAI includes an automated evaluation across:

* **20 independent seeds**
* **100 synthetic transactions per seed**
* **2,000 total transactions**

Run:

```bash
python3 backend/scripts/evaluate_seeds.py
```

## Aggregate Results

| Metric                         |         RecoverAI |   Simple Rule | Blind Retry |
| ------------------------------ | ----------------: | ------------: | ----------: |
| Mean Gross Recovered           | **₹2,552,810.19** | ₹1,848,440.23 | ₹705,080.11 |
| Mean Intervention Cost         |     **₹2,110.50** |     ₹1,201.75 |   ₹5,387.00 |
| Mean Net Recovered             | **₹2,550,699.69** | ₹1,847,238.48 | ₹699,693.11 |
| Mean Revenue Recovery          |        **68.62%** |        49.91% |      18.90% |
| Mean Transaction Recovery      |        **77.50%** |        58.40% |      20.75% |
| Transaction Recovery Range     |       **71%–84%** |             — |           — |
| Median Transaction Recovery    |         **77.5%** |             — |           — |
| Transaction Recovery Std. Dev. |        **±3.79%** |        ±4.88% |      ±4.58% |

### Economic uplift

**Versus Simple Rule Baseline**

* **+₹703,461.20 mean net revenue**
* **+38.08% net revenue uplift**
* **+19.10 percentage points transaction recovery**

**Versus Blind Retry Baseline**

* **+₹1,851,006.58 mean net revenue**
* **+264.55% net revenue uplift**
* **+56.75 percentage points transaction recovery**

These results demonstrate consistency within the **synthetic simulation model**. They should not be interpreted as evidence of production performance.

---

# 🔐 Fraud Accounting

RecoverAI explicitly separates successful revenue recovery from fraud prevention.

For a suspected fraud transaction:

```text
Status                = FRAUD_BLOCKED
Recovery Action       = NO_ACTION
Revenue Recovered     = ₹0
Fraud Loss Prevented  = Transaction Amount
Intervention Cost     = ₹0
Net Recovered         = ₹0
```

This prevents prevented fraud exposure from being incorrectly reported as recovered revenue.

---

# 🔄 Idempotency

Payment events are protected using unique event identifiers.

A duplicate event cannot trigger another recovery execution.

```text
First event
    ↓
Process normally
    ↓
Persist ProcessedEvent
    ↓
Same event arrives again
    ↓
DUPLICATE_BLOCKED
```

This is particularly important for event-driven financial systems where duplicate delivery can occur.

---

# 🧪 Automated Testing

The current backend test suite contains **22 tests** covering the core decisioning architecture.

Run:

```bash
pytest backend/tests/test_core.py -v
```

Coverage includes:

* Synthetic dataset generation
* Revenue-at-risk calculation
* Structured LLM output validation
* Deterministic fallback behavior
* Risk profile generation
* Policy action whitelist
* Maximum retry guard
* Fraud zero-tolerance guard
* Expired-card guard
* Confidence threshold guard
* High-value / VIP guard
* Authority-boundary invariance
* Idempotency
* Duplicate event blocking
* Independent event execution
* Rule-based baseline
* Three-way strategy analytics
* Economic evaluation
* Fraud accounting
* Multi-seed robustness evaluation
* Batch processing behavior
* Reset / reproducibility behavior

---

# 💻 Tech Stack

### Backend

* Python 3.10+
* FastAPI
* SQLAlchemy
* SQLite
* Pydantic V2
* Pytest
* HTTPX

### Frontend

* React 18
* Vite
* Tailwind CSS
* Lucide React

### AI Diagnostics

* Google Gemini
* OpenAI
* Deterministic heuristic fallback engine

The application can run without an API key by using deterministic fallback diagnosis.

---

# 🚀 Local Setup

## Prerequisites

* Python 3.10+
* Node.js 18+
* npm

## Backend

```bash
cd backend

python3 -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt

pytest tests/test_core.py -v

python3 scripts/evaluate_seeds.py

uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Backend:

```text
http://127.0.0.1:8000
```

## Frontend

In another terminal:

```bash
cd frontend

npm install

npm run build

npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔑 Optional LLM Configuration

RecoverAI works without an external API key through its deterministic fallback engine.

To enable live LLM diagnosis:

```bash
cp .env.example .env
```

Then configure one provider:

```env
GEMINI_API_KEY=<your_api_key>
```

or:

```env
OPENAI_API_KEY=<your_api_key>
```

Never commit `.env` or API credentials.

The application reports whether the current run used:

```text
LLM Mode
```

or:

```text
Deterministic Fallback Mode
```

---

# 🎮 5-Minute Demo

1. Start the backend and frontend.
2. Open the dashboard.
3. Reset the dataset to generate 100 synthetic failed payments.
4. Run the **Blind Retry** baseline.
5. Run the **Rule Baseline**.
6. Run **RecoverAI**.
7. Compare:

   * Gross recovery
   * Intervention cost
   * Net recovery
   * Transaction recovery
   * Policy overrides
   * Fraud blocks
8. Open an individual transaction to inspect the decision pipeline.
9. Inspect the audit trail.
10. Review the architecture and safety model.
11. Run the 20-seed evaluation for robustness.

---

# 🏗️ Project Structure

```text
RecoverAI-v2/
│
├── backend/
│   ├── app/
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── main.py
│   │   ├── routers/
│   │   └── services/
│   │       ├── llm_service.py
│   │       ├── orchestrator.py
│   │       ├── policy_engine.py
│   │       ├── risk_engine.py
│   │       └── simulator.py
│   │
│   ├── scripts/
│   │   └── evaluate_seeds.py
│   │
│   ├── tests/
│   │   └── test_core.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.*
│
├── .env.example
├── .gitignore
└── README.md
```

---

# 🎯 Design Principles

RecoverAI is built around a few core principles:

### 1. AI should advise, not control

The LLM provides contextual reasoning but cannot directly execute financial actions.

### 2. Safety rules must be deterministic

Critical constraints such as fraud blocking and maximum retries should not depend on probabilistic model behavior.

### 3. Economics matters

A recovery action should be evaluated based on expected value, not merely whether it appears technically possible.

### 4. Decisions should be auditable

The system records risk context, AI reasoning, policy decisions, economic evaluation, outcomes, and overrides.

### 5. Simulation claims should remain honest

Synthetic evaluation is useful for testing architecture and strategy behavior, but it is not a substitute for production payment data.

### 6. Reproducibility matters

Deterministic seeds and multi-seed evaluation make strategy comparisons easier to reproduce and inspect.

---

## 📌 Current Status

**RecoverAI-v2 is a portfolio-oriented evolution of the original buildathon prototype.**

Current state:

* ✅ Structured risk engine
* ✅ Context-aware AI diagnosis
* ✅ Deterministic AI fallback
* ✅ Economic action evaluation
* ✅ Deterministic policy authorization
* ✅ Fraud containment
* ✅ Idempotency protection
* ✅ Separate fraud-loss accounting
* ✅ Audit logging
* ✅ Three-way strategy comparison
* ✅ 20-seed robustness evaluation
* ✅ 22-test backend suite
* ✅ Synthetic-data transparency
* ✅ Reproducible evaluation

> **The project remains a controlled simulation. No real payments or customer financial data are processed.**
