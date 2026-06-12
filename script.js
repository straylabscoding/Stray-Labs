// ==========================================================================
// 1. GESTIÓN DEL INTERRUPTOR DE LUZ (PERSISTENTE Y SIN BUGS)
// ==========================================================================
const themeSwitchBtn = document.getElementById('theme-switch');

if (localStorage.getItem('stray-theme') === 'light') {
    document.body.classList.add('light-mode');
}

if (themeSwitchBtn) {
    themeSwitchBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('light-mode')) {
            localStorage.setItem('stray-theme', 'light');
        } else {
            localStorage.setItem('stray-theme', 'dark');
        }
    });
}

// ==========================================================================
// 2. CONTROLADOR DEL SLOGAN ROTATIVO DINÁMICO (MÁQUINA DE ESCRIBIR)
// ==========================================================================
const wordsArray = ["Prestigio.", "Esencia.", "Diferencia.", "Autonomía.", "Futuro."];
let currentWordIndex = 0;
let isDeleting = false;
let currentText = "";
const targetElement = document.getElementById("rotative-word");

const typingSpeed = 120;
const deletingSpeed = 60;
const pauseBetweenWords = 2200; 

function typeEffect() {
    const fullWord = wordsArray[currentWordIndex];

    if (isDeleting) {
        currentText = fullWord.substring(0, currentText.length - 1);
    } else {
        currentText = fullWord.substring(0, currentText.length + 1);
    }

    if (targetElement) {
        targetElement.innerText = currentText || " ";
    }

    let dynamicDelay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && currentText === fullWord) {
        dynamicDelay = pauseBetweenWords; 
        isDeleting = true;
    } else if (isDeleting && currentText === "") {
        isDeleting = false;
        currentWordIndex = (currentWordIndex + 1) % wordsArray.length; 
        dynamicDelay = 300; 
    }

    setTimeout(typeEffect, dynamicDelay);
}

document.addEventListener("DOMContentLoaded", () => {
    if (targetElement) {
        typeEffect();
    }
});

// ==========================================================================
// 3. INTEGRACIÓN OFICIAL CON MÓDULOS GOOGLE FIREBASE CORE
// ==========================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "TU_API_KEY_AQUÍ",
    authDomain: "TU_PROYECTO.firebaseapp.com",
    projectId: "TU_PROYECTO",
    storageBucket: "TU_PROYECTO.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sistema de Alertas Flotantes
function triggerNotification(text) {
    const wrapper = document.getElementById('toast-wrapper');
    if (!wrapper) return;
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerText = text;
    wrapper.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3500);
}

// Registro
const registerForm = document.getElementById('form-register');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userEmail = document.getElementById('email-input').value;
        const userPass = document.getElementById('pass-input').value;

        createUserWithEmailAndPassword(auth, userEmail, userPass)
            .then(() => {
                triggerNotification("Espacio de cliente generado. Entrando...");
                setTimeout(() => window.location.href = 'dashboard.html', 1500);
            })
            .catch((err) => {
                if (err.code === 'auth/email-already-in-use') {
                    triggerNotification("Este correo electrónico ya está registrado.");
                } else {
                    triggerNotification("Error en las credenciales introducidas.");
                }
            });
    });
}

// Login
const loginForm = document.getElementById('form-login');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userEmail = document.getElementById('login-email').value;
        const userPass = document.getElementById('login-pass').value;

        signInWithEmailAndPassword(auth, userEmail, userPass)
            .then(() => {
                triggerNotification("Acceso autorizado. Cargando consola...");
                setTimeout(() => window.location.href = 'dashboard.html', 1500);
            })
            .catch(() => { triggerNotification("Credenciales inválidas."); });
    });
}

// Seguridad de Ruta
const clientGreeting = document.getElementById('client-greeting');
if (window.location.pathname.includes('dashboard.html')) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (clientGreeting) clientGreeting.innerText = `Consola de: ${user.email}`;
        } else {
            window.location.href = 'login.html';
        }
    });
}

// Cierre de sesión
const logoutActionBtn = document.getElementById('action-logout');
if (logoutActionBtn) {
    logoutActionBtn.addEventListener('click', () => {
        signOut(auth).then(() => { window.location.href = 'index.html'; });
    });
}
