document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los nuevos botones
    const btnBlockzoid = document.getElementById('btn-play-blockzoid');
    const btnSupervivencia = document.getElementById('btn-play-supervivencia');
    const btnMenuJuegos = document.getElementById('btn-menu-juegos');
    const btnMenuServidores = document.getElementById('btn-menu-servidores');
    const juegosPanel = document.getElementById('juegos-panel');

    // Ocultar el panel de juegos por defecto (usar clases)
    if (juegosPanel) {
        juegosPanel.classList.remove('active');
    }
    if (btnMenuJuegos) {
        btnMenuJuegos.classList.remove('active');
    }

    // Función de navegación para Blockzoid
    if (btnBlockzoid) {
        btnBlockzoid.addEventListener('click', () => {
            console.log("Navegando a Blockzoid...");
            // Usamos el nombre del archivo proporcionado en tu contexto
            window.location.href = 'Blockzoid.html';
        });
    }

    // Mostrar panel de Juegos (si existe)
    if (btnMenuJuegos && juegosPanel) {
        btnMenuJuegos.addEventListener('click', () => {
            // activar visual
            btnMenuJuegos.classList.add('active');
            if (btnMenuServidores) btnMenuServidores.classList.remove('active');
            // asegurarnos de que el panel de juegos esté visible (usar clase)
            juegosPanel.classList.add('active');
        });
    }

    // Redirigir a servers.html cuando se pulsa Servidores
    if (btnMenuServidores) {
        btnMenuServidores.addEventListener('click', () => {
            // ocultar panel de juegos si estaba visible
            if (juegosPanel) juegosPanel.classList.remove('active');
            if (btnMenuJuegos) btnMenuJuegos.classList.remove('active');
            btnMenuServidores.classList.add('active');
            // redirigir a servers
            window.location.href = 'servers.html';
        });
    }

    // Función de navegación para Supervivencia
    if (btnSupervivencia) {
        btnSupervivencia.addEventListener('click', () => {
            console.log("Navegando a Supervivencia...");
            window.location.href = 'supervivencia.html';
        });
    }
});