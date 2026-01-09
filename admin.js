/* --- START OF FILE admin.js --- */

// --- 1. PEGA AQUÍ TU CONFIGURACIÓN DE FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyCC3idHLHcFFcGOAbdJGtuWYsrV0PFf8Oc",
  authDomain: "crosssfit--3640-tv.firebaseapp.com",
  databaseURL: "https://crosssfit--3640-tv-default-rtdb.firebaseio.com",
  projectId: "crosssfit--3640-tv",
  storageBucket: "crosssfit--3640-tv.firebasestorage.app",
  messagingSenderId: "908256000888",
  appId: "1:908256000888:web:09e4bffb19519b8784668d"
};

// Inicializar
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

// --- SISTEMA DE LOGIN ---
// Verifica si ya hay usuario al cargar la página
auth.onAuthStateChanged((user) => {
    if (user) {
        // Usuario logueado -> Mostrar paso 1
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('step-1-section').classList.remove('hidden');
    } else {
        // Nadie logueado -> Mostrar login
        document.getElementById('login-section').classList.remove('hidden');
        document.getElementById('step-1-section').classList.add('hidden');
        document.getElementById('editor-section').classList.add('hidden');
    }
});

function login() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    const msg = document.getElementById('login-msg');

    auth.signInWithEmailAndPassword(email, pass)
        .catch((error) => {
            msg.innerText = "Error: " + error.message;
        });
}

function logout() {
    auth.signOut();
    location.reload();
}

// --- GENERAR FORMULARIOS ---
function generateForms() {
    const count = document.getElementById('slide-count').value;
    const container = document.getElementById('slides-container');
    container.innerHTML = "";

    for(let i=0; i<count; i++) {
        container.innerHTML += `
        <div style="background:#000; padding:15px; border:1px solid #444; margin-bottom:15px; border-radius:8px; text-align:left;">
            <h3 style="color:#39ff14; margin-bottom:10px;">Pantalla ${i+1}</h3>
            <div class="input-group">
                <label>Título (Rojo Neón)</label>
                <input type="text" class="slide-title" placeholder="Ej: WARM UP EXTRA">
            </div>
            <div class="input-group">
                <label>Contenido</label>
                <textarea class="slide-content" placeholder="Escribe aquí... Usa *asteriscos* para negrita."></textarea>
            </div>
        </div>`;
    }
    document.getElementById('step-1-section').classList.add('hidden');
    document.getElementById('editor-section').classList.remove('hidden');
}

// --- PUBLICAR EN LA NUBE ---
function publishToFirebase() {
    const titles = document.querySelectorAll('.slide-title');
    const contents = document.querySelectorAll('.slide-content');
    let data = [];
    
    titles.forEach((t, i) => {
        data.push({ 
            titulo: t.value || "SIN TÍTULO", 
            contenido: contents[i].value || "" 
        });
    });

    const msg = document.getElementById('save-msg');
    msg.innerText = "Subiendo...";

    // Guardamos en la ruta 'customWod' de la base de datos
    db.ref('customWod').set(data)
        .then(() => {
            msg.innerText = "¡LISTO! Las pantallas se actualizarán automáticamente.";
        })
        .catch((error) => {
            msg.innerText = "Error: " + error.message;
            msg.style.color = "red";
        });
}
