/* LandlordKit — shared nav + utilities v2 */

/* Detect root path relative to current page depth */
function getRoot() {
  var path = window.location.pathname;
  var idx = path.indexOf('/landlordkit/');
  var after = idx !== -1 ? path.substring(idx + 13) : path.replace(/^\//, '');
  var depth = (after.match(/\//g) || []).length;
  return depth === 0 ? '' : '../'.repeat(depth);
}

function buildNav() {
  var R = getRoot();
  var path = window.location.pathname;
  function active(seg) { return path.indexOf('/' + seg + '/') !== -1 ? ' active' : ''; }
  var html = '<nav class="nav"><div class="container nav-inner">'
    + '<a href="' + R + 'index.html" class="nav-logo">'
    + '<div class="nav-logo-mark"><svg viewBox="0 0 24 24" fill="white"><path d="M3 9.5L12 3l9 6.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/></svg></div>'
    + '<span class="nav-logo-text">Landlord<span>Kit</span></span></a>'
    + '<div class="nav-links">'
    + '<a href="' + R + 'income/rent-roll.html" class="nav-link income' + active('income') + '">Income</a>'
    + '<a href="' + R + 'expenses/index.html" class="nav-link expenses' + active('expenses') + '">Expenses</a>'
    + '<a href="' + R + 'maintenance/request-form.html" class="nav-link maintenance' + active('maintenance') + '">Maintenance</a>'
    + '<a href="' + R + 'tenants/index.html" class="nav-link' + active('tenants') + '">Tenants</a>'
    + '<a href="' + R + 'documents/index.html" class="nav-link' + active('documents') + '">Documents</a>'
    + '<a href="' + R + 'reports/index.html" class="nav-link' + active('reports') + '">Reports</a>'
    + '<a href="' + R + 'calculators/break-even.html" class="nav-link' + active('calculators') + '">Calculators</a>'
    + '</div>'
    + '<div class="nav-cta"><a href="' + R + 'income/rent-roll.html" class="btn btn-primary btn-sm">Rent roll</a></div>'
    + '</div></nav>';
  var el = document.getElementById('nav-root');
  if (el) el.outerHTML = html;
  else document.body.insertAdjacentHTML('afterbegin', html);
}

var SIDEBAR_CFG = [
  { label:'Income', color:'income', links:[
    ['income/rent-roll.html','Monthly rent roll'],
    ['income/payment-log.html','Payment log'],
    ['income/late-tracker.html','Late rent tracker'],
    ['income/deposit-register.html','Deposit register']
  ]},
  { label:'Expenses', color:'expense', links:[
    ['expenses/index.html','Expense log'],
    ['expenses/mortgage-tracker.html','Mortgage tracker'],
    ['expenses/annual-summary.html','Annual summary']
  ]},
  { label:'Maintenance', color:'maintenance', links:[
    ['maintenance/request-form.html','Request form & log'],
    ['maintenance/work-orders.html','Work orders'],
    ['maintenance/contractor-directory.html','Contractors']
  ]},
  { label:'Tenants', color:'', links:[
    ['tenants/index.html','Tenant profiles'],
    ['tenants/lease-tracker.html','Lease tracker'],
    ['tenants/move-in.html','Move-in record']
  ]},
  { label:'Documents', color:'', links:[
    ['documents/index.html','All templates'],
    ['documents/lease-agreement.html','Lease agreement'],
    ['documents/rent-receipt.html','Rent receipt']
  ]},
  { label:'Reports', color:'', links:[
    ['reports/index.html','Monthly cash flow'],
    ['reports/quarterly.html','Quarterly summary'],
    ['reports/annual.html','Year-end report']
  ]},
  { label:'Calculators', color:'', links:[
    ['calculators/break-even.html','Break-even rent'],
    ['calculators/late-fee.html','Late fee calculator'],
    ['calculators/rental-yield.html','Rental yield & ROI'],
    ['calculators/deposit-return.html','Deposit return']
  ]}
];

function buildSidebar() {
  var el = document.getElementById('sidebar-root');
  if (!el) return;
  var R = getRoot();
  var path = window.location.pathname;
  var html = '';
  SIDEBAR_CFG.forEach(function(g) {
    html += '<div class="sidebar-section"><div class="sidebar-section-label">' + g.label + '</div>';
    g.links.forEach(function(lk) {
      var href = R + lk[0];
      var isCurrent = path.indexOf(lk[0].replace(/^[^/]+\//, '/')) !== -1;
      html += '<a href="' + href + '" class="sidebar-link ' + g.color + (isCurrent ? ' active' : '') + '">' + lk[1] + '</a>';
    });
    html += '</div>';
  });
  el.innerHTML = html;
}

/* Utilities */
var $ = function(id) { return document.getElementById(id); };
var fmt = function(n) {
  if (n === null || n === undefined) return '-';
  var abs = Math.abs(Math.round(n));
  return (n < 0 ? '-$' : '$') + abs.toLocaleString('en-US');
};
var fmtCF = function(n) {
  if (Math.abs(n) < 1) return '$0';
  return (n >= 0 ? '+$' : '-$') + Math.abs(Math.round(n)).toLocaleString('en-US');
};
var gv = function(id) { return parseFloat(document.getElementById(id) && document.getElementById(id).value) || 0; };

/* LocalStorage helpers */
var lk = {
  get: function(key) { try { var v = localStorage.getItem('lk_' + key); return v ? JSON.parse(v) : null; } catch(e) { return null; } },
  set: function(key, val) { try { localStorage.setItem('lk_' + key, JSON.stringify(val)); } catch(e) {} },
  del: function(key) { try { localStorage.removeItem('lk_' + key); } catch(e) {} }
};

/* Toast notification */
function toast(msg, type) {
  var bg = type === 'error' ? '#dc2626' : type === 'warn' ? '#d97706' : '#059669';
  var t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:500;box-shadow:0 4px 16px rgba(0,0,0,.2);background:' + bg + ';color:#fff;transition:opacity .3s;max-width:320px;';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function() { t.style.opacity = '0'; setTimeout(function() { t.remove(); }, 300); }, 3000);
}

/* Modal */
function showModal(title, bodyHtml, onSave, saveLabel) {
  var existing = document.getElementById('lk-modal');
  if (existing) existing.remove();
  var overlay = document.createElement('div');
  overlay.id = 'lk-modal';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px;';
  overlay.innerHTML = '<div style="background:#fff;border-radius:16px;padding:28px;width:100%;max-width:500px;max-height:90vh;overflow-y:auto;box-shadow:0 8px 32px rgba(0,0,0,.18);">'
    + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">'
    + '<h3 style="font-family:var(--font-d);font-size:1.1rem;margin:0;color:var(--txt);">' + title + '</h3>'
    + '<button id="lk-modal-x" style="background:none;border:none;font-size:22px;cursor:pointer;color:var(--txt3);line-height:1;padding:0 4px;">&times;</button>'
    + '</div>' + bodyHtml
    + '<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px;">'
    + '<button id="lk-modal-cancel" style="padding:9px 20px;border-radius:8px;border:1.5px solid var(--border2);background:transparent;font-size:14px;cursor:pointer;font-weight:500;">Cancel</button>'
    + (onSave ? '<button id="lk-modal-save" style="padding:9px 20px;border-radius:8px;border:none;background:var(--blue);color:#fff;font-size:14px;cursor:pointer;font-weight:500;">' + (saveLabel || 'Save') + '</button>' : '')
    + '</div></div>';
  document.body.appendChild(overlay);
  function closeModal() { overlay.remove(); }
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeModal(); });
  document.getElementById('lk-modal-x').addEventListener('click', closeModal);
  document.getElementById('lk-modal-cancel').addEventListener('click', closeModal);
  if (onSave) {
    document.getElementById('lk-modal-save').addEventListener('click', function() {
      var result = onSave();
      if (result !== false) closeModal();
    });
  }
  return overlay;
}


/* ---- Demo data banner + reset ---- */
var LK_KEYS = ['units','tenants','expenses','maintenance','inspections','contractors','isDemo'];

function lkWipe(keepDemo) {
  try {
    var kill = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf('lk_') === 0) kill.push(k);
    }
    kill.forEach(function(k) { localStorage.removeItem(k); });
    if (keepDemo) localStorage.setItem('lk_blank', 'true');
  } catch (e) {}
}

function demoBanner(mountId) {
  var el = document.getElementById(mountId || 'demo-banner');
  if (!el) return;
  if (!lk.get('isDemo')) { el.innerHTML = ''; return; }
  el.innerHTML = '<div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;'
    + 'background:var(--amber-bg);border:1px solid var(--amber-bd);border-radius:var(--r-lg);'
    + 'padding:13px 16px;margin-bottom:20px;">'
    + '<div style="flex:1;min-width:240px;">'
    + '<strong style="font-size:14px;color:var(--amber);font-family:var(--font-d);">You are looking at sample data.</strong>'
    + '<p style="font-size:13.5px;margin:2px 0 0;">These tenants and units are examples so you can see how the tools work. '
    + 'Clear them before entering anything real.</p></div>'
    + '<button id="lk-clear-demo" class="btn btn-sm" style="background:var(--amber);color:#fff;border:none;white-space:nowrap;">Clear sample data</button>'
    + '</div>';
  document.getElementById('lk-clear-demo').addEventListener('click', function() {
    if (!confirm('Remove all sample tenants, units, expenses and maintenance records? This cannot be undone.')) return;
    lkWipe(true);
    location.reload();
  });
}

document.addEventListener('DOMContentLoaded', function() { buildNav(); });
