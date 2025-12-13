// 1. RELOJ DIGITAL
function updateClock() {
  try {
    const now = new Date();
    const dia = String(now.getDate()).padStart(2, '0');
    const mes = String(now.getMonth() + 1).padStart(2, '0');
    const anio = now.getFullYear();
    const elDate = document.getElementById('date-display');
    if(elDate) elDate.innerText = `${dia}/${mes}/${anio}`;

    const horas = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const seg = String(now.getSeconds()).padStart(2, '0');
    const elTime = document.getElementById('time-display');
    if(elTime) elTime.innerText = `${horas}:${min}:${seg}`;
  } catch (e) {
    console.log("Error reloj");
  }
}
setInterval(updateClock, 1000);
updateClock();

// 2. LÓGICA DE SLIDES
const dias = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'];
let currentSlideIndex = 0;
let currentWodParts = [];

function cargarWOD() {
  // Protección contra fallo de carga de wods.js
  if (typeof wods === 'undefined') {
    document.getElementById('wod-display').innerHTML = "<h3>CARGANDO...</h3><p>Si esto no cambia, revisa wods.js</p>";
    return;
  }

  const hoyIndex = new Date().getDay();
  const diaNombre = dias[hoyIndex];
  
  const contenedor = document.getElementById('wod-display');
  
  // Si cambia el día o no hay nada cargado
  if (contenedor.dataset.dia !== diaNombre || currentWodParts.length === 0) {
    contenedor.dataset.dia = diaNombre;
    
    const datosDia = wods[diaNombre];
    
    if (Array.isArray(datosDia)) {
      currentWodParts = datosDia;
    } else {
      currentWodParts = [{ titulo: "DESCANSO", contenido: "Box Cerrado / Open Box" }];
    }
    
    currentSlideIndex = 0;
    renderSlide();
  }
}

function renderSlide() {
  const wrapper = document.getElementById('wod-display');
  if (!wrapper || currentWodParts.length === 0) return;

  // 1. INICIAR SALIDA (Fade Out)
  wrapper.classList.add('fading');

  // 2. ESPERAR 300ms 
  setTimeout(() => {
    
    // --- CAMBIO DE CONTENIDO ---
    const part = currentWodParts[currentSlideIndex];
    
    wrapper.innerHTML = `
      <h3>${part.titulo}</h3>
      <p>${part.contenido}</p>
    `;

    // Actualizar indicador
    const indicator = document.getElementById('slide-indicator');
    if(indicator) indicator.innerText = `${currentSlideIndex + 1} / ${currentWodParts.length}`;

    // Actualizar botones
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    
    if (btnPrev) {
      btnPrev.disabled = (currentSlideIndex === 0);
      btnPrev.style.opacity = (currentSlideIndex === 0) ? "0" : "1";
    }
    if (btnNext) {
      btnNext.disabled = (currentSlideIndex === currentWodParts.length - 1);
      btnNext.style.opacity = (currentSlideIndex === currentWodParts.length - 1) ? "0" : "1";
    }

    // Recalcular tamaño de letra ANTES de mostrarlo
    ajustarEscala();

    // 3. INICIAR ENTRADA (Fade In)
    wrapper.classList.remove('fading');

  }, 300); // Mismo número del CSS '0.3s' 
}

function cambiarSlide(direccion) {
  const nuevoIndex = currentSlideIndex + direccion;
  if (nuevoIndex >= 0 && nuevoIndex < currentWodParts.length) {
    currentSlideIndex = nuevoIndex;
    renderSlide();
  }
}

// 3. ESCALAR TEXTO (Ajustado para pantallas pequeñas/rotadas)
function ajustarEscala() {
  // En móvil vertical no escalamos igual
  if (window.matchMedia("(orientation: portrait)").matches) return; 

  const wrapper = document.getElementById('wod-display');
  if (!wrapper) return;

  wrapper.style.transform = 'scale(1)'; // Resetear para medir
  
  // Usamos el 80% del ancho de la ventana (que es la altura física en rotación)
  const alturaDisponible = window.innerWidth * 0.82; 
  const alturaContenido = wrapper.scrollHeight;
  
  let escala = alturaDisponible / alturaContenido;
  
  // Límites de seguridad
  if (escala > 1.8) escala = 1.8; 
  if (escala < 0.35) escala = 0.35; // Permite reducir mucho si el texto es largo

  wrapper.style.transform = `scale(${escala})`;
}

// 4. CONTROL REMOTO (TV FLUX / ANDROID / TV BRO)
document.addEventListener('keydown', function(event) {
  const key = event.key; 
  const code = event.keyCode; 

  // -- Teclas Numéricas (1 al 9) --
  if (key >= '1' && key <= '9') {
    const targetIndex = parseInt(key) - 1; // '1' es índice 0
    if (targetIndex >= 0 && targetIndex < currentWodParts.length) {
      currentSlideIndex = targetIndex;
      renderSlide();
    }
  }

  // -- Flechas del Control --
  // Izquierda
  if (key === 'ArrowLeft' || code === 37) {
    cambiarSlide(-1);
  }
  // Derecha
  if (key === 'ArrowRight' || code === 39) {
    cambiarSlide(1);
  }
  
  // -- Enter / OK --
  if (key === 'Enter' || code === 13) {
    cambiarSlide(1); 
  }

  // -- Botón Atrás (Evitar salir de la app) --
  if (key === 'Backspace' || code === 8 || key === 'Escape' || code === 27) {
     // Opcional
     event.preventDefault(); // Evita que el navegador cierre la página
     cambiarSlide(-1);
  }
});

// Inicialización
window.addEventListener('load', function() {
    cargarWOD();
    setTimeout(ajustarEscala, 500); // Doble chequeo de escala
});
window.addEventListener('resize', function() {
    setTimeout(ajustarEscala, 100);
});
setInterval(cargarWOD, 60000);


