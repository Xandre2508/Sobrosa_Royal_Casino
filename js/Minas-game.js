// ==================================================
//  CONFIGURAÇÕES E ESTADO DO JOGO
// ==================================================
let saldo = 1000.00;
let jogoAtivo = false;
let aposta = 10;
let minas = 1; // Padrão: 1 mina
let tamanhoGrid = 5;
let totalTiles = 25;

let grelhaLogica = []; 
let tilesClicados = 0;
let multAtual = 1.00;

// ==================================================
//  SELEÇÃO DE ELEMENTOS
// ==================================================
const gridEl = document.getElementById('minesGrid');
const saldoEl = document.getElementById('saldoDisplay');
const btnAcao = document.getElementById('actionButton');
const msgEl = document.getElementById('gameMessage');
const betInput = document.getElementById('betAmount');
const multEl = document.getElementById('currentMultiplier');
const profitEl = document.getElementById('nextProfit');

// ==================================================
//  INICIALIZAÇÃO
// ==================================================
document.addEventListener('DOMContentLoaded', () => {
    window.mudarTamanho(5);
    atualizarSaldoDisplay();
    // Inicia com 1 mina selecionada visualmente
    window.setMinas(1);
    console.log("Sistema carregado.");
});

// ==================================================
//  FUNÇÕES GLOBAIS (HTML ONCLICK)
// ==================================================

// 1. MUDAR TAMANHO
window.mudarTamanho = function(t) {
    if (jogoAtivo) return;

    tamanhoGrid = t;
    totalTiles = t * t;

    // Visual Botoes Tamanho
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.includes(t + 'x')) btn.classList.add('active');
    });

    // CSS Grid
    if(gridEl) gridEl.style.gridTemplateColumns = `repeat(${t}, 1fr)`;

    // Validação Minas (Se minas > quadrados, reduz para 1)
    if (minas >= totalTiles) window.setMinas(1);

    criarGrelhaVisual();
}

// 2. DEFINIR MINAS (SIMPLIFICADO)
window.setMinas = function(n) {
    if (jogoAtivo) return;

    // Validação de segurança
    if (n >= totalTiles) return; // Ignora se não for possível

    minas = n;

    // Atualiza visual dos botões de minas
    document.querySelectorAll('.mine-btn').forEach(btn => {
        btn.classList.remove('active');
        // Converte texto do botão para número para comparar
        if (parseInt(btn.innerText) === n) btn.classList.add('active');
    });
}

// 3. AJUSTAR APOSTA
window.ajustarAposta = function(mult) {
    if (jogoAtivo) return;
    let val = parseFloat(betInput.value) * mult;
    if (val < 1) val = 1;
    betInput.value = val.toFixed(0);
    aposta = val;
}

// 4. AÇÃO PRINCIPAL
if(btnAcao) {
    btnAcao.addEventListener('click', () => {
        if (jogoAtivo) {
            cashout();
        } else {
            iniciarJogo();
        }
    });
}

// ==================================================
//  LÓGICA DO JOGO
// ==================================================

function iniciarJogo() {
    aposta = parseFloat(betInput.value);

    if (isNaN(aposta) || aposta < 1) return;
    
    if (aposta > saldo) {
        msgEl.innerText = "Saldo Insuficiente!";
        msgEl.style.color = "#ef4444";
        return;
    }

    // Deduz Saldo
    saldo -= aposta;
    atualizarSaldoDisplay();

    // Reset Variáveis
    jogoAtivo = true;
    tilesClicados = 0;
    multAtual = 1.00;
    msgEl.innerText = "";
    multEl.innerText = "1.00x";
    profitEl.innerText = "€" + aposta.toFixed(2);

    // Interface
    btnAcao.innerText = "LEVANTAR AGORA";
    btnAcao.classList.add('btn-cashout');
    btnAcao.classList.remove('btn-primary');
    betInput.disabled = true;
    
    // Desabilitar botões de minas durante o jogo
    toggleMineButtons(true);

    // Gerar Minas
    grelhaLogica = Array(totalTiles).fill(0);
    let colocadas = 0;
    while (colocadas < minas) {
        let r = Math.floor(Math.random() * totalTiles);
        if (grelhaLogica[r] === 0) {
            grelhaLogica[r] = 1; 
            colocadas++;
        }
    }

    criarGrelhaVisual();
}

