# LandlordKit

**Free operations system for independent landlords managing 1–10 properties.**

Live site → [moinmalik-lab.github.io/landlordkit](https://moinmalik-lab.github.io/landlordkit)

---

## What it is

LandlordKit replaces the spreadsheets, paper forms, and memory that small landlords use to run their properties. Every tool runs entirely in the browser — no sign-up, no subscription, no data leaving the device.

Built by a CPA with 17+ years of US landlord bookkeeping experience.

---

## Features

| Section | Tools |
|---|---|
| **Income** | Rent roll, payment log, late rent tracker, deposit register |
| **Expenses** | Expense log (Schedule E-aligned), mortgage tracker, annual summary |
| **Maintenance** | Work order log, tenant request form, contractor directory |
| **Tenants** | Profiles, lease tracker, move-in / move-out records |
| **Documents** | 10 templates: lease, receipts, notices, inspection forms |
| **Reports** | Monthly cash flow, quarterly summary, year-end P&L |
| **Calculators** | Break-even rent, late fee by state, rental yield, deposit return |

---

## Tech stack

- Pure HTML + CSS + Vanilla JS — no framework, no build step
- Data persists via `localStorage` — works offline after first load
- Shared design system in `assets/css/main.css`
- Shared nav + utilities in `assets/js/nav.js`
- Deployed via GitHub Pages

---

## Project structure

```
landlordkit/
├── index.html                  # Homepage
├── assets/
│   ├── css/main.css            # Full design system
│   └── js/nav.js               # Shared nav + utilities
├── income/
│   ├── rent-roll.html          # ✅ Fully functional
│   ├── payment-log.html
│   ├── late-tracker.html
│   └── deposit-register.html
├── expenses/
│   ├── index.html              # Expense log
│   ├── mortgage-tracker.html
│   └── annual-summary.html
├── maintenance/
│   ├── index.html
│   ├── request-form.html
│   ├── work-orders.html
│   └── contractor-directory.html
├── tenants/
│   ├── index.html
│   ├── lease-tracker.html
│   └── move-in.html
├── documents/
│   ├── index.html
│   └── [10 template pages]
├── reports/
│   ├── index.html
│   ├── quarterly.html
│   └── annual.html
└── calculators/
    ├── break-even.html         # ✅ Fully functional
    ├── late-fee.html
    ├── rental-yield.html
    └── deposit-return.html
```

---

## Deployment

This site is deployed via **GitHub Pages** from the `main` branch, root directory.

To deploy your own copy:
1. Fork this repo
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)`
4. Your site will be live at `https://yourusername.github.io/landlordkit`

---

## Development phases

- **Phase 1 ✅** — Homepage, rent roll (with localStorage), break-even calculator, design system, nav, 32-page structure
- **Phase 2** — Expense log, maintenance request form, tenant profiles, late fee calculator
- **Phase 3** — All document templates (fillable PDF/print), full report suite
- **Phase 4** — Late fee by state (all 50), deposit return calculator, rental yield calculator

---

## Built by

[A&M Offshore Accounting](https://amoffshorebookkeeping.com) — US bookkeeping and accounting services for small businesses and landlords.

---

## License

Free to use. Attribution appreciated but not required.
