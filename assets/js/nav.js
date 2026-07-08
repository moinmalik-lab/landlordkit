/* LandlordKit — shared navigation + utilities */

const NAV_HTML = `
<nav class="nav">
  <div class="container nav-inner">
    <a href="/landlordkit/index.html" class="nav-logo">
      <div class="nav-logo-mark">
        <svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 22V12h6v10" fill="rgba(255,255,255,.4)"/></svg>
      </div>
      <span class="nav-logo-text">Landlord<span>Kit</span></span>
    </a>
    <div class="nav-links">
      <a href="/landlordkit/income/rent-roll.html"    class="nav-link income"      data-section="income">Income</a>
      <a href="/landlordkit/expenses/index.html"       class="nav-link expenses"    data-section="expenses">Expenses</a>
      <a href="/landlordkit/maintenance/index.html"    class="nav-link maintenance" data-section="maintenance">Maintenance</a>
      <a href="/landlordkit/tenants/index.html"        class="nav-link"             data-section="tenants">Tenants</a>
      <a href="/landlordkit/documents/index.html"      class="nav-link"             data-section="documents">Documents</a>
      <a href="/landlordkit/reports/index.html"        class="nav-link"             data-section="reports">Reports</a>
      <a href="/landlordkit/calculators/break-even.html" class="nav-link"           data-section="calculators">Calculators</a>
    </div>
    <div class="nav-cta">
      <a href="/landlordkit/income/rent-roll.html" class="btn btn-primary btn-sm">Open rent roll →</a>
    </div>
  </div>
</nav>`;

const SIDEBAR_LINKS = [
  { section:'income', label:'Income', color:'income', links:[
    { href:'/landlordkit/income/rent-roll.html', label:'Rent roll' },
    { href:'/landlordkit/income/payment-log.html', label:'Payment log' },
    { href:'/landlordkit/income/late-tracker.html', label:'Late rent tracker' },
    { href:'/landlordkit/income/deposit-register.html', label:'Deposit register' },
  ]},
  { section:'expenses', label:'Expenses', color:'expense', links:[
    { href:'/landlordkit/expenses/index.html', label:'Expense log' },
    { href:'/landlordkit/expenses/mortgage-tracker.html', label:'Mortgage tracker' },
    { href:'/landlordkit/expenses/annual-summary.html', label:'Annual summary' },
  ]},
  { section:'maintenance', label:'Maintenance', color:'maintenance', links:[
    { href:'/landlordkit/maintenance/request-form.html', label:'Request form' },
    { href:'/landlordkit/maintenance/work-orders.html', label:'Work orders' },
    { href:'/landlordkit/maintenance/contractor-directory.html', label:'Contractors' },
  ]},
  { section:'tenants', label:'Tenants', color:'', links:[
    { href:'/landlordkit/tenants/index.html', label:'Tenant profiles' },
    { href:'/landlordkit/tenants/lease-tracker.html', label:'Lease tracker' },
    { href:'/landlordkit/tenants/move-in.html', label:'Move-in record' },
  ]},
  { section:'documents', label:'Documents', color:'', links:[
    { href:'/landlordkit/documents/index.html', label:'All templates' },
    { href:'/landlordkit/documents/lease-agreement.html', label:'Lease agreement' },
    { href:'/landlordkit/documents/rent-receipt.html', label:'Rent receipt' },
  ]},
  { section:'reports', label:'Reports', color:'', links:[
    { href:'/landlordkit/reports/index.html', label:'Monthly cash flow' },
    { href:'/landlordkit/reports/quarterly.html', label:'Quarterly summary' },
    { href:'/landlordkit/reports/annual.html', label:'Year-end report' },
  ]},
  { section:'calculators', label:'Calculators', color:'', links:[
    { href:'/landlordkit/calculators/break-even.html', label:'Break-even rent' },
    { href:'/landlordkit/calculators/late-fee.html', label:'Late fee calculator' },
    { href:'/landlordkit/calculators/rental-yield.html', label:'Rental yield & ROI' },
    { href:'/landlordkit/calculators/deposit-return.html', label:'Deposit return' },
  ]},
];

function buildNav() {
  const existing = document.getElementById('nav-root');
  if (existing) existing.outerHTML = NAV_HTML;
  else document.body.insertAdjacentHTML('afterbegin', NAV_HTML);

  // Highlight active section
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(a => {
    const sec = a.dataset.section;
    if (sec && path.includes('/' + sec + '/')) a.classList.add('active');
  });
}

function buildSidebar(activeSection) {
  const el = document.getElementById('sidebar-root');
  if (!el) return;
  let html = '';
  SIDEBAR_LINKS.forEach(group => {
    const isActive = group.section === activeSection;
    html += `<div class="sidebar-section">
      <div class="sidebar-section-label">${group.label}</div>`;
    group.links.forEach(link => {
      const active = window.location.pathname.includes(link.href.split('/landlordkit')[1]) ? ' active' : '';
      html += `<a href="${link.href}" class="sidebar-link ${group.color}${active}">${link.label}</a>`;
    });
    html += '</div>';
  });
  el.innerHTML = html;
}

// ── UTILITIES ──
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);
const fmt = (n, prefix='$') => {
  if (n === null || n === undefined) return '—';
  const abs = Math.abs(n);
  const str = abs.toLocaleString('en-US', {minimumFractionDigits:0,maximumFractionDigits:0});
  if (n < 0) return `–${prefix}${str}`;
  return `${prefix}${str}`;
};
const fmtCF = n => {
  if (Math.abs(n) < 1) return '±$0';
  return (n >= 0 ? '+$' : '–$') + Math.abs(Math.round(n)).toLocaleString();
};
const pct = n => Math.round(n * 10) / 10 + '%';
const v = id => parseFloat($(id)?.value) || 0;

// ── LOCAL STORAGE HELPERS ──
const lk = {
  get: key => { try { return JSON.parse(localStorage.getItem('lk_' + key)); } catch { return null; } },
  set: (key, val) => { try { localStorage.setItem('lk_' + key, JSON.stringify(val)); } catch {} },
  del: key => { try { localStorage.removeItem('lk_' + key); } catch {} },
};

// ── TOAST ──
function toast(msg, type='success') {
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:999;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:500;box-shadow:0 4px 12px rgba(0,0,0,.15);transition:opacity .3s;background:${type==='success'?'#059669':type==='error'?'#dc2626':'#2563eb'};color:#fff;`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; setTimeout(()=>t.remove(),300); }, 2800);
}

// ── MODAL ──
function showModal(html, onConfirm) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `<div class="modal">${html}</div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target===overlay) overlay.remove(); });
  const confirmBtn = overlay.querySelector('[data-confirm]');
  if (confirmBtn && onConfirm) confirmBtn.addEventListener('click', () => { onConfirm(); overlay.remove(); });
  const cancelBtn = overlay.querySelector('[data-cancel]');
  if (cancelBtn) cancelBtn.addEventListener('click', () => overlay.remove());
  return overlay;
}

document.addEventListener('DOMContentLoaded', buildNav);
