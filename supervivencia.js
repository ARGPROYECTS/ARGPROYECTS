// =======================================================
// 1. CONSTANTES, ESTADO INICIAL Y CONFIGURACIÓN
// =======================================================

const LIMITE_POBLACION = 1000; 
const VICTORIA_MIN = 4500;    
const VIDAS_INICIALES = 5;
const DURACION_EVENTO_PERIODICO = 60; 

// Emojis y nombres de las 5 ZONAS
const ZONAS_EMOJIS = {
    'A': '🌳 Amazonía Húmeda',
    'P': '🏔️ Páramo Andino',
    'C': '🌴 Caribe Seco',
    'H': '🌧️ Chocó Biogeográfico',
    'L': '🌾 Llanos Orientales'
};

// Definición de las 5 ZONAS (Estado Inicial - Se inicializa en reiniciarJuego)
let ZONAS = []; 

// Frases de advertencia de la Abuela
const CONSEJOS_ABUELA_WARNINGS = [
    "Recuerda, muchacho, la Tierra no tiene un botón de reinicio. Cuídala hoy.",
    "El planeta es un préstamo, no una herencia. Y el plazo se acaba.",
    "No siempre hay una segunda oportunidad para salvar lo que es vital.",
    "Si cortas la raíz, ¿dónde crecerán los nietos? Piensa en el futuro.",
    "El silencio de la naturaleza es el grito más fuerte. Escúchalo antes de que sea tarde.",
    "El equilibrio no se recupera con magia, sino con la conciencia de cada día.",
    "Cada acción cuenta, porque el río no vuelve a su origen.",
    "Hay heridas que la Tierra no olvida, y ya estamos dejando muchas cicatrices.",
    "La paciencia de la naturaleza es grande, pero su furia es inmensa. No la tientes.",
    "Un buen gestor del tiempo sabe que el momento de actuar es ahora."
];

