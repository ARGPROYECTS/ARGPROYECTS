// En tu archivo JavaScript (script.js)

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const startButton = document.getElementById('startButton'); // VAMOS A JUGAR
    const modeButton = document.getElementById('open-mode-btn'); // MODO DE JUEGO
    
    // Referencias al modal
    const closeButton = document.getElementById('close-mode-btn');
    const modal = document.getElementById('mode-modal'); 

    // Nuevos botones de modo de juego dentro del modal
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
    
    // Botón "VAMOS A JUGAR" abre el modal
    startButton.addEventListener('click', openModal);

    // Botón "MODO DE JUEGO" abre el modal
    modeButton.addEventListener('click', (e) => {
        e.preventDefault(); 
        openModal();
    });

    // 2. Lógica para cerrar el modal
    
    // Cerrar al hacer clic en 'X'
    closeButton.addEventListener('click', closeModal);

    // Cerrar al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Cerrar con la tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // 3. LÓGICA DE LOS BOTONES DE MODO DE JUEGO

    // Botón MODO SUPERVIVENCIA: Redirige al archivo de juego
    supervivenciaBtn.addEventListener('click', () => {
        console.log("Iniciando MODO SUPERVIVENCIA...");
        window.location.href = 'supervivencia.html';
    });

    // Botón MODO DESTRUCCIÓN: Muestra notificación
    destruccionBtn.addEventListener('click', () => {
        alert('🚧 ¡MODO DESTRUCCIÓN en desarrollo! Gracias por tu interés. Estará disponible pronto.');
    });
});