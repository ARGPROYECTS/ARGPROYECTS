/*
  firebase-client.js
  SISTEMA DE BASE DE DATOS ESTÁTICA (GRATIS)
  Reemplaza la conexión a Firebase por lectura de archivos JSON locales/GitHub.
*/
(function(){
    console.log("📂 Inicializando Base de Datos Estática (JSON/GitHub)...");

    // Ruta a tus archivos de datos. 
    // Asegúrate de que la carpeta 'data' esté junto a tus archivos .html
    const DATA_PATH = './data/'; 

    // Función para leer archivos JSON evitando caché antigua
    async function fetchJSON(file) {
        try {
            const res = await fetch(`${DATA_PATH}${file}?t=${Date.now()}`);
            if (!res.ok) throw new Error(`Error ${res.status}`);
            return await res.json();
        } catch (e) {
            console.warn(`[DB] No se pudo cargar ${file}. Asegúrate de que existe en la carpeta /data/`, e);
            return null;
        }
    }

    // Reemplazamos la API de Firebase con nuestra versión estática
    window.fbStorage = {
        isReady: true, // Siempre listo porque son archivos locales

        // --- SERVIDORES ---
        getServers: async function() {
            const data = await fetchJSON('servers.json');
            return data || [];
        },
        // En modo estático, no podemos escribir en el servidor desde la web.
        // Avisamos al admin que debe hacerlo manualmente.
        addServer: async function(item) {
            alert("⚠️ MODO GRATIS/ESTÁTICO:\n\nPara agregar un servidor:\n1. Abre el archivo 'data/servers.json' en tu PC.\n2. Agrega los datos manualmente.\n3. Sube los cambios a GitHub.");
            return item;
        },
        updateServer: async function(id, patch) {
            alert("⚠️ MODO GRATIS/ESTÁTICO:\n\nPara editar:\n1. Modifica 'data/servers.json' en tu PC.\n2. Sube los cambios a GitHub.");
            return true;
        },
        deleteServer: async function(id) {
            alert("⚠️ MODO GRATIS/ESTÁTICO:\n\nPara eliminar:\n1. Borra la línea en 'data/servers.json'.\n2. Sube los cambios a GitHub.");
            return true;
        },

        // --- REDES SOCIALES ---
        getSocials: async function() {
            const data = await fetchJSON('socials.json');
            return data || {};
        },
        setSocial: async function(key, data) {
            alert(`⚠️ MODO GRATIS/ESTÁTICO:\n\nPara actualizar ${key}:\nEdita 'data/socials.json' y haz push a GitHub.`);
            return true;
        },

        // --- PUNTUACIONES (SCORES) ---
        // Las puntuaciones globales requieren un servidor real.
        // Aquí usaremos LocalStorage (se guardan solo en la PC del usuario).
        getScores: async function(game) {
            // 1. Intentamos cargar un "Hall of Fame" histórico desde el JSON (opcional)
            const globalData = await fetchJSON('scores.json') || {};
            const historical = globalData[game] || [];

            // 2. Cargamos las puntuaciones locales del usuario
            const local = JSON.parse(localStorage.getItem(`scores_${game}`) || '[]');

            // 3. Combinamos ambas listas
            const combined = [...historical, ...local];
            
            // Ordenar por puntaje descendente y tomar el top 10
            return combined.sort((a,b) => b.score - a.score).slice(0, 10);
        },
        addScore: async function(game, entry) {
            // Guardamos en el navegador del usuario
            const local = JSON.parse(localStorage.getItem(`scores_${game}`) || '[]');
            local.push(entry);
            // Mantenemos solo sus mejores 10 partidas
            local.sort((a,b) => b.score - a.score).splice(10);
            
            localStorage.setItem(`scores_${game}`, JSON.stringify(local));
            console.log('✅ Puntuación guardada localmente');
            return true;
        },

        // --- USUARIOS (ADMINS) ---
        getUsers: async function() { return []; },
        setUser: async function(username, user) { return true; },
        deleteUser: async function(username) { return true; },
        saveServers: async function(list) { 
            alert("⚠️ MODO GRATIS/ESTÁTICO:\nEdita 'data/servers.json' manualmente.");
            return true; 
        };
    };
})();
