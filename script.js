document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los nuevos botones
    const btnBlockzoid = document.getElementById('btn-play-blockzoid');
    const btnSupervivencia = document.getElementById('btn-play-supervivencia');

    // Función de navegación para Blockzoid
    if (btnBlockzoid) {
        btnBlockzoid.addEventListener('click', () => {
            console.log("Navegando a Blockzoid...");
            // Usamos el nombre del archivo proporcionado en tu contexto
            window.location.href = 'Blockzoid.html';
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