/*
  firebase-client.js
  BASE DE DATOS ESTÁTICA (OFFLINE)
  Toda la información es fija y no depende de bases de datos externas.
  Para actualizar: Edita la variable STATIC_DB abajo.
*/
(function(){
    console.log("📂 Inicializando Base de Datos Estática (JS)...");

    // === AQUÍ ESTÁ TU INFORMACIÓN ===
    const STATIC_DB = {
        servers: [
            {
                "id": "argames-mods",
                "name": "Server con Mods ARGames",
                "ip": "181.137.6.163:25565",
                "desc": "Servidor con mods. Modpack v1.2 requerido.",
                "players": 0,
                "map": "Survival",
                "online": true,
                "version": "1.20.1 Forge",
                "modpack": "https://drive.google.com/file/d/1a9L1rj_UNRR5aA2Vjj8d8VUxYd0_WfGD/view",
                "discord": "https://discord.gg/J5BPsRugjQ"
            }
        ],
        socials: {
            "youtube": { 
                "tagline": "Suscríbete", 
                "link": "https://www.youtube.com/@alvarortpo9596",
                "desc": "Gameplays, tutoriales y series completas de tus juegos favoritos."
            },
            "kick": { 
                "tagline": "En vivo", 
                "link": "https://kick.com/alvaretosky",
                "desc": "Transmisiones en directo, interactuando con la comunidad y jugando títulos variados."
            },
            "tiktok": { 
                "tagline": "Clips", 
                "link": "https://www.tiktok.com/@alvarortpo",
                "desc": "Los mejores momentos, clips divertidos y highlights rápidos de las partidas."
            }
        },
        scores: {
            "blockzoid": [{"player": "Campeón Histórico", "score": 5000}],
            "supervivencia": []
        }
    };

    window.StaticDB = {
        isReady: true,
        getServers: async function() { return STATIC_DB.servers; },
        getSocials: async function() { return STATIC_DB.socials; },
        getScores: async function(game) { 
            const local = JSON.parse(localStorage.getItem(`scores_${game}`) || '[]');
            const combined = [...(STATIC_DB.scores[game] || []), ...local];
            return combined.sort((a,b) => b.score - a.score).slice(0, 10);
        },
        addScore: async function(game, entry) {
            const local = JSON.parse(localStorage.getItem(`scores_${game}`) || '[]');
            local.push(entry);
            local.sort((a,b) => b.score - a.score).splice(10);
            localStorage.setItem(`scores_${game}`, JSON.stringify(local));
            return true;
        },
        // Funciones vacías para evitar errores
        addServer: async () => {}, updateServer: async () => {}, deleteServer: async () => {},
        setSocial: async () => {},
        getUsers: async function() { return []; },
        setUser: async function(username, user) { return true; },
        deleteUser: async function(username) { return true; }
    };
})();
