// --- RELOJ DIGITAL ---
function updateClock() {
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
  }
  setInterval(updateClock, 1000);
  updateClock();
  
  // --- VARIABLES GLOBALES ---
  const dias = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'];
  let currentSlideIndex = 0;
  let currentWodParts = [];
  let isFullViewMode = false;
  
  // --- CARGAR WOD ---
  function cargarWOD() {
    if (typeof wods === 'undefined') return;
  
    const hoyIndex = new Date().getDay();
    const diaNombre = dias[hoyIndex];
    const contenedor = document.getElementById('wod-display');
    
    // Si cambia el día o carga inicial
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
      
      // Si estábamos en modo full, refrescar contenido
      if(isFullViewMode) {
          isFullViewMode = false; 
          toggleFullView(); // Re-toggle to update content
      }
    }
  }
  
  // --- RENDERIZAR SLIDE (CON NEGRITA) ---
  function renderSlide() {
    if(isFullViewMode) return; 
  
    const wrapper = document.getElementById('wod-display');
    wrapper.classList.add('fading');
  
    setTimeout(() => {
      const part = currentWodParts[currentSlideIndex];
      
      // 1. APLICAR FORMATO NEGRITA
      const contenidoFormateado = formatearTexto(part.contenido);
  
      // 2. INYECTAR HTML
      wrapper.innerHTML = `<h3>${part.titulo}</h3><p>${contenidoFormateado}</p>`;
  
      // Actualizar indicador
      document.getElementById('slide-indicator').innerText = `${currentSlideIndex + 1} / ${currentWodParts.length}`;
      
      // Actualizar botones
      const btnPrev = document.getElementById('btn-prev');
      const btnNext = document.getElementById('btn-next');
      if(btnPrev) {
          btnPrev.disabled = (currentSlideIndex === 0);
          btnPrev.style.opacity = (currentSlideIndex === 0) ? "0.3" : "1";
      }
      if(btnNext) {
          btnNext.disabled = (currentSlideIndex === currentWodParts.length - 1);
          btnNext.style.opacity = (currentSlideIndex === currentWodParts.length - 1) ? "0.3" : "1";
      }
  
      ajustarEscala(); 
      wrapper.classList.remove('fading');
    }, 400); // Matches CSS transition duration
  }
  
  // --- HELPER NEGRITA ---
  function formatearTexto(texto) {
    if (!texto) return "";
    return texto.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
  }
  
  // --- MODO VISTA COMPLETA ---
  function toggleFullView() {
    isFullViewMode = !isFullViewMode; 
    
    const fullContainer = document.getElementById('full-view-container');
    const slideWrapper = document.getElementById('wod-display');
    const indicator = document.getElementById('slide-indicator');
    const buttons = document.getElementById('nav-buttons');
  
    if (isFullViewMode) {
      let fullHTML = "";
      currentWodParts.forEach(part => {
        const contenidoFormateado = formatearTexto(part.contenido);
        fullHTML += `
          <div class="full-section">
            <h3>${part.titulo}</h3>
            <p>${contenidoFormateado}</p>
          </div>
        `;
      });
      fullContainer.innerHTML = fullHTML;
  
      fullContainer.classList.remove('hidden');
      slideWrapper.classList.add('hidden');
      buttons.style.display = 'none'; // Hide buttons in full view
    } else {
      fullContainer.classList.add('hidden');
      slideWrapper.classList.remove('hidden');
      buttons.style.display = 'flex';
      setTimeout(ajustarEscala, 100);
    }
  }
  
  function cambiarSlide(direccion) {
    if(isFullViewMode) return; 
    const nuevoIndex = currentSlideIndex + direccion;
    if (nuevoIndex >= 0 && nuevoIndex < currentWodParts.length) {
      currentSlideIndex = nuevoIndex;
      renderSlide();
    }
  }
  
  // --- AJUSTAR ESCALA (Refined for Rotated View) ---
  function ajustarEscala() {
    if (isFullViewMode) return; 
    if (window.matchMedia("(orientation: portrait)").matches) return; 
  
    const wrapper = document.getElementById('wod-display');
    if (!wrapper) return;
  
    // Reset transform to measure naturally
    wrapper.style.transform = 'scale(1)';
    wrapper.style.width = 'auto'; // allow expansion
  
    // CONSTANTS for Safe Area
    // In rotated -90deg view:
    // Physical Screen Width (1920) -> IS VISUAL HEIGHT
    // Physical Screen Height (1080) -> IS VISUAL WIDTH
    
    const visualWidthAvailable = window.innerHeight * 0.90; // Using Height as Visual Width
    const visualHeightAvailable = window.innerWidth * 0.70;  // Using Width as Visual Height (leaving space for header/footer)
  
    // Measure Content
    const contentWidth = wrapper.scrollWidth;
    const contentHeight = wrapper.scrollHeight;
  
    const scaleX = visualWidthAvailable / contentWidth;
    const scaleY = visualHeightAvailable / contentHeight;
  
    let scale = Math.min(scaleX, scaleY);
  
    // Clamp scale
    scale = Math.min(Math.max(scale, 0.4), 1.5);
  
    wrapper.style.transform = `scale(${scale})`;
  }
  
  // --- CONTROL DE TECLADO ---
  document.addEventListener('keydown', function(event) {
    const key = event.key; 
  
    if (key === '0') {
      toggleFullView();
      return;
    }
  
    if (isFullViewMode) {
       if(key === 'Escape' || key === 'Backspace' || key === '0') toggleFullView();
       return; 
    }
  
    if (key >= '1' && key <= '9') {
      const targetIndex = parseInt(key) - 1;
      if (targetIndex >= 0 && targetIndex < currentWodParts.length) {
        currentSlideIndex = targetIndex;
        renderSlide();
      }
    }
  
    if (key === 'ArrowLeft') cambiarSlide(-1);
    if (key === 'ArrowRight' || key === 'Enter') cambiarSlide(1);
  });
  
  // Inicialización
  window.addEventListener('load', () => { 
      cargarWOD(); 
      setTimeout(ajustarEscala, 500); 
  });
  window.addEventListener('resize', () => setTimeout(ajustarEscala, 200));
  setInterval(cargarWOD, 60000);
