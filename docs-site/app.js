// Stremio API Explorer — vanilla JS, no frameworks, no build step.
// All API calls go directly to https://api.strem.io from the browser.

const API_BASE = 'https://api.strem.io/api';
const STORAGE_ACCOUNTS_KEY = 'stremio_accounts';
const STORAGE_ACTIVE_KEY = 'stremio_active_account';

// ── State ──

let activeAuthKey = null;
let activeLabel = '';
let addons = [];
let unsavedChanges = false;
let dragSrcIndex = null;

// ── Init ──

document.addEventListener('DOMContentLoaded', () => {
  renderSavedAccounts();
  const saved = getActiveAccount();
  if (saved) {
    activeAuthKey = saved.authKey;
    activeLabel = saved.label;
    showAddonsScreen();
    refreshAddons();
  }
  document.getElementById('login-email').addEventListener('keydown', e => { if (e.key === 'Enter') loginWithCredentials(); });
  document.getElementById('login-password').addEventListener('keydown', e => { if (e.key === 'Enter') loginWithCredentials(); });
  document.getElementById('login-key').addEventListener('keydown', e => { if (e.key === 'Enter') loginWithKey(); });
  document.getElementById('new-addon-url').addEventListener('keydown', e => { if (e.key === 'Enter') addAddon(); });
});

// ── API helpers ──

