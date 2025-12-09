// --- RELOJ DIGITAL ---
function updateClock() {
  const now = new Date();
  
  // Formato Fecha: DD/MM/AAAA
  const dia = String(now.getDate()).padStart(2, '0');
  const mes = String(now.getMonth() + 1).padStart(2, '0');
  const anio = now.getFullYear();
  document.getElementById('date-display').innerText = `${dia}/${mes}/${anio}`;

  // Formato Hora: HH:MM:SS
  const horas = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const seg = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('time-display').innerText = `${horas}:${min}:${seg}`;
}

// Iniciar reloj 
setInterval(updateClock, 1000);
updateClock();

// --- LÓGICA DE CARGA Y ESCALADO ---
const dias = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'];

function cargarWOD() {
  // Verificación de seguridad
  if (typeof wods === 'undefined') return;

  const hoyIndex = new Date().getDay();
  const diaNombre = dias[hoyIndex];
  const contenedor = document.getElementById('wod-display');

  if (contenedor.dataset.dia !== diaNombre) {
    contenedor.innerHTML = wods[diaNombre] || "<h3>DESCANSO</h3><p>Box Cerrado / Open Box</p>";
    contenedor.dataset.dia = diaNombre;
    setTimeout(ajustarEscalaPerfecta, 50); 
  }
}

function ajustarEscalaPerfecta() {
  if (window.matchMedia("(orientation: portrait)").matches) return; 

  const wrapper = document.getElementById('wod-display');
  
  // 1. Reset
  wrapper.style.transform = 'scale(1)';
  wrapper.style.justifyContent = 'center';
  
  // 2. Dimensiones
  const alturaDisponible = window.innerWidth; 
  const margenSeguro = alturaDisponible * 0.02; 
  
  const alturaContenido = wrapper.scrollHeight;
  const alturaTarget = alturaDisponible - margenSeguro;
  
  // 3. Calculamos Escala
  let escala = alturaTarget / alturaContenido;
  
  if (escala > 1.5) escala = 1.5;
  if (escala < 0.5) escala = 0.5;

  // 4. Aplicar
  wrapper.style.transform = `scale(${escala})`;

  if (escala >= 1) {
    wrapper.style.height = (alturaContenido) + "px"; 
    wrapper.style.justifyContent = 'space-evenly'; 
  } else {
    wrapper.style.height = "auto";
    wrapper.style.justifyContent = 'center';
  }
}

// Inicializar
window.addEventListener('load', cargarWOD);
window.addEventListener('resize', () => setTimeout(ajustarEscalaPerfecta, 100));

setInterval(cargarWOD, 60000);