// Definición de las ACCIONES (Cartas) con su lógica
// *** LÓGICA REBALANCEADA: Mayor costo de vidas = Mayor beneficio % / Menor costo de vidas = Beneficio ABSOLUTO ***
const acciones = {
    // ================== ACCIONES POSITIVAS (6) ==================
    
    // COSTO ALTO (-3): BENEFICIO MÁS ALTO (GLOBAL) - PORCENTAJE (AUMENTADO)
    'AlianzaGlobal': { 
        emoji: '🤝', 
        descripcion: "Inversión Sostenible. Pop. **x1.8 a x2.0** en TODAS las zonas (Aumento del 80% al 100%). Costo: -3 Vidas.",
        costoVidas: 3, type: 'positive',
        aplicarEfecto: () => {
            // AUMENTADO: 1.8 a 2.0 (Antes: 1.75 a 1.9)
            const multiplier = 1.8 + Math.random() * 0.2; 
            let totalAumento = 0;
            ZONAS.forEach(zona => {
                const oldPop = zona.population;
                zona.population = Math.floor(zona.population * multiplier);
                totalAumento += (zona.population - oldPop);
            });
            return `¡Alianza forjada! Todas las poblaciones aumentaron por x${multiplier.toFixed(2)} (Total: +${totalAumento.toLocaleString('es')}).`;
        }
    },
    
    // COSTO ALTO (-3): BENEFICIO MÁS ALTO (ZONA ÚNICA) - PORCENTAJE (AUMENTADO)
    'Innovacion': { 
        emoji: '🚀', 
        descripcion: "Pop. **x1.75 a x1.95** en 1 Zona (Aumento del 75% al 95%). Costo: -3 Vidas.",
        costoVidas: 3, type: 'positive',
        aplicarEfecto: (zonaIndex) => {
            // AUMENTADO: 1.75 a 1.95 (Antes: 1.7 a 1.85)
            const multiplier = 1.75 + Math.random() * 0.2; 
            const oldPop = ZONAS[zonaIndex].population;
            ZONAS[zonaIndex].population = Math.floor(oldPop * multiplier);
            const aumento = Math.floor(ZONAS[zonaIndex].population - oldPop);
            return `¡Innovación aplicada! ${ZONAS[zonaIndex].name} aumentó en **${aumento.toLocaleString('es')}** (x${multiplier.toFixed(2)}).`;
        }
    },
    
    // COSTO MEDIO (-2): BENEFICIO MEDIO/ALTO (ZONA ÚNICA) - PORCENTAJE (AUMENTADO)
    'Rescate': {
        emoji: '🦊', 
        descripcion: "Pop. **x1.55 a x1.7** en 1 Zona (Aumento del 55% al 70%). Costo: -2 Vidas.",
        costoVidas: 2, type: 'positive',
        aplicarEfecto: (zonaIndex) => {
            // AUMENTADO: 1.55 a 1.7 (Antes: 1.5 a 1.65)
            const multiplier = 1.55 + Math.random() * 0.15; 
            const oldPop = ZONAS[zonaIndex].population;
            ZONAS[zonaIndex].population = Math.floor(oldPop * multiplier);
            const aumento = Math.floor(ZONAS[zonaIndex].population - oldPop);
            return `¡Rescate exitoso! ${ZONAS[zonaIndex].name} aumentó en **${aumento.toLocaleString('es')}** (x${multiplier.toFixed(2)}).`;
        }
    },
    
    // COSTO MEDIO (-2): BENEFICIO MEDIO (GLOBAL) - PORCENTAJE (AUMENTADO)
    'Siembra': { 
        emoji: '🌱', 
        descripcion: "Campaña de Reforestación. Pop. **x1.6** en TODAS las zonas (Aumento fijo del 60%). Costo: -2 Vidas.",
        costoVidas: 2, type: 'positive',
        aplicarEfecto: () => {
            // AUMENTADO: Fijo x1.6 (Antes: Fijo x1.5)
            const multiplier = 1.6; 
            let totalAumento = 0;
            ZONAS.forEach(zona => {
                const oldPop = zona.population;
                zona.population = Math.floor(zona.population * multiplier);
                totalAumento += (zona.population - oldPop);
            });
            return `¡Reforestación global aplicada! Poblaciones multiplicadas por 1.6 (Total: +${totalAumento.toLocaleString('es')}).`;
        }
    },
    
    // COSTO BAJO (-1): BENEFICIO MEDIO - CANTIDAD ABSOLUTA
    'Restauracion': { 
        emoji: '💧', 
        descripcion: "Restauración de Ecosistemas. Aumento de **200 a 350** de Población en 1 Zona. Costo: -1 Vida.",
        costoVidas: 1, type: 'positive',
        aplicarEfecto: (zonaIndex) => {
            // CAMBIADO A ABSOLUTO: 200 + random(0 a 150)
            const aumento = 200 + Math.floor(Math.random() * 151); 
            ZONAS[zonaIndex].population += aumento;
            return `¡Restauración ecológica en marcha! ${ZONAS[zonaIndex].name} aumentó en **${aumento.toLocaleString('es')}** de población.`;
        }
    },
    
    // COSTO NULO (0): BENEFICIO BAJO/VARIABLE - CANTIDAD ABSOLUTA
    'ConsejosAbuela': { 
        emoji: '👵', 
        descripcion: "Sabiduría Antigua. Aumento de **150 a 500** de Población total (Distribuido en zonas aleatorias). 🎁 Posible +2 Vidas (10% Prob.). Costo: 0 Vidas.",
        costoVidas: 0, type: 'gift', 
        aplicarEfecto: (zonaIndexPlaceholder) => {
            
            let vidasGanadas = 0;
            let bonusVidas = '';
            if (Math.random() < 0.1) { 
                vidasGanadas = 2;
                vidas += vidasGanadas; 
                bonusVidas = ` y ¡ganas **${vidasGanadas}** vidas extra (¡suerte!)!`;
            }

            let totalAumento = 0;
            // Se afecta de 3 a 5 zonas aleatorias
            const numZonasAfectar = Math.floor(Math.random() * (ZONAS.length - 2)) + 3; 
            const indicesAfectados = shuffle(Array.from(Array(ZONAS.length).keys())).slice(0, numZonasAfectar); 
            
            indicesAfectados.forEach((index, i) => {
                const zona = ZONAS[index];
                // CAMBIADO A ABSOLUTO: 50 a 100 de población por zona
                const zoneIncrease = 50 + Math.floor(Math.random() * 51); 
                
                zona.population += zoneIncrease;
                totalAumento += zoneIncrease;
            });
            
            let mensaje = `Aumento total en **${totalAumento.toLocaleString('es')}** de población distribuido en ${numZonasAfectar} ecosistemas.`;

            return `¡Sabiduría aplicada! ${bonusVidas}<br>Distribución:<br>${mensaje}`;
        }
    },
    
    // ================== ACCIONES NEGATIVAS (5) ==================
    
    // GANANCIA ALTA (+3): DESGRACIA MÁS ALTA (¡CATASTRÓFICO!) - PORCENTAJE (MENOS PUNITIVO)
    'Sequia': { 
        emoji: '🏜️', 
        descripcion: "Estrés Hídrico. Pop. **x0.2 a x0.35** en TODAS las zonas (Pérdida del 65% al 80%). Ganas: +3 Vidas.",
        costoVidas: -3, type: 'negative', 
        aplicarEfecto: () => {
            // MENOS PUNITIVO: 0.2 a 0.35 (Antes: 0.15 a 0.3)
            const multiplier = 0.2 + Math.random() * 0.15; 
            let totalPerdida = 0;
            ZONAS.forEach(zona => {
                const oldPop = zona.population;
                zona.population = Math.floor(zona.population * multiplier);
                totalPerdida += (oldPop - zona.population);
            });
            return `¡Sequía masiva! Todas las poblaciones reducidas por x${multiplier.toFixed(2)} (Total: -${totalPerdida.toLocaleString('es')}).`;
        }
    },
    
    // GANANCIA MEDIA (+2): DESGRACIA MEDIA/ALTA (ZONA ÚNICA) - PORCENTAJE (MENOS PUNITIVO)
    'Colapso': { 
        emoji: '💀', 
        descripcion: "Colapso/Cosecha. Pop. **x0.4 a x0.55** en 1 Zona (Pérdida del 45% al 60%). Ganas: +2 Vidas.",
        costoVidas: -2, type: 'negative', 
        aplicarEfecto: (zonaIndex) => {
            // MENOS PUNITIVO: 0.4 a 0.55 (Antes: 0.35 a 0.5)
            const multiplier = 0.4 + Math.random() * 0.15; 
            const oldPop = ZONAS[zonaIndex].population;
            ZONAS[zonaIndex].population = Math.floor(oldPop * multiplier);
            const perdida = Math.floor(oldPop - ZONAS[zonaIndex].population);
            return `¡Colapso crítico en ${ZONAS[zonaIndex].name}! Población reducida en **${perdida.toLocaleString('es')}** (x${multiplier.toFixed(2)}).`;
        }
    },
    
    // GANANCIA MEDIA (+2): DESGRACIA MEDIA (ZONA ÚNICA) - PORCENTAJE (SE MANTIENE)
    'Incendio': { 
        emoji: '🔥', 
        descripcion: "Incendio Forestal Grave. Pop. **x0.5** (50% de la actual) en 1 Zona. Ganas: +2 Vidas.",
        costoVidas: -2, type: 'negative', 
        aplicarEfecto: (zonaIndex) => {
            // SE MANTIENE: x0.5 (Mitad)
            const zonaAfectada = ZONAS[zonaIndex];
            const perdida = Math.floor(zonaAfectada.population / 2);
            zonaAfectada.population -= perdida;
            return `¡Incendio! ${zonaAfectada.name} pierde la mitad de su población (**${perdida.toLocaleString('es')}**).`;
        }
    },
    
    // GANANCIA BAJA (+1): DESGRACIA ALTA (ZONA ÚNICA) - CANTIDAD ABSOLUTA
    'Deforestacion': { 
        emoji: '🪓', 
        descripcion: "Tala Indiscriminada. Pérdida de **250 a 400** de Población en 1 Zona. Ganas: +1 Vida.",
        costoVidas: -1, type: 'negative', 
        aplicarEfecto: (zonaIndex) => {
            // CAMBIADO A ABSOLUTO: 250 + random(0 a 150)
            const perdida = 250 + Math.floor(Math.random() * 151); 
            const popInicial = ZONAS[zonaIndex].population;
            ZONAS[zonaIndex].population -= perdida;
            const perdidaReal = Math.min(perdida, popInicial); 
            return `¡Deforestación! ${ZONAS[zonaIndex].name} se redujo en **${perdidaReal.toLocaleString('es')}** de población.`;
        }
    },
    
    // GANANCIA BAJA (+1): DESGRACIA MEDIA (GLOBAL) - CANTIDAD ABSOLUTA
    'MineriaIlegal': { 
        emoji: '⛏️', 
        descripcion: "Impacto por Minería. Pérdida de **150 a 250** de Población en TODAS las zonas. Ganas: +1 Vida.",
        costoVidas: -1, type: 'negative', 
        aplicarEfecto: () => {
            // CAMBIADO A ABSOLUTO: 150 + random(0 a 100)
            const perdidaPorZona = 150 + Math.floor(Math.random() * 101);
            let totalPerdida = 0;
            ZONAS.forEach(zona => {
                const perdidaReal = Math.min(perdidaPorZona, zona.population);
                zona.population -= perdidaPorZona;
                totalPerdida += perdidaReal;
            });
            return `¡Minería Ilegal! Todas las poblaciones se reducen en ${perdidaPorZona.toLocaleString('es')} (Total: -${totalPerdida.toLocaleString('es')}).`;
        }
    },
    
    // ================== ACCIÓN DE ORGANIZACIÓN (1) ==================
    'Redistribucion': { 
        emoji: '⚖️', 
        descripcion: "Pop. se iguala al Promedio en TODAS las zonas. (Ajusta los desequilibrios). Costo: 0 Vidas.",
        costoVidas: 0, type: 'neutral',
        aplicarEfecto: () => {
            const totalPop = ZONAS.reduce((sum, z) => sum + z.population, 0);
            const promedio = Math.floor(totalPop / ZONAS.length);
            ZONAS.forEach(zona => {
                zona.population = promedio;
            });
            return `¡Reequilibrio! Todas las zonas se ajustan al promedio de ${promedio.toLocaleString('es')}.`;
        }
    }
};

