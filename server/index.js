const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const DATA_PATH = path.join(__dirname, 'data', 'scores.json');
const PORT = process.env.PORT || 3000;

const SERVERS_PATH = path.join(__dirname, 'data', 'servers.json');
const SOCIALS_PATH = path.join(__dirname, 'data', 'socials.json');
const USERS_PATH = path.join(__dirname, 'data', 'users.json');

function loadScores() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { blockzoid: [], supervivencia: [] };
  }
}

function saveScores(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function loadJson(p, def){
  try{ return JSON.parse(fs.readFileSync(p,'utf8')); }catch(e){ return def; }
}

function saveJson(p, obj){
  try{ fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf8'); return true; }catch(e){ return false; }
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/scores/:game', (req, res) => {
  const game = req.params.game;
  const data = loadScores();
  if (!data[game]) return res.status(404).json({ error: 'Juego no encontrado' });
  const list = data[game].slice().sort((a,b) => b.score - a.score).slice(0, 100);
  res.json(list.slice(0, 10));
});

app.post('/scores/:game', (req, res) => {
  const game = req.params.game;
  const { player, score, meta } = req.body;
  if (!player || typeof score !== 'number') return res.status(400).json({ error: 'player and numeric score required' });

  const data = loadScores();
  if (!data[game]) return res.status(404).json({ error: 'Juego no encontrado' });

  const entry = { id: Date.now().toString(36) + Math.random().toString(36).slice(2,6), player: String(player).slice(0,40), score: Number(score), meta: meta || {}, ts: Date.now() };
  data[game].push(entry);
  // keep reasonable size
  data[game] = data[game].slice(-1000);
  saveScores(data);
  res.json({ ok: true, entry });
});

// Servers endpoints: share list of servers between clients
app.get('/servers', (req, res) => {
  const data = loadJson(SERVERS_PATH, []);
  res.json(data);
});

app.post('/servers', (req, res) => {
  const item = req.body;
  if(!item || !item.ip) return res.status(400).json({ error: 'invalid body' });
  const list = loadJson(SERVERS_PATH, []);
  item.id = item.id || (Date.now().toString(36) + Math.random().toString(36).slice(2,6));
  // replace if id exists
  const idx = list.findIndex(x=>x.id===item.id);
  if(idx >= 0) list[idx] = item; else list.push(item);
  saveJson(SERVERS_PATH, list);
  res.json({ ok:true, item });
});

app.delete('/servers/:id', (req, res) => {
  const id = req.params.id;
  let list = loadJson(SERVERS_PATH, []);
  list = list.filter(x=>x.id!==id);
  saveJson(SERVERS_PATH, list);
  res.json({ ok:true });
});

// Socials endpoints
app.get('/socials', (req, res) => {
  const data = loadJson(SOCIALS_PATH, {});
  res.json(data);
});

app.post('/socials', (req, res) => {
  const body = req.body;
  if(!body || !body.key) return res.status(400).json({ error: 'invalid body' });
  const all = loadJson(SOCIALS_PATH, {});
  all[body.key] = Object.assign({}, all[body.key]||{}, body.data||{});
  saveJson(SOCIALS_PATH, all);
  res.json({ ok:true, key: body.key, data: all[body.key] });
});

// Users endpoints - allow clients to share simple user lists (demo only, not secure)
app.get('/users', (req, res) => {
  const data = loadJson(USERS_PATH, []);
  res.json(data);
});

app.post('/users', (req, res) => {
  const body = req.body;
  if(!body || !body.username || !body.pass) return res.status(400).json({ error: 'invalid body' });
  const list = loadJson(USERS_PATH, []);
  const username = String(body.username);
  const idx = list.findIndex(x=>String(x.username).toLowerCase()===username.toLowerCase());
  const item = { username: username, pass: String(body.pass), role: body.role || 'user' };
  if(idx >= 0) list[idx] = item; else list.push(item);
  saveJson(USERS_PATH, list);
  res.json({ ok:true, item });
});

app.delete('/users/:username', (req, res) => {
  const username = req.params.username;
  let list = loadJson(USERS_PATH, []);
  list = list.filter(x=>String(x.username).toLowerCase()!==String(username).toLowerCase());
  saveJson(USERS_PATH, list);
  res.json({ ok:true });
});

app.listen(PORT, () => console.log(`AP server listening on http://localhost:${PORT}`));
