/* --- START OF FILE admin.js --- */

// 1. CONFIGURACIÓN FIREBASE
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

// ESTADO GLOBAL
let selectedLocation = ""; // 'miraflores' | 'calacoto'
let selectedMode = "";     // 'new' | 'append'

// 2. MANEJO DE SESIÓN
auth.onAuthStateChanged((user) => {
    document.getElementById('loading-section').classList.add('hidden');

    if (user) {
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('location-section').classList.remove('hidden'); // Ir a selección de sede
    } else {
        hideAllSections();
        document.getElementById('login-section').classList.remove('hidden');
    }
});

function hideAllSections() {
    const sections = ['login-section', 'loading-section', 'location-section', 'mode-section', 'count-section', 'editor-section'];
    sections.forEach(id => document.getElementById(id).classList.add('hidden'));
}

// 3. LOGICA DE NAVEGACIÓN
function login() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const msg = document.getElementById('login-msg');
    const btn = document.getElementById('btn-login');

    msg.innerText = "";
    btn.innerText = "Entrando...";
    btn.disabled = true;

    // FUERZA QUE NO SE GUARDE LA SESIÓN LOCALMENTE (solo mientras esté abierta la pestaña)
    auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
            return auth.signInWithEmailAndPassword(email, pass);
        })
        .catch((error) => {
            btn.innerText = "Iniciar Sesión";
            btn.disabled = false;

            console.error(error); // Para debug en consola tambien

            // MENSAJES DE ERROR PERSONALIZADOS
            if (error.code === 'auth/wrong-password') {
                msg.innerText = "Error: Contraseña incorrecta";
            }
            else if (error.code === 'auth/user-not-found') {
                msg.innerText = "Error: Usuario no encontrado";
            }
            else if (error.code === 'auth/invalid-email') {
                msg.innerText = "Error: Formato de email inválido";
            }
            else if (error.code === 'auth/network-request-failed') {
                msg.innerText = "Error de Conexión: Verifica tu internet";
            }
            else if (error.code === 'auth/too-many-requests') {
                msg.innerText = "Error: Demasiados intentos. Espera un momento.";
            }
            else {
                msg.innerText = "Error desconocido: " + error.message;
            }
        });
}

function togglePassword() {
    const passInput = document.getElementById('password');
    if (passInput.type === "password") {
        passInput.type = "text";
    } else {
        passInput.type = "password";
    }
}

function logout() {
    auth.signOut();
    location.reload();
}

// PASO 1: SELECCIONAR SEDE
function selectLocation(loc) {
    selectedLocation = loc;

    // UI Update
    document.getElementById('location-section').classList.add('hidden');
    document.getElementById('mode-section').classList.remove('hidden');

    const label = document.getElementById('selected-location-label');
    label.innerText = `SEDE: ${loc.toUpperCase()}`;
}

// PASO 2: SELECCIONAR MODO
function selectMode(mode) {
    selectedMode = mode;

    document.getElementById('mode-section').classList.add('hidden');

    if (mode === 'new') {
        // Modo Nuevo -> Pedir cantidad
        document.getElementById('count-section').classList.remove('hidden');
    } else {
        // Modo Agregar -> Cargar datos existentes
        loadExistingAndEdit();
    }
}

// BACK BUTTONS
function goBackToLocation() {
    document.getElementById('mode-section').classList.add('hidden');
    document.getElementById('location-section').classList.remove('hidden');
}

function goBackToMode() {
    document.getElementById('count-section').classList.add('hidden');
    document.getElementById('mode-section').classList.remove('hidden');
}

// 4. GENERADORES DEL EDITOR
function initEditorNew() {
    const count = document.getElementById('slide-count').value;
    const container = document.getElementById('slides-container');
    container.innerHTML = "";

    for (let i = 0; i < count; i++) {
        addSlideHTML(i + 1, "", "");
    }

    showEditor();
}

