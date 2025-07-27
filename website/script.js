// ===================================
// ESP32 IoT Dashboard - script.js
// Modern IoT Control Panel Interactions & Live Updates
// ===================================

// -- Navigation Toggle for Mobile --
const navToggle = document.querySelector('.nav-toggle');
const navMenu   = document.querySelector('.site-nav ul');
navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  navToggle.classList.toggle('active');
});

// -- Smooth Scroll for Anchor Links --
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Close mobile nav on selection
    if (navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      navToggle.classList.remove('active');
    }
  });
});

// -- Live Status Updates via API --
const statusEndpoints = {
  uptime:       '/api/status/uptime',
  cpuLoad:      '/api/status/cpu',
  memoryUsage:  '/api/status/memory',
  ipAddress:    '/api/status/ip'
};
const statusElements = {
  uptime:       document.getElementById('uptime-value'),
  cpuLoad:      document.getElementById('cpu-load'),
  memoryUsage:  document.getElementById('memory-usage'),
  ipAddress:    document.getElementById('ip-address')
};

async function fetchStatus(key) {
  try {
    const res = await fetch(statusEndpoints[key], { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    statusElements[key].textContent = data.value + (data.unit || '');
  } catch (err) {
    console.error(`Error fetching ${key}:`, err);
    statusElements[key].textContent = '--';
  }
}

async function updateAllStatus() {
  await Promise.all(Object.keys(statusEndpoints).map(fetchStatus));
}

// Initial fetch & periodic refresh
updateAllStatus();
setInterval(updateAllStatus, 5000);

// -- Contact Form Handler --
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(contactForm);
  const payload = Object.fromEntries(formData.entries());

  // Basic validation
  if (!payload.name || !payload.email || !payload.message) {
    alert('Please fill in all fields.');
    return;
  }

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Server ${res.status}`);
    const result = await res.json();
    alert(result.message || 'Message sent successfully!');
    contactForm.reset();
  } catch (err) {
    console.error('Contact submit error:', err);
    alert('Failed to send message. Try again later.');
  }
});

// -- Real-Time Clock Display --
const clockEl = document.createElement('div');
clockEl.className = 'real-time-clock';
document.body.append(clockEl);

function updateClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  clockEl.textContent = `${hh}:${mm}:${ss}`;
}
setInterval(updateClock, 1000);
updateClock();

// -- Keyboard Shortcuts --
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'r') {
    e.preventDefault();
    updateAllStatus();
  }
});

// -- Utility: Debounce Function --
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Example: Debounced window resize event
window.addEventListener('resize', debounce(() => {
  console.log('Window resized to', window.innerWidth, 'x', window.innerHeight);
}, 250));

// -- End of script.js --