// Pool de acciones para la selección aleatoria
const ACCIONES_POOL = {
    positive: ['Rescate', 'Siembra', 'Innovacion', 'AlianzaGlobal', 'Restauracion', 'ConsejosAbuela'],
    negative: ['Colapso', 'Sequia', 'Incendio', 'Deforestacion', 'MineriaIlegal'],
    neutral: ['Redistribucion'] 
};

// Variables de estado del juego
let vidas = VIDAS_INICIALES;
let juegoTerminado = false;
let timerIntervalId = null;
let tiempoJuego = 0;
let selectedActionId = null; 


// =======================================================
// 2. FUNCIONES DE MANIPULACIÓN DEL DOM Y DIBUJO
// =======================================================

/**
 * Genera un color degradado de Rojo (0%) a Verde (100%)
 * usando el modelo HSL (Tono 0 = Rojo, Tono 120 = Verde).
 * @param {number} porcentaje - El porcentaje de población (0 a 100).
 * @returns {string} El color HSL CSS (e.g., "hsl(120, 75%, 45%)").
 */
function getPopulationColorHSL(porcentaje) {
    const p = Math.max(0, Math.min(100, porcentaje));
    // Tono 0 (Rojo) a 120 (Verde).
    const hue = p * 1.2; 
    // Saturación alta (75%) y luminosidad media (45%) para colores vibrantes.
    return `hsl(${hue}, 75%, 45%)`; 
}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getRandomUnique(pool, count) {
    const shuffled = shuffle([...pool]);
    return shuffled.slice(0, count);
}

