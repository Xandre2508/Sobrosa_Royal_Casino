import { auth, db } from './config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- Janelas ---
window.toggleLogin = function() {
    const overlay = document.getElementById('loginOverlay');
    if(overlay) overlay.classList.toggle('active');
    document.getElementById('registerOverlay')?.classList.remove('active');
}
window.toggleRegister = function() {
    const overlay = document.getElementById('registerOverlay');
    if(overlay) overlay.classList.toggle('active');
    document.getElementById('loginOverlay')?.classList.remove('active');
}

window.addEventListener('click', (e) => {
    if(e.target.id === 'loginOverlay') window.toggleLogin();
    if(e.target.id === 'registerOverlay') window.toggleRegister();
});

// --- Lógica de Auth ---
document.addEventListener('DOMContentLoaded', () => {
    // Login
    const loginForm = document.getElementById('loginForm');
    if(loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                await signInWithEmailAndPassword(auth, document.getElementById('email').value, document.getElementById('password').value);
                // O onAuthStateChanged tratará do resto
                window.toggleLogin();
            } catch(err) { alert("Erro: " + err.message); }
        });
    }

    // Registo
    const regForm = document.getElementById('registerForm');
    if(regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const pass = document.getElementById('reg-password').value;

            try {
                const cred = await createUserWithEmailAndPassword(auth, email, pass);
                await setDoc(doc(db, "users", cred.user.uid), {
                    nome: nome, email: email, saldo: 1000.00, criadoEm: new Date().toISOString()
                });
                // Salvar nome imediatamente para evitar delay
                localStorage.setItem('userDisplayName', nome);
                window.location.reload(); 
            } catch(err) { alert("Erro ao registar: " + err.message); }
        });
    }
    
    // Ativar botão de Logout se ele existir (criado pelo UI.js)
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await signOut(auth);
            localStorage.removeItem('userDisplayName'); // Limpa a cache
            window.location.reload(); // Recarrega para atualizar UI
        });
    }
});

// --- Monitorizar Estado (Source of Truth) ---
onAuthStateChanged(auth, async (user) => {
    const navBlock = document.getElementById('navActionsBlock');
    
    if (user) {
        // Se o Firebase confirmar que está logado
        // Buscamos o nome apenas se não estiver na cache ou para garantir atualização
        if (!localStorage.getItem('userDisplayName')) {
            try {
                const snap = await getDoc(doc(db, "users", user.uid));
                if(snap.exists()) {
                    const nome = snap.data().nome;
                    localStorage.setItem('userDisplayName', nome);
                    // Atualiza visualmente se necessário
                    if(navBlock) {
                        navBlock.innerHTML = `
                            <div class="user-display" style="margin-right: 15px; color: white; font-weight: bold;">
                               <button class="btn btn-outline fa-solid fa-user"  style="border-color: #white; color: #white;"><a href="InformacoesJogador.html">${nome}</a></button>
                            </div>
                            <button class="btn btn-outline" id="logoutBtn" style="border-color: #ef4444; color: #ef4444;">SAIR</button>
                        `;
                        // Re-anexar evento de logout
                        document.getElementById('logoutBtn').addEventListener('click', async () => {
                            await signOut(auth);
                            localStorage.removeItem('userDisplayName');
                            window.location.reload();
                        });
                    }
                }
            } catch(e) { console.error(e); }
        }
    } else {
        // Se o Firebase disser que NÃO está logado, mas a cache dizia que sim (token expirou, etc)
        if (localStorage.getItem('userDisplayName')) {
            localStorage.removeItem('userDisplayName');
            window.location.reload(); // Força atualização para remover o nome falso
        }
    }
});