function loadExistingAndEdit() {
    const dbPath = (selectedLocation === 'miraflores') ? 'customWodMiraflores' : 'customWodCalacoto';
    const msgDiv = document.createElement('div');
    msgDiv.innerHTML = '<h3 style="color:#fff">Cargando datos actuales...</h3>';
    document.body.appendChild(msgDiv); // Temporary generic loading

    db.ref(dbPath).once('value').then(snapshot => {
        const data = snapshot.val() || [];
        const container = document.getElementById('slides-container');
        container.innerHTML = "";

        document.body.removeChild(msgDiv); // Remove loading

        if (!Array.isArray(data) || data.length === 0) {
            alert("No hay datos existentes. Iniciando en blanco.");
            addSlideHTML(1, "", "");
        } else {
            data.forEach((item, index) => {
                addSlideHTML(index + 1, item.titulo, item.contenido);
            });
            // Agregar uno extra vacio automáticamente para facilitar
            addSlideHTML(data.length + 1, "", "");
        }

        showEditor();
    }).catch(err => {
        alert("Error cargando datos: " + err.message);
        location.reload();
    });
}

function showEditor() {
    document.getElementById('count-section').classList.add('hidden');
    document.getElementById('mode-section').classList.add('hidden'); // Ensure closed
    document.getElementById('editor-section').classList.remove('hidden');

    document.getElementById('editor-location-label').innerText =
        `EDITANDO: ${selectedLocation.toUpperCase()} | MODO: ${selectedMode === 'new' ? 'REEMPLAZAR TODO' : 'AGREGAR'}`;
}

// HELPER: Agregar un bloque de slide al DOM
function addSlideHTML(num, titleVal, contentVal) {
    const container = document.getElementById('slides-container');
    const div = document.createElement('div');
    div.className = 'slide-block';
    div.style.cssText = "background:#000; padding:15px; border:1px solid #444; margin-bottom:15px; border-radius:8px; position:relative;";

    div.innerHTML = `
        <span style="position:absolute; right:10px; top:10px; color:#444; font-weight:bold;">#${num}</span>
        <h3 style="color:#ff0000; text-align:left; margin-top:0;">Pantalla ${num}</h3>
        <div class="input-group">
            <label>Título</label>
            <input type="text" class="slide-title" value="${titleVal || ''}" placeholder="Ej: WOD, CALENTAMIENTO...">
        </div>
        <div class="input-group">
            <label>Contenido (*usar asteriscos para negrita*)</label>
            <textarea class="slide-content" placeholder="Escribe aquí el ejercicio...">${contentVal || ''}</textarea>
        </div>
        <div style="text-align:right;">
            <button onclick="this.parentElement.parentElement.remove()" style="background:none; border:none; color:#666; cursor:pointer;">[Eliminar esta pantalla]</button>
        </div>
    `;
    container.appendChild(div);
}

function addSlideField() {
    const currentCount = document.querySelectorAll('.slide-block').length;
    addSlideHTML(currentCount + 1, "", "");
}

// 5. PUBLICAR
function publishToFirebase() {
    if (!auth.currentUser) {
        alert("Sesión expirada. Por favor entra de nuevo.");
        logout();
        return;
    }

    const titles = document.querySelectorAll('.slide-title');
    const contents = document.querySelectorAll('.slide-content');

    if (titles.length === 0) {
        if (!confirm("¿Estás seguro de publicar VACÍO? Esto borrará el WOD de la pantalla.")) return;
    }

    let data = [];
    titles.forEach((t, i) => {
        data.push({
            titulo: t.value || "SIN TÍTULO",
            contenido: contents[i].value || ""
        });
    });

    const msg = document.getElementById('save-msg');
    msg.innerText = "Subiendo a " + selectedLocation.toUpperCase() + "...";
    msg.style.color = "#fff";

    const dbPath = (selectedLocation === 'miraflores') ? 'customWodMiraflores' : 'customWodCalacoto';

    db.ref(dbPath).set(data)
        .then(() => {
            msg.innerText = "¡WOD PUBLICADO CON ÉXITO EN " + selectedLocation.toUpperCase() + "!";
            msg.style.color = "#ff0000"; // Rojo éxito
            setTimeout(() => {
                if (confirm("Publicado. ¿Quieres salir?")) location.reload();
            }, 1000);
        })
        .catch((error) => {
            msg.innerText = "Error: " + error.message;
            msg.style.color = "orange";
        });
}