function generarAccionesAleatorias() {
    let seleccionadas = [];
    
    const poolPos = ACCIONES_POOL.positive;
    seleccionadas.push(...getRandomUnique(poolPos, 2));

    const poolNeg = ACCIONES_POOL.negative;
    seleccionadas.push(...getRandomUnique(poolNeg, 1));
    
    shuffle(seleccionadas); 

    seleccionadas.push('Redistribucion');

    return seleccionadas; 
}


function dibujarAcciones(actionIds) {
    const actionCardsContainer = document.getElementById('action-cards');
    if (!actionCardsContainer) return;
    
    actionCardsContainer.innerHTML = ''; 

    actionIds.forEach(id => {
        const accion = acciones[id];
        if (!accion) return;

        const titleText = id.replace(/([A-Z])/g, ' $1').trim();
        
        const button = document.createElement('button');
        button.classList.add('action-card');
        button.setAttribute('data-id', id);
        button.setAttribute('data-type', accion.type);
        
        button.innerHTML = `
            <span class="card-emoji">${accion.emoji}</span>
            <span class="card-title">${titleText}</span>
        `;
        
        // El primer clic solo procesa la selección
        button.addEventListener('click', () => procesarAccion(id)); 
        
        // El doble clic sigue ejecutando la acción (mecanica alternativa)
        button.addEventListener('dblclick', ejecutarAccionConfirmada);
        
        actionCardsContainer.appendChild(button);
    });
    
    // Al regenerar cartas, se limpia el estado de selección
    selectedActionId = null; 
    document.getElementById('action-details-notification').classList.add('hidden');
    document.getElementById('confirm-action-btn').disabled = true;
}


