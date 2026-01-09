/* --- START OF FILE admin.js --- */

// 1. CONFIGURACIÓN FIREBASE (PON TUS DATOS AQUÍ)
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

// 2. MANEJO DE SESIÓN
auth.onAuthStateChanged((user) => {
    document.getElementById('loading-section').classList.add('hidden'); 
    
    if (user) {
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('step-1-section').classList.remove('hidden');
    } else {
        document.getElementById('step-1-section').classList.add('hidden');
        document.getElementById('editor-section').classList.add('hidden');
        document.getElementById('login-section').classList.remove('hidden');
    }
});

// 3. FUNCIONES
function login() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const msg = document.getElementById('login-msg');
    const btn = document.getElementById('btn-login');

    msg.innerText = "";
    btn.innerText = "Entrando...";
    btn.disabled = true;

    auth.signInWithEmailAndPassword(email, pass)
        .catch((error) => {
            btn.innerText = "Iniciar Sesión";
            btn.disabled = false;
            
            if (error.code === 'auth/wrong-password') msg.innerText = "Contraseña incorrecta";
            else if (error.code === 'auth/user-not-found') msg.innerText = "Usuario no encontrado";
            else if (error.code === 'auth/invalid-email') msg.innerText = "Email inválido";
            else msg.innerText = "Error: " + error.message;
        });
}

function logout() {
    auth.signOut();
    location.reload();
}

function generateForms() {
    const count = document.getElementById('slide-count').value;
    const container = document.getElementById('slides-container');
    container.innerHTML = "";
    for(let i=0; i<count; i++) {
        container.innerHTML += `
        <div style="background:#000; padding:15px; border:1px solid #444; margin-bottom:15px; border-radius:8px;">
            <!-- CAMBIO: Título en Rojo Neón -->
            <h3 style="color:#ff0000; text-align:left;">Pantalla ${i+1}</h3>
            <div class="input-group"><label>Título</label><input type="text" class="slide-title"></div>
            <div class="input-group"><label>Contenido</label><textarea class="slide-content"></textarea></div>
        </div>`;
    }
    document.getElementById('step-1-section').classList.add('hidden');
    document.getElementById('editor-section').classList.remove('hidden');
}

function publishToFirebase() {
    if (!auth.currentUser) {
        alert("Sesión expirada. Por favor entra de nuevo.");
        logout();
        return;
    }

    const titles = document.querySelectorAll('.slide-title');
    const contents = document.querySelectorAll('.slide-content');
    let data = [];
    
    titles.forEach((t, i) => {
        data.push({ titulo: t.value || "SIN TÍTULO", contenido: contents[i].value || "" });
    });

    const msg = document.getElementById('save-msg');
    msg.innerText = "Subiendo...";
    msg.style.color = "#fff";

    db.ref('customWod').set(data)
        .then(() => {
            msg.innerText = "¡WOD PUBLICADO CON ÉXITO!";
            msg.style.color = "#ff0000"; // Rojo éxito
            setTimeout(() => msg.innerText = "", 3000);
        })
        .catch((error) => {
            msg.innerText = "Error: " + error.message;
            msg.style.color = "orange";
        });
}
