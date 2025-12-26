const API_URL =
  "https://script.google.com/macros/s/AKfycbxJAJUYfLB5kIYXnpPAIegWFouW5ABnEPFFtEHNDGoZ1zr7JL2FkpIAoiHOcE-EXb8nIA/exec";

// Auth Guard
function checkAuth() {
  if (
    !localStorage.getItem("user") &&
    !window.location.pathname.includes("login.html") &&
    !window.location.pathname.includes("signup.html") &&
    !window.location.pathname.includes("index.html")
  ) {
    window.location.href = "login.html";
  }
}

// Sidebar Toggle (Desktop)
function toggleSidebar() {
  const sb = document.getElementById("sidebar");
  const ov = document.getElementById("sidebar-overlay");
  if (sb) sb.classList.toggle("-translate-x-full");
  if (ov) ov.classList.toggle("hidden");
}

// Logout
function logout() {
  showConfirm("Are you sure you want to logout from Tracker?", () => {
    localStorage.removeItem("user");
    window.location.href = "index.html";
  });
}

// JSONP Generic Function
function jsonp(url) {
  return new Promise((resolve, reject) => {
    const cb = "cb" + Math.round(100000 * Math.random());
    window[cb] = (data) => {
      delete window[cb];
      document.body.removeChild(script);
      resolve(data);
    };
    const script = document.createElement("script");
    script.src = `${url}${url.includes("?") ? "&" : "?"}callback=${cb}`;
    script.onerror = () => reject(new Error("Script load error"));
    document.body.appendChild(script);
  });
}

// Currency Formatter
const formatCurrency = (v) =>
  `₱${v.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// Toast Notification System
function showToast(msg, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = {
        success: 'fa-check-circle text-emerald-500',
        error: 'fa-exclamation-circle text-rose-500',
        warning: 'fa-triangle-exclamation text-amber-500',
        info: 'fa-circle-info text-blue-500'
    };
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> <span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        toast.style.transition = 'all 0.4s';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// Custom Modal System (Confirm & Prompt)
function showConfirm(msg, onConfirm) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay flex items-center justify-center';
    overlay.innerHTML = `
        <div class="modal-content text-center">
            <div class="w-16 h-16 bg-red-50 dark:bg-white/5 text-[#801b1b] rounded-full flex items-center justify-center mx-auto mb-6">
                <i class="fas fa-question text-xl"></i>
            </div>
            <h3 class="text-xl font-black mb-4">Are you sure?</h3>
            <p class="text-slate-400 font-medium mb-8 leading-relaxed">${msg}</p>
            <div class="flex gap-4">
                <button id="modal-cancel" class="flex-1 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
                <button id="modal-confirm" class="flex-1 px-6 py-3 bg-[#801b1b] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-900/20 active:scale-95 transition-all">Confirm</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    const close = () => {
        overlay.style.opacity = '0';
        overlay.querySelector('.modal-content').style.transform = 'scale(0.9)';
        setTimeout(() => overlay.remove(), 300);
    };

    overlay.querySelector('#modal-confirm').onclick = () => { onConfirm(); close(); };
    overlay.querySelector('#modal-cancel').onclick = close;
    overlay.onclick = (e) => { if(e.target === overlay) close(); };
}

function showPrompt(msg, defaultValue, onInput, hint = "") {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay flex items-center justify-center';
    overlay.innerHTML = `
        <div class="modal-content">
            <h3 class="text-xl font-black mb-2">${msg}</h3>
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Please enter a value below</p>
            <div class="relative mb-4">
                <input type="text" id="modal-input" value="${defaultValue}" class="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl px-5 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#801b1b] transition-all">
            </div>
            ${hint ? `<p class="text-[9px] font-bold text-slate-400 italic mb-8 leading-relaxed">${hint}</p>` : '<div class="mb-4"></div>'}
            <div class="flex gap-4">
                <button id="modal-cancel" class="flex-1 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
                <button id="modal-submit" class="flex-1 px-6 py-3 bg-[#801b1b] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-900/20 active:scale-95 transition-all">Submit</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    const close = () => {
        overlay.style.opacity = '0';
        overlay.querySelector('.modal-content').style.transform = 'scale(0.9)';
        setTimeout(() => overlay.remove(), 300);
    };

    const input = overlay.querySelector('#modal-input');
    input.focus();
    input.select();

    overlay.querySelector('#modal-submit').onclick = () => { onInput(input.value); close(); };
    overlay.querySelector('#modal-cancel').onclick = close;
    overlay.onclick = (e) => { if(e.target === overlay) close(); };
    input.onkeyup = (e) => { if(e.key === 'Enter') { onInput(input.value); close(); } };
}

// Dark Mode Strategy
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const target = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', target);
    localStorage.setItem('theme', target);
    showToast(`Switched to ${target} mode`, 'success');
}

// Initialize common things
document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
});

// CSV Export Utility
function downloadCSV(data, filename = 'tracker-export.csv') {
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
        Object.values(row).map(val => `"${(val || "").toString().replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
