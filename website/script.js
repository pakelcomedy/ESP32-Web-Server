document.getElementById('btn').addEventListener('click', () => {
  fetch('/').then(resp => resp.text()).then(html => {
    // crude: parse uptime from HTML
    const match = html.match(/uptime: <span id="uptime">(\d+)<\/span>/i);
    if (match) alert(`Uptime: ${match[1]}s`);
  });
});

// auto-update uptime every 5s
setInterval(() => {
  fetch('/').then(resp => resp.text()).then(html => {
    const m = html.match(/Current uptime: <span id="uptime">(\d+)<\/span>/);
    if (m) document.getElementById('uptime').innerText = m[1];
  });
}, 5000);
