// auth.js - simple client-side auth for demo/admin control
// WARNING: This is for demo/admin-control only. Not secure for production.
(function(window){
    const STORAGE_KEY = 'ap_users_v1';
    const CURRENT_KEY = 'ap_current_v1';
    const SERVERS_KEY = 'ap_servers_v1';
    const SOCIALS_KEY = 'ap_socials_v1';

    async function hash(text){
        const enc = new TextEncoder();
        const data = enc.encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2,'0')).join('');
    }

    const API_BASE = window.AP_API_BASE || 'http://localhost:3000';

    function getUsers(){
        try{ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
        catch(e){ return []; }
    }

    function saveUsers(users){ localStorage.setItem(STORAGE_KEY, JSON.stringify(users)); }

    // Attempt to fetch users from remote backends (Firebase preferred, then local API on localhost)
    async function fetchUsersFromRemote(){
        try{
            if(window.StaticDB && StaticDB.getUsers){
                const u = await StaticDB.getUsers(); if(Array.isArray(u)) return u;
            }
        }catch(e){ console.warn('StaticDB getUsers failed', e); }

        const host = window.location.hostname;
        if(host !== 'localhost' && host !== '127.0.0.1') return null;

        try{
            const r = await fetch(API_BASE + '/users');
            if(!r.ok) throw new Error('bad');
            const data = await r.json();
            if(Array.isArray(data)){
                saveUsers(data);
                return data;
            }
        }catch(e){ console.warn('API users fetch failed', e); }
        return null;
    }

    // Sync a single user to remote API when available (localhost) or to Firebase if provided
    async function syncUserToRemote(user){
        try{
            if(window.StaticDB && StaticDB.setUser){
                await StaticDB.setUser(user.username, user);
                return true;
            }
        }catch(e){ console.warn('StaticDB setUser failed', e); }

        const host = window.location.hostname;
        if(host !== 'localhost' && host !== '127.0.0.1') return false;

        try{
            await fetch(API_BASE + '/users', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify(user) });
            return true;
        }catch(e){ console.warn('sync user to API failed', e); return false; }
    }

    function getCurrent(){
        try{ return JSON.parse(localStorage.getItem(CURRENT_KEY) || 'null'); }
        catch(e){ return null; }
    }

    function setCurrent(obj){ localStorage.setItem(CURRENT_KEY, JSON.stringify(obj)); }

    function logout(){ localStorage.removeItem(CURRENT_KEY); }

    function getServers(){
        try{ return JSON.parse(localStorage.getItem(SERVERS_KEY) || '[]'); }
        catch(e){ return []; }
    }

    function saveServers(list){ localStorage.setItem(SERVERS_KEY, JSON.stringify(list)); }

    function addServer(server){
        const list = getServers();
        // assign id
        server.id = Date.now().toString(36) + Math.floor(Math.random()*1000).toString(36);
        list.push(server);
        saveServers(list);
        return server;
    }

    function updateServer(id, patch){
        const list = getServers();
        const s = list.find(x=>x.id===id);
        if(!s) return false;
        Object.assign(s, patch);
        saveServers(list);
        return true;
    }

    function deleteServer(id){
        let list = getServers();
        list = list.filter(x=>x.id!==id);
        saveServers(list);
        return true;
    }

    // Socials (YouTube, Kick, TikTok, etc.) - simple storage for editable platform info
    function getSocials(){
        try{ return JSON.parse(localStorage.getItem(SOCIALS_KEY) || '{}'); }
        catch(e){ return {}; }
    }

    function saveSocials(obj){ localStorage.setItem(SOCIALS_KEY, JSON.stringify(obj)); }

    function getSocial(key){
        const s = getSocials();
        return s[key] || null;
    }

    function setSocial(key, data){
        const all = getSocials();
        all[key] = Object.assign({}, all[key]||{}, data);
        saveSocials(all);
        return true;
    }

    async function register(username, password){
        username = (username||'').trim();
        if(!username || !password) return {ok:false, msg:'Usuario y clave requeridos.'};
        // try remote first (will save locally if found)
        await fetchUsersFromRemote();
        const users = getUsers();
        if(users.find(u=>u.username.toLowerCase()===username.toLowerCase())) return {ok:false, msg:'Usuario ya existe.'};
        const pass = await hash(password);
        const role = users.length===0 ? 'admin' : 'user'; // first user becomes admin
        users.push({username, pass, role});
        saveUsers(users);
        // attempt to sync to remote backend
        syncUserToRemote({ username, pass, role }).catch(()=>{});
        return {ok:true, msg:'Registrado', role};
    }

    async function login(username, password){
        username = (username||'').trim();
        if(!username || !password) return {ok:false, msg:'Usuario y clave requeridos.'};
        // refresh users from remote if available
        await fetchUsersFromRemote();
        const users = getUsers();
        const user = users.find(u=>u.username.toLowerCase()===username.toLowerCase());
        if(!user) return {ok:false, msg:'Usuario no encontrado.'};
        const pass = await hash(password);
        if(pass !== user.pass) return {ok:false, msg:'Clave incorrecta.'};
        setCurrent({username: user.username, role: user.role});
        return {ok:true, msg:'Autenticado', role: user.role};
    }

    function ensureAdminExists(){
        const users = getUsers();
        if(users.length===0){
            // default admin: admin/admin (user should change later)
            // set default admin password as requested
            hash('2611').then(h=>{ users.push({username:'admin', pass:h, role:'admin'}); saveUsers(users); console.info('Usuario administrador por defecto creado: admin (contraseña establecida)'); });
        } else {
            // if an admin user exists, update its password to the requested default (useful if stored admin has old password)
            const admin = users.find(u=>u.username.toLowerCase()==='admin');
            if(admin){
                hash('2611').then(h=>{
                    admin.pass = h;
                    saveUsers(users);
                    console.info('Contraseña del usuario admin actualizada al valor por defecto solicitado.');
                }).catch(()=>{});
            }
        }
    }

    function listUsers(){ return getUsers(); }

    function setRole(username, role){
        const users = getUsers();
        const u = users.find(x=>x.username===username);
        if(!u) return false;
        u.role = role;
        saveUsers(users);
        // attempt remote sync
        syncUserToRemote(u).catch(()=>{});
        const cur = getCurrent();
        if(cur && cur.username===username) setCurrent({username:cur.username, role});
        return true;
    }

    function deleteUser(username){
        let users = getUsers();
        users = users.filter(u=>u.username!==username);
        saveUsers(users);
        // attempt remote delete
        try{ const host = window.location.hostname; if(host==='localhost' || host==='127.0.0.1') fetch(API_BASE + '/users/' + encodeURIComponent(username), { method:'DELETE' }).catch(()=>{}); }catch(e){}
        const cur = getCurrent(); if(cur && cur.username===username) logout();
        return true;
    }

    // expose
    window.apAuth = {
        hash, getUsers, saveUsers, register, login, logout, getCurrent, ensureAdminExists, listUsers, setRole, deleteUser,
        // servers
        getServers, saveServers, addServer, updateServer, deleteServer,
        // socials
        getSocials, saveSocials, getSocial, setSocial
    };

    // ensure there's at least one admin on load
    ensureAdminExists();
})(window);