function deshabilitarAcciones() {
    const actionCards = document.getElementById('action-cards');
    if (actionCards) actionCards.style.pointerEvents = 'none';
    document.getElementById('confirm-action-btn').disabled = true; 
}

function habilitarAcciones() {
    const actionCards = document.getElementById('action-cards');
    if (actionCards) actionCards.style.pointerEvents = 'auto';
}

/**
 * Muestra la notificación superior (eventos de turno y ejecución de acción).
 */
function mostrarNotificacion(texto, esEventoCritico = false) {
    const notifElement = document.getElementById('notification-text');
    const areaElement = document.getElementById('turn-event-notification');
    
    let prefix = '';
    if (!esEventoCritico && !texto.startsWith('👵')) {
        prefix = '✅ ';
    } else if (esEventoCritico) {
        prefix = '💀 ';
    }
    
    if (notifElement) {
        notifElement.innerHTML = `${prefix}${texto}`;
    }
    
    if (areaElement) {
        if (esEventoCritico) {
            areaElement.style.border = '4px solid var(--COLOR_PELIGRO)';
        } else {
            areaElement.style.border = '4px solid var(--COLOR_HEADER)';
        }
    }
}

/**
 * Muestra la notificación de detalles y espera la confirmación.
 */
function mostrarDetallesAccion(actionId) {
    const accion = acciones[actionId];
    const detailsContainer = document.getElementById('action-details-notification');
    const detailsText = document.getElementById('details-text');

    // Manejo de Vidas
    let vidaText = '';
    let vidaClass = 'confirmation-neutral';
    if (accion.costoVidas > 0) {
        vidaText = `Costo de Vidas: **-${accion.costoVidas} Vidas** (¡Cuidado!).`;
        vidaClass = 'confirmation-cost';
    } else if (accion.costoVidas < 0) {
        vidaText = `Ganancia de Vidas: **+${Math.abs(accion.costoVidas)} Vidas** (¡Beneficio!).`;
        vidaClass = 'confirmation-gain';
    } else {
        vidaText = `Costo de Vidas: **0** Vidas.`;
        vidaClass = 'confirmation-neutral';
    }
    
    // Obtener el efecto poblacional (usando la descripción y quitando el costo de vidas)
    const efectoPoblacional = accion.descripcion.split('. Costo:')[0].split('. Ganas:')[0];

    // Contenido de la Notificación
    detailsText.innerHTML = `
        <span style="font-size: 1.2em;">${accion.emoji} **${actionId.replace(/([A-Z])/g, ' $1').trim()}**</span>
        <br><span class="${vidaClass}">${vidaText}</span>
        <br>Efecto Poblacional: **${efectoPoblacional}**
        <br><br>Presiona el botón **Confirmar Acción** para ejecutar el turno.
    `;
    
    detailsContainer.classList.remove('hidden');
}


