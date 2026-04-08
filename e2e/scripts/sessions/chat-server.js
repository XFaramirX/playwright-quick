/**
 * Tiny chat server — no dependencies, built-in Node http only.
 * Each playwright-cli session opens http://localhost:3333?name=session-X
 *
 * Run:  node e2e/scripts/sessions/chat-server.js
 */

const http = require('http');
const PORT = 3333;

// In-memory message store: [{ from, text, ts }]
const messages = [];

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Session Chat</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #0f0f0f; color: #eee; display: flex; flex-direction: column; height: 100vh; }
    header { background: #1a1a2e; padding: 12px 20px; font-size: 18px; font-weight: bold; border-bottom: 1px solid #333; }
    header span { color: #7c83fd; font-size: 13px; margin-left: 12px; font-weight: normal; }
    #messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 8px; }
    .msg { max-width: 70%; padding: 8px 12px; border-radius: 12px; font-size: 14px; line-height: 1.4; }
    .msg.mine  { align-self: flex-end; background: #7c83fd; color: #fff; border-bottom-right-radius: 2px; }
    .msg.other { align-self: flex-start; background: #1e1e2e; border-bottom-left-radius: 2px; }
    .msg .sender { font-size: 11px; opacity: 0.7; margin-bottom: 3px; }
    .msg .time   { font-size: 10px; opacity: 0.5; margin-top: 3px; text-align: right; }
    form { display: flex; gap: 8px; padding: 12px 16px; border-top: 1px solid #333; background: #1a1a2e; }
    input { flex: 1; padding: 10px 14px; border-radius: 8px; border: 1px solid #333; background: #0f0f0f; color: #eee; font-size: 14px; }
    input:focus { outline: none; border-color: #7c83fd; }
    button { padding: 10px 20px; background: #7c83fd; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; }
    button:hover { background: #9198fd; }
    #who { font-size: 12px; color: #888; padding: 4px 16px; background: #1a1a2e; }
  </style>
</head>
<body>
  <header>Session Chat <span id="badge">connecting...</span></header>
  <div id="who"></div>
  <div id="messages"></div>
  <form id="form">
    <input id="input" placeholder="Type a message..." autocomplete="off" />
    <button type="submit">Send</button>
  </form>
  <script>
    const name = new URLSearchParams(location.search).get('name') || 'anonymous';
    document.title = 'Chat — ' + name;
    document.getElementById('badge').textContent = name;

    let lastTs = 0;

    async function poll() {
      try {
        const r = await fetch('/messages?since=' + lastTs);
        const data = await r.json();
        if (data.messages.length) {
          data.messages.forEach(addMsg);
          lastTs = data.messages[data.messages.length - 1].ts;
        }
        document.getElementById('who').textContent = 'Online: ' + (data.online || []).join(', ');
      } catch(e) {}
    }

    function addMsg({ from, text, ts }) {
      const el = document.createElement('div');
      el.className = 'msg ' + (from === name ? 'mine' : 'other');
      const t = new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      el.innerHTML = '<div class="sender">' + from + '</div>' +
                     '<div>' + text.replace(/</g,'&lt;') + '</div>' +
                     '<div class="time">' + t + '</div>';
      document.getElementById('messages').appendChild(el);
      document.getElementById('messages').scrollTop = 9999;
    }

    document.getElementById('form').addEventListener('submit', async e => {
      e.preventDefault();
      const text = document.getElementById('input').value.trim();
      if (!text) return;
      document.getElementById('input').value = '';
      await fetch('/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: name, text })
      });
    });

    // Heartbeat so server knows who's online
    async function heartbeat() {
      await fetch('/ping?name=' + encodeURIComponent(name)).catch(()=>{});
    }

    heartbeat();
    setInterval(heartbeat, 3000);
    poll();
    setInterval(poll, 1000);
  </script>
</body>
</html>`;

// Track who's online: name → last ping ts
const online = {};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  // Serve the chat UI
  if (url.pathname === '/' || url.pathname === '/chat') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(HTML);
  }

  // GET /messages?since=<ts>
  if (url.pathname === '/messages') {
    const since = parseInt(url.searchParams.get('since') || '0', 10);
    const filtered = messages.filter(m => m.ts > since);
    // Prune stale online entries (> 6s)
    const now = Date.now();
    Object.keys(online).forEach(k => { if (now - online[k] > 6000) delete online[k]; });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ messages: filtered, online: Object.keys(online) }));
  }

  // POST /send  { from, text }
  if (url.pathname === '/send' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const { from, text } = JSON.parse(body);
        const msg = { from: String(from).slice(0, 24), text: String(text).slice(0, 500), ts: Date.now() };
        messages.push(msg);
        if (messages.length > 200) messages.shift(); // keep last 200
        console.log(`[${new Date().toLocaleTimeString()}] ${msg.from}: ${msg.text}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch {
        res.writeHead(400); res.end('bad json');
      }
    });
    return;
  }

  // GET /ping?name=session-X  (heartbeat)
  if (url.pathname === '/ping') {
    const name = url.searchParams.get('name') || 'unknown';
    online[name] = Date.now();
    res.writeHead(200); res.end('ok');
    return;
  }

  res.writeHead(404); res.end('not found');
});

server.listen(PORT, () => {
  console.log(`Chat server running at http://localhost:${PORT}`);
  console.log('');
  console.log('Connect each session:');
  for (let i = 1; i <= 4; i++) {
    console.log(`  playwright-cli --session=session-${i} goto "http://localhost:${PORT}?name=session-${i}"`);
  }
  console.log('');
  console.log('Or run: bash e2e/scripts/sessions/chat-join.sh');
});
