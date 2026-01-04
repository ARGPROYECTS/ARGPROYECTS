document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los botones principales
    const startButton = document.getElementById('startButton'); 
    const modeButton = document.getElementById('open-mode-btn'); 
    const directBlockzoidBtn = document.getElementById('direct-blockzoid-btn');
    
    // Referencias al modal
    const modal = document.getElementById('mode-modal'); 
    const closeButton = document.getElementById('close-mode-btn');

    // Botones dentro del modal
    const blockzoidBtn = document.getElementById('blockzoid-btn'); 
    const supervivenciaBtn = document.getElementById('supervivencia-btn');
    const destruccionBtn = document.getElementById('destruccion-btn');

    // Funciones de control del Modal
    const openModal = () => modal.classList.add('active');
    const closeModal = () => modal.classList.remove('active');

    // Eventos de interfaz
    startButton.addEventListener('click', openModal);
    modeButton.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });

    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    // LÓGICA DE NAVEGACIÓN (Corregida para GitHub)
    const playBlockzoid = () => {
        console.log("Cargando Blockzoid_v2.6.html...");
        window.location.href = 'Blockzoid_v2.6.html';
    };

    // Ambos botones ejecutan la misma función
    directBlockzoidBtn.addEventListener('click', playBlockzoid);
    blockzoidBtn.addEventListener('click', playBlockzoid);

    supervivenciaBtn.addEventListener('click', () => {
        window.location.href = 'supervivencia.html';
    });

    destruccionBtn.addEventListener('click', () => {
        alert('🚧 ¡MODO DESTRUCCIÓN en desarrollo! Pronto estará disponible.');
    });
});