function actualizarInterfaz() {
    let poblacionTotal = ZONAS.reduce((sum, z) => sum + z.population, 0);

    const popValueElement = document.getElementById('pop-value');
    if (popValueElement) {
        popValueElement.textContent = `${Math.floor(poblacionTotal).toLocaleString('es')} / ${VICTORIA_MIN.toLocaleString('es')}`;
    }
    
    const lifeIconsContainer = document.getElementById('life-icons');
    if (lifeIconsContainer) {
        lifeIconsContainer.innerHTML = ''; 

        for (let i = 0; i < 5; i++) {
            const span = document.createElement('span');
            span.classList.add('life-slot');
            span.textContent = '❤';
            if (i < vidas) {
                span.classList.add('active');
                
                // --- PULSO DE VIDA CRÍTICA ---
                if (vidas <= 2) { 
                    span.classList.add('danger');
                } else {
                    span.classList.remove('danger');
                }
                // -----------------------------

            }
            lifeIconsContainer.appendChild(span);
        }
    }
    
    const extraLivesText = document.getElementById('extra-lives-text');
    if (extraLivesText) {
        extraLivesText.textContent = (vidas > 5) ? `(+${vidas - 5})` : '';
    }

    ZONAS.forEach(zona => {
        // Asegurar que la población no exceda el límite ni sea negativa
        zona.population = Math.max(0, Math.min(zona.population, zona.limit));

        const porcentaje = (zona.population / zona.limit) * 100;
        const widgetElement = document.querySelector(`.zone-widget[data-zone-id="${zona.id}"]`);
        
        if (widgetElement) { 
            const nameElement = widgetElement.querySelector('.zone-name');
            const popCountElement = widgetElement.querySelector('.zone-pop-count'); 
            const fillElement = widgetElement.querySelector('.progress-bar-fill');
            const popTextElement = widgetElement.querySelector('.progress-bar-fill').nextElementSibling; 
            
            if (nameElement) nameElement.textContent = zona.name;

            // Mostrar población numérica y límite con formato de miles
            if (popCountElement) {
                popCountElement.innerHTML = `Población: ${Math.floor(zona.population).toLocaleString('es')} / ${zona.limit.toLocaleString('es')}`;
            }

            if (fillElement && popTextElement) {
                // Color de la barra de progreso (usando HSL de múltiples tonos)
                fillElement.style.backgroundColor = getPopulationColorHSL(porcentaje);
                fillElement.style.width = `${porcentaje}%`;
                
                // --- PULSO DE BARRA CRÍTICA ---
                if (porcentaje < 30) {
                    fillElement.classList.add('danger-pulse');
                } else {
                    fillElement.classList.remove('danger-pulse');
                }
                // -----------------------------

                // Texto de porcentaje
                popTextElement.textContent = `${Math.floor(porcentaje)} %`;
                
            } 
        }
    });

    const minutos = String(Math.floor(tiempoJuego / 60)).padStart(2, '0');
    const segundos = String(tiempoJuego % 60).padStart(2, '0');
    const timeValueElement = document.getElementById('time-value');
    if (timeValueElement) {
        timeValueElement.textContent = `${minutos}:${segundos}`;
    }
}


// =======================================================
// 3. LÓGICA DEL JUEGO
// =======================================================

