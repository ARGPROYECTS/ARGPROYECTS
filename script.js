document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const startButton = document.getElementById('startButton'); // VAMOS A JUGAR
    const modeButton = document.getElementById('open-mode-btn'); // MODO DE JUEGO
    
    // Referencias al modal
    const closeButton = document.getElementById('close-mode-btn');
    const modal = document.getElementById('mode-modal'); 

    // Botones de modo de juego dentro del modal
    const blockzoidBtn = document.getElementById('blockzoid-btn'); // NUEVO
    const supervivenciaBtn = document.getElementById('supervivencia-btn');
    const destruccionBtn = document.getElementById('destruccion-btn');

    // Función para mostrar el modal
    function openModal() {
        modal.classList.add('active');
    }

    // Función para ocultar el modal
    function closeModal() {
        modal.classList.remove('active');
    }

    // 1. Ambos botones principales abren el modal de selección de modo
    startButton.addEventListener('click', openModal);

    modeButton.addEventListener('click', (e) => {
        e.preventDefault(); 
        openModal();
    });

    // 2. Lógica para cerrar el modal
    closeButton.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // 3. LÓGICA DE LOS BOTONES DE MODO DE JUEGO

    // Botón BLOCKZOID v2.6
    blockzoidBtn.addEventListener('click', () => {
        console.log("Iniciando BLOCKZOID v2.6...");
        window.location.href = 'Blockzoid v2.6.html';
    });

    // Botón MODO SUPERVIVENCIA
    supervivenciaBtn.addEventListener('click', () => {
        console.log("Iniciando MODO SUPERVIVENCIA...");
        window.location.href = 'supervivencia.html';
    });

    // Botón MODO DESTRUCCIÓN
    destruccionBtn.addEventListener('click', () => {
        alert('🚧 ¡MODO DESTRUCCIÓN en desarrollo! Gracias por tu interés. Estará disponible pronto.');
    });
});