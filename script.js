// --- RELOJ DIGITAL ---
function updateClock() {
  const now = new Date();
  const dia = String(now.getDate()).padStart(2, '0');
  const mes = String(now.getMonth() + 1).padStart(2, '0');
  const anio = now.getFullYear();
  document.getElementById('date-display').innerText = `${dia}/${mes}/${anio}`;

  const horas = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const seg = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('time-display').innerText = `${horas}:${min}:${seg}`;
}
setInterval(updateClock, 1000);
updateClock();

// --- LÓGICA DE SLIDES ---
const dias = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'];
let currentSlideIndex = 0;
let currentWodParts = [];

function cargarWOD() {
  if (typeof wods === 'undefined') return;

  const hoyIndex = new Date().getDay();
  const diaNombre = dias[hoyIndex];
  
  // Si cambia el día o es la primera carga
  const contenedor = document.getElementById('wod-display');
  
  if (contenedor.dataset.dia !== diaNombre) {
    contenedor.dataset.dia = diaNombre;
    
    // Obtenemos las partes del día o mensaje de descanso
    const datosDia = wods[diaNombre];
    
    if (Array.isArray(datosDia)) {
      currentWodParts = datosDia;
    } else {
      // Si no hay array (ej: descanso no definido o error), creamos uno genérico
      currentWodParts = [{ titulo: "DESCANSO", contenido: "Box Cerrado / Open Box" }];
    }
    
    // Resetear al primer slide
    currentSlideIndex = 0;
    renderSlide();
  }
}

function renderSlide() {
  const wrapper = document.getElementById('wod-display');
  const part = currentWodParts[currentSlideIndex];
  
  // Inyectar HTML
  wrapper.innerHTML = `
    <h3>${part.titulo}</h3>
    <p>${part.contenido}</p>
  `;

  // Actualizar indicador (Ej: 1/3)
  const indicator = document.getElementById('slide-indicator');
  indicator.innerText = `${currentSlideIndex + 1} / ${currentWodParts.length}`;

  // Actualizar estado de botones
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');

  // Si estamos en el primero, deshabilitar prev
  btnPrev.disabled = (currentSlideIndex === 0);
  btnPrev.style.opacity = (currentSlideIndex === 0) ? "0" : "1";

  // Si estamos en el último, deshabilita next
  btnNext.disabled = (currentSlideIndex === currentWodParts.length - 1);
  btnNext.style.opacity = (currentSlideIndex === currentWodParts.length - 1) ? "0" : "1";

  // Re-calcular escala para aprovechar pantalla
  setTimeout(ajustarEscala, 10);
}

function cambiarSlide(direccion) {
  const nuevoIndex = currentSlideIndex + direccion;
  if (nuevoIndex >= 0 && nuevoIndex < currentWodParts.length) {
    currentSlideIndex = nuevoIndex;
    renderSlide();
  }
}

// Escalar contenido para llenar la TV sin desbordar
function ajustarEscala() {
  if (window.matchMedia("(orientation: portrait)").matches) return; 

  const wrapper = document.getElementById('wod-display');
  wrapper.style.transform = 'scale(1)'; // Reset
  
  const alturaDisponible = window.innerWidth * 0.8; // 80% del ancho real (altura en rotación)
  const alturaContenido = wrapper.scrollHeight;
  
  let escala = alturaDisponible / alturaContenido;
  
  // Límites de escala
  if (escala > 1.8) escala = 1.8; // No hacer la letra absurdamente grande si hay poco texto
  if (escala < 0.6) escala = 0.6; // No hacerla ilegible

  wrapper.style.transform = `scale(${escala})`;
}

// Inicializar
window.addEventListener('load', cargarWOD);
window.addEventListener('resize', () => setTimeout(ajustarEscala, 100));
setInterval(cargarWOD, 60000); // Chequear cambio de día cada minuto