function aplicarEntropia() {
    if (juegoTerminado) return;
    
    const zonaIndex = Math.floor(Math.random() * ZONAS.length);
    const zonaAfectada = ZONAS[zonaIndex];
    // La entropía es multiplicativa (pérdida del 10% al 20% de la población actual)
    const multiplier = 0.8 + Math.random() * 0.1; // Queda 80% a 90% (Pérdida 10% a 20%)
    
    const oldPop = zonaAfectada.population;
    zonaAfectada.population = Math.floor(oldPop * multiplier);
    const reduccion = oldPop - zonaAfectada.population;
    
    // Si la entropía hace que una población caiga a 0, se pierde una vida
    if (zonaAfectada.population <= 0) {
        vidas = Math.max(0, vidas - 1);
        mostrarNotificacion(`¡Entropía Crítica! ${zonaAfectada.name} ha colapsado. Pierdes una vida. Te quedan ${vidas} vidas.`, true);
    } else {
        mostrarNotificacion(`¡Evento de Entropía! ${zonaAfectada.name} pierde **${reduccion.toLocaleString('es')}** de población (x${multiplier.toFixed(2)}).`, true);
    }
    
    actualizarInterfaz();
    revisarEstadoJuego();
}


/**
 * SOLO MANEJA LA SELECCIÓN de la acción.
 * Resalta la carta y habilita el botón de Confirmar.
 */
