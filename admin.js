/* --- VARIABLES Y CREDENCIALES --- */
// NOTA: Esto es inseguro para web real, pero aceptable para uso local
const USER_VALID = "admin";
const PASS_VALID = "crossfit";

/* --- LOGIN --- */
function handleLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const msg = document.getElementById('login-msg');

    if (user === USER_VALID && pass === PASS_VALID) {
        // Login exitoso
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('editor-section').classList.remove('hidden');
        loadSavedData(); // Cargar datos si existen
    } else {
        // Error
        msg.innerText = "Credenciales incorrectas";
        msg.className = "status-msg status-error";
    }
}

/* --- LOGOUT --- */
function logout() {
    document.getElementById('username').value = "";
    document.getElementById('password').value = "";
    document.getElementById('login-msg').innerText = "";

    document.getElementById('editor-section').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
}

/* --- GUARDAR WOD --- */
function saveCustomWod() {
    const title = document.getElementById('wod-title').value;
    const content = document.getElementById('wod-content').value;
    const msg = document.getElementById('save-msg');

    if (!title.trim() || !content.trim()) {
        msg.innerText = "Por favor completa ambos campos.";
        msg.className = "status-msg status-error";
        return;
    }

    const customWodData = {
        titulo: title,
        contenido: content,
        fecha: new Date().toLocaleDateString()
    };

    try {
        localStorage.setItem('customWod', JSON.stringify(customWodData));
        msg.innerText = "¡Guardado exitosamente! Presiona '8' en la TV.";
        msg.className = "status-msg status-success";
    } catch (e) {
        msg.innerText = "Error al guardar en memoria local.";
        msg.className = "status-msg status-error";
        console.error(e);
    }
}

/* --- CARGAR DATOS PREVIOS --- */
function loadSavedData() {
    const saved = localStorage.getItem('customWod');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            document.getElementById('wod-title').value = data.titulo || "";
            document.getElementById('wod-content').value = data.contenido || "";
        } catch (e) {
            console.error("Error leyendo datos guardados", e);
        }
    }
}