async function apiCall(method, body) {
  try {
    const res = await fetch(`${API_BASE}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const data = await res.json();
    if (data.error) {
      const msg = typeof data.error === 'string' ? data.error : data.error.message || JSON.stringify(data.error);
      throw new Error(msg);
    }
    return data.result;
  } catch (err) {
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('Load failed')) {
      throw new Error(
        'Network error — this may be a CORS restriction. ' +
        'The Stremio API may not allow direct browser requests from this origin. ' +
        'Try using the curl samples from the docs instead.'
      );
    }
    throw err;
  }
}

async function fetchManifest(url) {
  let manifestUrl = url;
  if (!manifestUrl.endsWith('/manifest.json')) {
    manifestUrl = manifestUrl.replace(/\/$/, '') + '/manifest.json';
  }
  try {
    const res = await fetch(manifestUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.id || !data.name) throw new Error('Invalid manifest: missing id or name');
    return data;
  } catch (err) {
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('Load failed')) {
      throw new Error('Cannot reach this addon. It may be offline or blocking cross-origin requests (CORS).');
    }
    throw err;
  }
}

// ── Account management (localStorage) ──

function getSavedAccounts() {
  try { return JSON.parse(localStorage.getItem(STORAGE_ACCOUNTS_KEY)) || []; }
  catch { return []; }
}

function saveAccounts(accounts) {
  localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
}

function getActiveAccount() {
  try { return JSON.parse(localStorage.getItem(STORAGE_ACTIVE_KEY)); }
  catch { return null; }
}

function setActiveAccount(label, authKey) {
  localStorage.setItem(STORAGE_ACTIVE_KEY, JSON.stringify({ label, authKey }));
}

function clearActiveAccount() {
  localStorage.removeItem(STORAGE_ACTIVE_KEY);
}

function addSavedAccount(label, authKey) {
  const accounts = getSavedAccounts();
  const existing = accounts.findIndex(a => a.authKey === authKey);
  if (existing >= 0) {
    accounts[existing].label = label || accounts[existing].label;
  } else {
    accounts.push({ label: label || 'Account ' + (accounts.length + 1), authKey });
  }
  saveAccounts(accounts);
}

function removeSavedAccount(authKey) {
  saveAccounts(getSavedAccounts().filter(a => a.authKey !== authKey));
}

// ── Login ──

function switchLoginTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  if (tab === 'credentials') {
    document.getElementById('login-credentials').style.display = '';
    document.getElementById('login-authkey').style.display = 'none';
    document.querySelectorAll('.tab')[0].classList.add('active');
  } else {
    document.getElementById('login-credentials').style.display = 'none';
    document.getElementById('login-authkey').style.display = '';
    document.querySelectorAll('.tab')[1].classList.add('active');
  }
  hideLoginError();
}

async function loginWithCredentials() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if (!email || !password) return showLoginError('Please enter email and password.');
  hideLoginError();
  try {
    const result = await apiCall('login', { email, password });
    const label = result.user?.email || email;
    activeAuthKey = result.authKey;
    activeLabel = label;
    addSavedAccount(label, result.authKey);
    setActiveAccount(label, result.authKey);
    showAddonsScreen();
    refreshAddons();
  } catch (err) {
    showLoginError(err.message);
  }
}

async function loginWithKey() {
  const key = document.getElementById('login-key').value.trim().replace(/^["']|["']$/g, '');
  if (!key) return showLoginError('Please paste an authKey.');
  const label = document.getElementById('login-label').value.trim();
  hideLoginError();
  // Validate the key by calling getUser
  try {
    const user = await apiCall('getUser', { authKey: key });
    const finalLabel = label || user?.email || 'Account';
    activeAuthKey = key;
    activeLabel = finalLabel;
    addSavedAccount(finalLabel, key);
    setActiveAccount(finalLabel, key);
    showAddonsScreen();
    refreshAddons();
  } catch (err) {
    showLoginError('Invalid authKey: ' + err.message);
  }
}

function loginWithSaved(authKey) {
  const accounts = getSavedAccounts();
  const account = accounts.find(a => a.authKey === authKey);
  if (!account) return;
  activeAuthKey = account.authKey;
  activeLabel = account.label;
  setActiveAccount(account.label, account.authKey);
  showAddonsScreen();
  refreshAddons();
}

function showLoginError(msg) {
  const el = document.getElementById('login-error');
  el.textContent = msg;
  el.style.display = '';
}

function hideLoginError() {
  document.getElementById('login-error').style.display = 'none';
}

// ── Logout ──

function logout() {
  // Best-effort logout call
  if (activeAuthKey) {
    apiCall('logout', { authKey: activeAuthKey }).catch(() => {});
  }
  activeAuthKey = null;
  activeLabel = '';
  addons = [];
  unsavedChanges = false;
  clearActiveAccount();
  showLoginScreen();
}

// ── Screen switching ──

function showLoginScreen() {
  document.getElementById('screen-login').style.display = '';
  document.getElementById('screen-addons').style.display = 'none';
  document.getElementById('btn-logout').style.display = 'none';
  document.getElementById('btn-switch-account').style.display = 'none';
  document.getElementById('active-account-label').textContent = '';
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
  document.getElementById('login-key').value = '';
  document.getElementById('login-label').value = '';
  hideLoginError();
  renderSavedAccounts();
}

function showAddonsScreen() {
  document.getElementById('screen-login').style.display = 'none';
  document.getElementById('screen-addons').style.display = '';
  document.getElementById('btn-logout').style.display = '';
  document.getElementById('btn-switch-account').style.display = '';
  document.getElementById('active-account-label').textContent = activeLabel;
}

// ── Account switcher modal ──

function showAccountSwitcher() {
  const accounts = getSavedAccounts();
  const list = document.getElementById('switcher-list');
  list.innerHTML = '';
  accounts.forEach(acc => {
    const div = document.createElement('div');
    div.className = 'saved-account-item';
    div.innerHTML = `
      <div>
        <div class="label">${esc(acc.label)}</div>
        <div class="key-preview">${esc(acc.authKey.substring(0, 12))}...</div>
      </div>
      <div class="saved-account-actions">
        ${acc.authKey === activeAuthKey ? '<span style="color:var(--success);font-size:0.8rem">active</span>' : ''}
      </div>
    `;
    if (acc.authKey !== activeAuthKey) {
      div.onclick = () => { hideAccountSwitcher(); loginWithSaved(acc.authKey); };
    }
    list.appendChild(div);
  });
  document.getElementById('modal-switcher').style.display = '';
}

function hideAccountSwitcher() {
  document.getElementById('modal-switcher').style.display = 'none';
}

// ── Saved accounts in login screen ──

function renderSavedAccounts() {
  const accounts = getSavedAccounts();
  const section = document.getElementById('saved-accounts-section');
  const list = document.getElementById('saved-accounts-list');
  if (accounts.length === 0) { section.style.display = 'none'; return; }
  section.style.display = '';
  list.innerHTML = '';
  accounts.forEach(acc => {
    const div = document.createElement('div');
    div.className = 'saved-account-item';
    const info = document.createElement('div');
    info.innerHTML = `<div class="label">${esc(acc.label)}</div><div class="key-preview">${esc(acc.authKey.substring(0, 12))}...</div>`;
    info.style.cursor = 'pointer';
    info.onclick = () => loginWithSaved(acc.authKey);
    div.appendChild(info);

    const actions = document.createElement('div');
    actions.className = 'saved-account-actions';
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn-icon';
    removeBtn.textContent = '\u00d7';
    removeBtn.title = 'Remove saved account';
    removeBtn.onclick = (e) => { e.stopPropagation(); removeSavedAccount(acc.authKey); renderSavedAccounts(); };
    actions.appendChild(removeBtn);
    div.appendChild(actions);
    list.appendChild(div);
  });
}

// ── Addons ──

async function refreshAddons() {
  showStatus('Loading addons...', 'info');
  try {
    const result = await apiCall('addonCollectionGet', { authKey: activeAuthKey, update: true });
    addons = result.addons || [];
    unsavedChanges = false;
    hideStatus();
    renderAddons();
  } catch (err) {
    showStatus('Failed to load addons: ' + err.message, 'error');
  }
}

async function saveAddons() {
  showStatus('Saving to Stremio...', 'info');
  try {
    await apiCall('addonCollectionSet', { authKey: activeAuthKey, addons });
    unsavedChanges = false;
    showStatus('Saved successfully!', 'success');
    setTimeout(hideStatus, 3000);
  } catch (err) {
    showStatus('Save failed: ' + err.message, 'error');
  }
}

async function addAddon() {
  const input = document.getElementById('new-addon-url');
  let url = input.value.trim();
  if (!url) return;
  showStatus('Fetching manifest...', 'info');
  try {
    const manifest = await fetchManifest(url);
    if (!url.endsWith('/manifest.json')) url = url.replace(/\/$/, '') + '/manifest.json';
    // Check if already installed
    if (addons.some(a => a.transportUrl === url)) {
      showStatus('This addon is already in your list.', 'error');
      return;
    }
    addons.push({
      transportUrl: url,
      transportName: 'http',
      manifest,
      flags: {},
    });
    unsavedChanges = true;
    input.value = '';
    hideStatus();
    renderAddons();
  } catch (err) {
    showStatus('Failed to add addon: ' + err.message, 'error');
  }
}

function removeAddon(index) {
  const addon = addons[index];
  if (addon.flags?.protected) {
    showStatus(`"${addon.manifest?.name || 'This addon'}" is protected and cannot be removed.`, 'error');
    return;
  }
  addons.splice(index, 1);
  unsavedChanges = true;
  renderAddons();
}

function moveAddon(fromIndex, toIndex) {
  if (toIndex < 0 || toIndex >= addons.length) return;
  const [item] = addons.splice(fromIndex, 1);
  addons.splice(toIndex, 0, item);
  unsavedChanges = true;
  renderAddons();
}

async function testAddon(index) {
  const addon = addons[index];
  const icon = document.getElementById(`addon-status-${index}`);
  icon.innerHTML = '<span class="spinner"></span>';
  icon.title = 'Testing...';
  try {
    await fetchManifest(addon.transportUrl);
    icon.innerHTML = '\u2705';
    icon.title = 'Addon is alive and responding';
  } catch (err) {
    icon.innerHTML = '\u274c';
    icon.title = err.message;
  }
}

function startEditUrl(index) {
  const row = document.getElementById(`addon-url-row-${index}`);
  const addon = addons[index];
  row.innerHTML = `
    <input type="text" class="addon-url-input" id="addon-url-input-${index}" value="${esc(addon.transportUrl)}">
    <button class="btn-icon" title="Save" onclick="saveEditUrl(${index})">&#10003;</button>
    <button class="btn-icon" title="Cancel" onclick="renderAddons()">&#10007;</button>
  `;
  document.getElementById(`addon-url-input-${index}`).focus();
}

async function saveEditUrl(index) {
  const input = document.getElementById(`addon-url-input-${index}`);
  const newUrl = input.value.trim();
  if (!newUrl) return;
  showStatus('Validating new URL...', 'info');
  try {
    const manifest = await fetchManifest(newUrl);
    let finalUrl = newUrl;
    if (!finalUrl.endsWith('/manifest.json')) finalUrl = finalUrl.replace(/\/$/, '') + '/manifest.json';
    addons[index].transportUrl = finalUrl;
    addons[index].manifest = manifest;
    unsavedChanges = true;
    hideStatus();
    renderAddons();
  } catch (err) {
    showStatus('Invalid URL: ' + err.message, 'error');
  }
}

// ── Backup / Restore ──

function backupAddons() {
  const json = JSON.stringify(addons, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `stremio-addons-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showStatus('Backup downloaded.', 'success');
  setTimeout(hideStatus, 3000);
}

function restoreAddons(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data)) throw new Error('Expected a JSON array of addons.');
      // Basic validation
      for (const addon of data) {
        if (!addon.transportUrl) throw new Error('Invalid addon entry: missing transportUrl.');
      }
      addons = data;
      unsavedChanges = true;
      renderAddons();
      showStatus(`Loaded ${data.length} addons from backup. Click "Save to Stremio" to apply.`, 'info');
    } catch (err) {
      showStatus('Failed to restore: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

// ── Rendering ──

function renderAddons() {
  const list = document.getElementById('addon-list');
  const empty = document.getElementById('addon-empty');

  if (addons.length === 0) {
    list.innerHTML = '';
    empty.style.display = '';
    return;
  }
  empty.style.display = 'none';

  list.innerHTML = addons.map((addon, i) => {
    const m = addon.manifest || {};
    const isProtected = addon.flags?.protected;
    const isOfficial = addon.flags?.official;
    return `
      <div class="addon-item${isProtected ? ' protected' : ''}"
           id="addon-${i}"
           draggable="true"
           ondragstart="onDragStart(event, ${i})"
           ondragover="onDragOver(event, ${i})"
           ondrop="onDrop(event, ${i})"
           ondragend="onDragEnd(event)"
           ondragleave="onDragLeave(event)">
        <div class="addon-drag-handle" title="Drag to reorder">
          <button class="btn-icon" onclick="moveAddon(${i}, ${i - 1})" ${i === 0 ? 'disabled' : ''} title="Move up">\u25B2</button>
          <button class="btn-icon" onclick="moveAddon(${i}, ${i + 1})" ${i === addons.length - 1 ? 'disabled' : ''} title="Move down">\u25BC</button>
        </div>
        <div class="addon-body">
          <div class="addon-header">
            <span class="addon-name">${esc(m.name || 'Unknown')}</span>
            <span class="addon-version">v${esc(m.version || '?')}</span>
            ${isOfficial ? '<span class="addon-badge-official">official</span>' : ''}
            ${isProtected ? '<span class="addon-badge-protected">protected</span>' : ''}
            <span id="addon-status-${i}" class="addon-status-icon"></span>
          </div>
          <div class="addon-description">${esc(m.description || '')}</div>
          <div class="addon-url-row" id="addon-url-row-${i}">
            <span class="addon-url">${esc(addon.transportUrl)}</span>
            <button class="btn-icon" onclick="startEditUrl(${i})" title="Edit URL">&#9998;</button>
          </div>
        </div>
        <div class="addon-actions">
          <button class="btn-icon" onclick="testAddon(${i})" title="Test addon">&#9889;</button>
          <button class="btn-icon" onclick="removeAddon(${i})" title="Remove addon" ${isProtected ? 'disabled' : ''}>\u00d7</button>
        </div>
      </div>
    `;
  }).join('');
}

// ── Drag and drop ──

function onDragStart(e, index) {
  dragSrcIndex = index;
  e.target.closest('.addon-item').classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', index);
}

function onDragOver(e, index) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  if (index !== dragSrcIndex) {
    e.target.closest('.addon-item')?.classList.add('drag-over');
  }
}

function onDragLeave(e) {
  e.target.closest('.addon-item')?.classList.remove('drag-over');
}

function onDrop(e, toIndex) {
  e.preventDefault();
  e.target.closest('.addon-item')?.classList.remove('drag-over');
  if (dragSrcIndex !== null && dragSrcIndex !== toIndex) {
    moveAddon(dragSrcIndex, toIndex);
  }
  dragSrcIndex = null;
}

function onDragEnd(e) {
  document.querySelectorAll('.addon-item').forEach(el => {
    el.classList.remove('dragging', 'drag-over');
  });
  dragSrcIndex = null;
}

// ── Status messages ──

function showStatus(msg, type) {
  const el = document.getElementById('addon-status');
  el.textContent = msg;
  el.className = 'status-box ' + type;
  el.style.display = '';
}

function hideStatus() {
  document.getElementById('addon-status').style.display = 'none';
}

// ── Utilities ──

function esc(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
