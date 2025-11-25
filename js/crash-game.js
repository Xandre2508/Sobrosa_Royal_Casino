// HTML da NavbarCrashGame
    const navbarCrashGame = `
<nav class="navbar" style="position: relative; height: auto; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <div class="container nav-content" style="padding: 15px 20px;">
            <div class="logo">
                <img src="./Imagens-Casino/SobrosaRoyalCasino.png" class="logo-img" alt="Sobrosa Logo" style="width: 100px; height: 100px;">
                <div class="logo-text">
                    <h1 style="font-size: 1.5rem;">SOBROSA ROYAL</h1>
                    <span>Space • Crash</span>
                </div>
            </div>
            <div class="nav-actions">
                <div style="margin-right: 20px;">
                    <span style="color: var(--text-gray); font-size: 0.8rem;">Saldo Demo:</span>
                    <span class="text-gold" style="font-weight: 700; font-size: 1.1rem;">€ <span id="userBalance">1000.00</span></span>
                </div>
                <a href="index.html" class="btn btn-outline"><i class="fa-solid fa-arrow-left"></i> Sair</a>
            </div>
        </div>
    </nav>`;

import { auth, db } from './config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let balance = 0, currentBet = 0, multiplier = 1.00;
let gameInterval, isRunning = false, hasBet = false, hasCashedOut = false;
let currentUser = null;

const els = {
    balance: document.getElementById('userBalance'),
    multiplier: document.getElementById('multiplier'),
    rocket: document.getElementById('rocket'),
    btn: document.getElementById('actionBtn'),
    input: document.getElementById('betAmount'),
    status: document.getElementById('statusMessage'),
    history: document.getElementById('historyBar'),
    winnings: document.getElementById('winningsDisplay')
};

// Carregar Dados
// Monitoriza o login e carrega os dados
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // --- UTILIZADOR LOGADO ---
        currentUser = user;
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
            balance = snap.data().saldo;
            updateDisplay();
        }
    } else {
        // --- UTILIZADOR NÃO LOGADO ---
        // Esperamos 500ms para garantir que não é apenas um atraso da internet
        setTimeout(() => {
            // Verificamos novamente se o utilizador continua null
            if (!auth.currentUser) {
                alert("⚠️ ACESSO RESTRITO ⚠️\n\nPrecisas de efetuar LOGIN ou criar conta para jogar Space Crash.");
                window.location.href = "index.html"; // Só redireciona depois de clicar no OK do alerta
            }
        }, 500);
    }
});

function updateDisplay() {
    if(els.balance) els.balance.textContent = balance.toFixed(2);
}

async function saveBalance(newBal) {
    balance = newBal;
    updateDisplay();
    if(currentUser) await updateDoc(doc(db, "users", currentUser.uid), { saldo: balance });
}

// Funções do Jogo
window.adjustBet = (factor) => {
    let val = parseFloat(els.input.value) || 10;
    els.input.value = (val * factor).toFixed(2);
};

if(els.btn) {
    els.btn.addEventListener('click', () => {
        if (!isRunning) startGame();
        else if (hasBet && !hasCashedOut) cashOut();
    });
}

function startGame() {
    const bet = parseFloat(els.input.value);
    if(bet > balance) return alert("Saldo insuficiente!");
    
    currentBet = bet;
    saveBalance(balance - currentBet);
    
    isRunning = true; hasBet = true; hasCashedOut = false; multiplier = 1.00;
    els.rocket.classList.add('flying');
    els.btn.classList.replace('btn-bet', 'btn-cashout');
    els.btn.textContent = "RETIRAR";
    
    const crashPoint = (Math.random() * 5) + 1; // Simplificado para teste

    gameInterval = setInterval(() => {
        multiplier += 0.01 + (multiplier * 0.008);
        els.multiplier.textContent = multiplier.toFixed(2) + 'x';
        
        if(!hasCashedOut) els.btn.textContent = `RETIRAR (€${(currentBet * multiplier).toFixed(2)})`;

        if (multiplier >= crashPoint) doCrash(crashPoint);
    }, 50);
}

function cashOut() {
    hasCashedOut = true;
    const win = currentBet * multiplier;
    saveBalance(balance + win);
    els.winnings.textContent = `+ €${win.toFixed(2)}`;
    els.btn.classList.replace('btn-cashout', 'btn-waiting');
    els.btn.textContent = "ESPERANDO...";
}

function doCrash(val) {
    clearInterval(gameInterval);
    isRunning = false;
    els.rocket.classList.remove('flying');
    els.multiplier.style.color = "#ef4444";
    els.multiplier.textContent = `CRASH @ ${val.toFixed(2)}x`;
    
    setTimeout(() => {
        els.btn.className = "btn btn-bet";
        els.btn.textContent = "APOSTAR";
        els.multiplier.style.color = "white";
        els.multiplier.textContent = "1.00x";
        els.winnings.textContent = "";
    }, 2000);
}

