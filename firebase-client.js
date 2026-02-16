/*
  firebase-client.js
  - Inicializa Firebase si existe `window.FIREBASE_CONFIG` (pegalo en firebase-config.js)
  - Expone `window.fbStorage` con métodos: getServers, saveServers, addServer, updateServer, deleteServer, getSocials, setSocial, getScores, addScore
  - Si no hay config, no hace nada (fallback a API local sigue funcionando)

  Usage: create a `firebase-config.js` with `window.FIREBASE_CONFIG = { apiKey: ..., projectId: ..., ... }`
  and luego incluye este archivo después de `auth.js` en tus páginas.
*/
(function(){
  function noop(){ return Promise.resolve(null); }
  window.fbStorage = {
    getServers: noop,
    saveServers: noop,
    addServer: noop,
    updateServer: noop,
    deleteServer: noop,
    getSocials: noop,
    setSocial: noop,
    getScores: noop,
    addScore: noop
  };

  if(!window.FIREBASE_CONFIG) return; // no config provided

  // load firebase compat libs dynamically
  function loadScript(src){ return new Promise((res, rej)=>{ const s=document.createElement('script'); s.src=src; s.onload=res; s.onerror=rej; document.head.appendChild(s); }); }

  Promise.resolve()
    .then(()=> loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js'))
    .then(()=> loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js'))
    .then(()=> {
      try{
        const app = firebase.initializeApp(window.FIREBASE_CONFIG);
        const db = firebase.firestore();

        // servers stored in collection 'servers'
        window.fbStorage.getServers = async function(){
          const snap = await db.collection('servers').orderBy('name').get();
          return snap.docs.map(d=> Object.assign({ id: d.id }, d.data()));
        };

        window.fbStorage.saveServers = async function(list){
          const batch = db.batch();
          // naive: clear collection by deleting current docs then re-add
          const cur = await db.collection('servers').get();
          cur.docs.forEach(d=> batch.delete(d.ref));
          list.forEach(item=>{
            const ref = item.id ? db.collection('servers').doc(item.id) : db.collection('servers').doc();
            batch.set(ref, item);
          });
          await batch.commit();
          return true;
        };

        window.fbStorage.addServer = async function(item){
          const ref = item.id ? db.collection('servers').doc(item.id) : db.collection('servers').doc();
          await ref.set(Object.assign({}, item));
          return Object.assign({}, item, { id: ref.id });
        };

        window.fbStorage.updateServer = async function(id, patch){
          await db.collection('servers').doc(id).set(patch, { merge: true });
          return true;
        };

        window.fbStorage.deleteServer = async function(id){
          await db.collection('servers').doc(id).delete();
          return true;
        };

        // socials as single doc in collection 'meta' doc 'socials'
        window.fbStorage.getSocials = async function(){
          const doc = await db.collection('meta').doc('socials').get();
          return doc.exists ? doc.data() : {};
        };

        window.fbStorage.setSocial = async function(key, data){
          const ref = db.collection('meta').doc('socials');
          await ref.set({ [key]: data }, { merge: true });
          const doc = await ref.get();
          return doc.data()[key];
        };

        // scores: collection `scores_{game}`
        window.fbStorage.addScore = async function(game, entry){
          const col = db.collection('scores_' + game);
          const r = await col.add(Object.assign({}, entry, { ts: Date.now() }));
          return { id: r.id, ...entry };
        };

        window.fbStorage.getScores = async function(game, limit = 50){
          const col = db.collection('scores_' + game);
          const snap = await col.orderBy('score', 'desc').limit(limit).get();
          return snap.docs.map(d=> Object.assign({ id: d.id }, d.data()));
        };

        console.info('fbStorage initialized (using Firebase)');
      }catch(e){ console.error('fbStorage init error', e); }
    }).catch(e=> console.warn('loading firebase libs failed', e));
})();