function procesarAccion(actionId) {
    if (juegoTerminado) return;
    
    // Deseleccionar la acción previa si existe
    if (selectedActionId !== null) {
        const previouslySelectedCard = document.querySelector(`.action-card[data-id="${selectedActionId}"]`);
        if (previouslySelectedCard) {
            previouslySelectedCard.classList.remove('selected');
        }
    }
    
    selectedActionId = actionId;

    // 1. Resaltar la carta seleccionada
    const selectedCard = document.querySelector(`.action-card[data-id="${actionId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }

    // 2. Mostrar la nueva notificación de detalles
    mostrarDetallesAccion(actionId);
    
    // 3. Actualizar notificación principal y habilitar el botón de Confirmar
    const accion = acciones[actionId];
    const titleText = actionId.replace(/([A-Z])/g, ' $1').trim();

    mostrarNotificacion(`**Acción Seleccionada:** ${accion.emoji} ${titleText}. Presiona **Confirmar Acción** para ejecutarla.`, false);

    document.getElementById('confirm-action-btn').disabled = false;
}

/**
 * MANEJA LA EJECUCIÓN del turno al presionar el botón de Confirmar o doble clic.
 */
function ejecutarAccionConfirmada() {
    if (juegoTerminado || selectedActionId === null) return;

    const actionId = selectedActionId;
    const accion = acciones[actionId];

    // 1. Comprobación de vida
    if (accion.costoVidas > 0 && vidas < accion.costoVidas) {
        mostrarNotificacion("¡Alerta! No tienes suficientes vidas para realizar esta acción. Selecciona otra.", true);
        
        // Limpiar la selección si falla
        selectedActionId = null;
        document.querySelectorAll('.action-card').forEach(card => card.classList.remove('selected'));
        document.getElementById('action-details-notification').classList.add('hidden');
        document.getElementById('confirm-action-btn').disabled = true; // Deshabilitar el botón
        return; 
    }

    const zonaIndex = Math.floor(Math.random() * ZONAS.length);

    // 2. Aplicar efecto y obtener mensaje
    const mensajeEfecto = accion.aplicarEfecto(zonaIndex);
    
    // 3. Aplicar el costo/ganancia de vida
    if (accion.costoVidas !== 0) {
        vidas -= accion.costoVidas; 
    }
    
    const titleText = actionId.replace(/([A-Z])/g, ' $1').trim();
    let mensajeCompleto;
    let esEventoCritico = (accion.type === 'negative' || accion.costoVidas > 0);
    
    if (actionId === 'ConsejosAbuela') {
        const randomIndex = Math.floor(Math.random() * CONSEJOS_ABUELA_WARNINGS.length);
        const warning = CONSEJOS_ABUELA_WARNINGS[randomIndex];
        mensajeCompleto = `👵 <span class="abuela-quote">"${warning}"</span><br><br>➡️ [${acciones[actionId].emoji} ${titleText}] ${mensajeEfecto}`;
    } else {
        mensajeCompleto = `[${accion.emoji} ${titleText}] ${mensajeEfecto}`;
    }

    mostrarNotificacion(mensajeCompleto, esEventoCritico);
    
    // 4. Limpiar el estado después de la ejecución
    selectedActionId = null;
    document.querySelectorAll('.action-card').forEach(card => card.classList.remove('selected'));
    document.getElementById('action-details-notification').classList.add('hidden');
    document.getElementById('confirm-action-btn').disabled = true; // Deshabilitar el botón después de ejecutar

    actualizarInterfaz();
    revisarEstadoJuego();
    
    if (!juegoTerminado) {
        // Regenerar cartas después del turno
        dibujarAcciones(generarAccionesAleatorias());
    }
}


function revisarEstadoJuego() {
    let poblacionTotal = ZONAS.reduce((sum, z) => sum + z.population, 0);

    // Condición de Derrota
    if (vidas <= 0) {
        juegoTerminado = true;
        clearInterval(timerIntervalId);
        mostrarNotificacion(`¡FIN DEL JUEGO! Las vidas se agotaron en ${tiempoJuego} segundos.`, true);
        deshabilitarAcciones(); 
        document.getElementById('confirm-action-btn').disabled = true; 
        return;
    }

    // Condición de Victoria
    if (poblacionTotal >= VICTORIA_MIN) {
        juegoTerminado = true;
        clearInterval(timerIntervalId);
        mostrarNotificacion(`🎉 ¡VICTORIA! ¡Alcanzaste ${Math.floor(poblacionTotal).toLocaleString('es')} de población total en ${tiempoJuego} segundos! 🎉`, false);
        deshabilitarAcciones(); 
        document.getElementById('confirm-action-btn').disabled = true; 
        return;
    }
}

/**
 * Función para reiniciar el juego.
 * Inicializa la población aleatoriamente (1 a 50% del límite).
 */
function reiniciarJuego() {
    // Resetear variables de estado
    const maxInitialPop = LIMITE_POBLACION / 2; // 500
    ZONAS = Object.keys(ZONAS_EMOJIS).map(id => {
        // Genera población entre 1 y maxInitialPop (1 a 500)
        const initialPop = Math.floor(Math.random() * maxInitialPop) + 1; 
        return { 
            id: id, 
            name: ZONAS_EMOJIS[id], 
            population: initialPop, 
            limit: LIMITE_POBLACION 
        };
    });
    
    vidas = VIDAS_INICIALES;
    tiempoJuego = 0;
    juegoTerminado = false;
    selectedActionId = null; 
    clearInterval(timerIntervalId);
    
    // Resetear UI
    habilitarAcciones(); 
    dibujarAcciones(generarAccionesAleatorias()); 
    document.getElementById('action-details-notification').classList.add('hidden');
    mostrarNotificacion("Simulación reiniciada. La población inicial es aleatoria (máximo 50%). ¡Busca el equilibrio!"); 

    // Asegurar que el botón de confirmar esté deshabilitado al inicio
    document.getElementById('confirm-action-btn').disabled = true;

    // Iniciar Timer
    actualizarInterfaz();
    iniciarTimer();
}

function iniciarTimer() {
    timerIntervalId = setInterval(() => {
        if (!juegoTerminado) { 
            tiempoJuego++;
            
            // Cada 60 segundos (DURACION_EVENTO_PERIODICO) ocurre la entropía
            if (tiempoJuego % DURACION_EVENTO_PERIODICO === 0 && tiempoJuego !== 0) {
                aplicarEntropia();
            }

            actualizarInterfaz(); 
            revisarEstadoJuego();
        }
    }, 1000);
}


// =======================================================
// 4. LISTENERS (Punto de Entrada)
// =======================================================

document.addEventListener('DOMContentLoaded', () => {
    
    const restartBtn = document.getElementById('restart-btn');
    const confirmBtn = document.getElementById('confirm-action-btn'); 

    if (restartBtn) restartBtn.addEventListener('click', reiniciarJuego);
    
    // Listener para el botón de Confirmar Acción
    if (confirmBtn) confirmBtn.addEventListener('click', ejecutarAccionConfirmada);
    
    // INICIAR EL JUEGO DIRECTAMENTE AL CARGAR LA PÁGINA
    reiniciarJuego(); 
    
    document.getElementById('action-details-notification').classList.add('hidden');
});