function criarGrelhaVisual() {
    gridEl.innerHTML = '';
    for (let i = 0; i < totalTiles; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        
        if (tamanhoGrid === 7) tile.style.fontSize = "1.2rem";

        tile.onclick = function() { clicarTile(i, tile); };
        
        gridEl.appendChild(tile);
    }
}

function clicarTile(idx, el) {
    if (!jogoAtivo) return;
    if (el.classList.contains('revealed')) return;

    el.classList.add('revealed');

    if (grelhaLogica[idx] === 1) {
        gameOver(idx);
    } else {
        el.classList.add('gem');
        el.innerHTML = '<i class="fa-regular fa-gem"></i>';
        tilesClicados++;
        
        calcularMultiplicador();

        if (tilesClicados === (totalTiles - minas)) {
            cashout();
        }
    }
}

function calcularMultiplicador() {
    let casasLivres = totalTiles - (tilesClicados - 1);
    let gemasLivres = (totalTiles - minas) - (tilesClicados - 1);
    let prob = casasLivres / gemasLivres;
    
    multAtual = multAtual * prob * 0.99; 
    
    multEl.innerText = multAtual.toFixed(2) + "x";
    let lucro = aposta * multAtual;
    profitEl.innerText = "€" + lucro.toFixed(2);
    btnAcao.innerText = `LEVANTAR €${lucro.toFixed(2)}`;
}

function cashout() {
    let ganho = aposta * multAtual;
    saldo += ganho;
    
    msgEl.innerText = `GANHASTE €${ganho.toFixed(2)}!`;
    msgEl.style.color = "#10b981";
    
    terminarJogo(false);
}

function gameOver(idx) {
    let el = gridEl.children[idx];
    el.classList.add('bomb', 'exploded');
    el.innerHTML = '<i class="fa-solid fa-bomb"></i>';
    
    msgEl.innerText = `BOOM! Perdeste €${aposta.toFixed(2)}`;
    msgEl.style.color = "#ef4444";
    
    terminarJogo(true);
}

function terminarJogo(perdeu) {
    jogoAtivo = false;
    atualizarSaldoDisplay();

    for (let i = 0; i < totalTiles; i++) {
        let el = gridEl.children[i];
        el.classList.add('revealed');
        el.onclick = null;

        if (grelhaLogica[i] === 1) {
            if (!el.classList.contains('exploded')) {
                el.classList.add('bomb');
                el.innerHTML = '<i class="fa-solid fa-bomb" style="opacity:0.6"></i>';
            }
        } else {
            if (!el.classList.contains('gem')) {
                el.style.opacity = "0.3";
                el.innerHTML = '<i class="fa-regular fa-gem"></i>';
            }
        }
    }

    btnAcao.innerText = "JOGAR NOVAMENTE";
    btnAcao.classList.remove('btn-cashout');
    btnAcao.classList.add('btn-primary');
    betInput.disabled = false;
    
    // Reativar botões de minas
    toggleMineButtons(false);
}

function atualizarSaldoDisplay() {
    if(saldoEl) saldoEl.innerText = saldo.toFixed(2) + " €";
}

// Função auxiliar para bloquear os botões de minas
function toggleMineButtons(disabled) {
    document.querySelectorAll('.mine-btn').forEach(btn => {
        btn.disabled = disabled;
        btn.style.opacity = disabled ? "0.5" : "1";
        btn.style.cursor = disabled ? "not-allowed" : "pointer";
    });
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.disabled = disabled;
        btn.style.opacity = disabled ? "0.5" : "1";
        btn.style.cursor = disabled ? "not-allowed" : "pointer";
    });
}