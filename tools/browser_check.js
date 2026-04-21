const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const targetPath = '/Calculator/index.html';
const chromePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Cache-Control': 'no-store' });
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const types = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.md': 'text/markdown; charset=utf-8',
      '.txt': 'text/plain; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml',
    };
    res.writeHead(200, {
      'Content-Type': types[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    });
    res.end(data);
  });
}

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const reqPath = decodeURIComponent((req.url || '/').split('?')[0]);
      const cleanPath = reqPath === '/' ? '/index.html' : reqPath;
      const filePath = path.join(repoRoot, cleanPath);
      if (!filePath.startsWith(repoRoot)) {
        res.writeHead(403, { 'Cache-Control': 'no-store' });
        res.end('Forbidden');
        return;
      }
      sendFile(res, filePath);
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const probe = http.createServer();
    probe.on('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

function launchChrome(targetUrl, debugPort, userDataDir) {
  fs.mkdirSync(userDataDir, { recursive: true });
  const child = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    `--user-data-dir=${userDataDir}`,
    `--remote-debugging-port=${debugPort}`,
    targetUrl,
  ], { stdio: 'ignore' });
  return child;
}

async function waitForTarget(targetUrl, debugPort, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`http://127.0.0.1:${debugPort}/json`);
      const pages = await res.json();
      const page = pages.find(p =>
        p.webSocketDebuggerUrl &&
        (p.url === targetUrl || p.url.startsWith(targetUrl) || p.url.includes('/Calculator/index.html'))
      );
      if (page && page.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch (_) {
      // Chrome may not be ready yet.
    }
    await sleep(250);
  }
  throw new Error('Timed out waiting for Chrome debugger target');
}

async function cdpEvaluate(wsUrl, expression) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let nextId = 1;
    const timer = setTimeout(() => {
      ws.close();
      reject(new Error('Timed out waiting for CDP result'));
    }, 10000);

    function send(method, params = {}) {
      ws.send(JSON.stringify({ id: nextId++, method, params }));
    }

    ws.addEventListener('open', () => {
      send('Runtime.enable');
      setTimeout(() => {
        send('Runtime.evaluate', {
          expression,
          awaitPromise: true,
          returnByValue: true,
        });
      }, 1500);
    });

    ws.addEventListener('message', event => {
      const msg = JSON.parse(event.data);
      if (msg.id !== 2) return;
      clearTimeout(timer);
      ws.close();
      if (msg.result && msg.result.exceptionDetails) {
        const details = msg.result.exceptionDetails;
        const description = msg.result.result && (msg.result.result.description || msg.result.result.value);
        reject(new Error(description || details.text || 'CDP evaluation failed'));
        return;
      }
      resolve(msg.result?.result?.value);
    });

    ws.addEventListener('error', err => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

async function main() {
  const mode = process.argv[2] || 'cancelled-tohit';
  const server = await startServer();
  const port = server.address().port;
  const targetUrl = `http://127.0.0.1:${port}${targetPath}`;
  const debugPort = await getFreePort();
  const userDataDir = path.join(repoRoot, '.playwright-mcp', `chrome-headless-${process.pid}-${Date.now()}`);
  const chrome = launchChrome(targetUrl, debugPort, userDataDir);

  try {
    const wsUrl = await waitForTarget(targetUrl, debugPort);
    const expressions = {
      'cancelled-tohit': `(() => {
        document.getElementById('gameVersion').value = 'mom_1.31';
        onVersionChange();
        document.getElementById('aToHitMod').value = 20;
        document.getElementById('warpReality').checked = true;
        document.getElementById('aAbil_unitType').value = 'normal';
        recalculate();
        const el = document.getElementById('aToHitMeleeMod');
        return {
          text: el.textContent,
          visible: el.classList.contains('visible')
        };
      })()`,
      'run-tests': `runTests()`,
    };

    const expression = expressions[mode];
    if (!expression) throw new Error(`Unknown mode: ${mode}`);

    const result = await cdpEvaluate(wsUrl, expression);
    console.log(JSON.stringify(result));
  } finally {
    server.close();
    chrome.kill('SIGKILL');
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch (_) {
      // Chrome can keep temporary files locked briefly after kill on Windows.
    }
  }
}

main().catch(err => {
  console.error(err.stack || String(err));
  process.exit(1);
});
