// --- 1. CONFIGURAÇÕES E VARIÁVEIS ---
let saldo = 1000.00;
let jogoAtivo = false;
let aposta = 10;
let minas = 1;
let tamanhoGrid = 5;
let totalTiles = 25;

let grelhaLogica = []; 
let tilesClicados = 0;
let multAtual = 1.00;

// --- 2. SELEÇÃO DE ELEMENTOS (IDs TÊM DE BATER CERTO COM O HTML) ---
const gridEl = document.getElementById('minesGrid');
const saldoEl = document.getElementById('saldoDisplay');
const btnAcao = document.getElementById('actionButton'); // Nome corrigido
const msgEl = document.getElementById('gameMessage');
const betInput = document.getElementById('betAmount');
const mineInput = document.getElementById('customMines');
const multEl = document.getElementById('currentMultiplier');
const profitEl = document.getElementById('nextProfit');

// Verifica se encontrou tudo (Aparece na consola F12)
console.log("Sistema de Minas Iniciado...");
if(!gridEl) console.error("ERRO: Não encontrei a Grelha (minesGrid)");
if(!btnAcao) console.error("ERRO: Não encontrei o Botão (actionButton)");

// --- 3. INICIALIZAÇÃO ---
// Garante que corre apenas quando a página estiver pronta
document.addEventListener('DOMContentLoaded', () => {
    criarGrelhaVisual();
    atualizarSaldoDisplay();
});

// --- 4. FUNÇÕES GLOBAIS (Para os botões do HTML funcionarem) ---

// Mudar Tamanho (3x3, 5x5, 7x7)
window.mudarTamanho = function(t) {
    if(jogoAtivo) return;

    tamanhoGrid = t;
    totalTiles = t * t;

    // Atualiza botões visuais
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.includes(t + 'x')) btn.classList.add('active');
    });

    // Atualiza CSS
    gridEl.style.gridTemplateColumns = `repeat(${t}, 1fr)`;

    // Segurança para minas
    let maxMinas = totalTiles - 1;
    if(minas >= maxMinas) setMinas(1);

    criarGrelhaVisual();
}

// Mudar Aposta (1/2 ou 2x)
window.ajustarAposta = function(multiplicador) {
    if(jogoAtivo) return;
    let val = parseFloat(betInput.value) * multiplicador;
    if(val < 1) val = 1;
    if(val > saldo) val = saldo;
    
    betInput.value = val.toFixed(0);
    aposta = val;
}

// Mudar Minas
window.setMinas = function(n) {
    if(jogoAtivo) return;
    
    // Limites
    if(n >= totalTiles) n = totalTiles - 1;
    if(n < 1) n = 1;

    minas = n;
    mineInput.value = n;

    document.querySelectorAll('.mine-btn').forEach(btn => {
        btn.classList.remove('active');
        if(parseInt(btn.innerText) === n) btn.classList.add('active');
    });
}

window.atualizarBotaoMinas = function() {
    let val = parseInt(mineInput.value);
    if(isNaN(val)) val = 1;
    setMinas(val);
}

// --- 5. LÓGICA DO JOGO ---

// Clique no Botão Principal
if(btnAcao) {
    btnAcao.addEventListener('click', () => {
        if(jogoAtivo) {
            cashout();
        } else {
            iniciarJogo();
        }
    });
}

function iniciarJogo() {
    aposta = parseFloat(betInput.value);

    if(isNaN(aposta) || aposta < 1) {
        msgEl.innerText = "Aposta inválida!";
        return;
    }
    
    if(aposta > saldo) {
        msgEl.innerText = "Saldo Insuficiente!";
        msgEl.style.color = "#ef4444";
        return;
    }

    // Deduzir Saldo
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
    mineInput.disabled = true;

    // Gerar Bombas
    grelhaLogica = Array(totalTiles).fill(0);
    let colocadas = 0;
    while(colocadas < minas) {
        let r = Math.floor(Math.random() * totalTiles);
        if(grelhaLogica[r] === 0) {
            grelhaLogica[r] = 1; // 1 = Bomba
            colocadas++;
        }
    }

    criarGrelhaVisual();
}

function criarGrelhaVisual() {
    gridEl.innerHTML = '';
    
    for(let i=0; i<totalTiles; i++) {
        let tile = document.createElement('div');
        tile.classList.add('tile');
        
        // Ajuste CSS
        if(tamanhoGrid === 7) tile.style.fontSize = "1rem";
        
        // Clique no quadrado
        tile.onclick = function() { clicarTile(i, tile); };
        
        gridEl.appendChild(tile);
    }
}

function clicarTile(idx, el) {
    if(!jogoAtivo) return;
    if(el.classList.contains('revealed')) return;

    el.classList.add('revealed');

    // BOMBA
    if(grelhaLogica[idx] === 1) {
        gameOver(idx);
    } 
    // GEMA
    else {
        el.classList.add('gem');
        el.innerHTML = '<i class="fa-regular fa-gem"></i>';
        tilesClicados++;
        
        calcularMultiplicador();

        // Ganhou tudo
        if(tilesClicados === (totalTiles - minas)) {
            cashout();
        }
    }
}

function calcularMultiplicador() {
    let casasLivres = totalTiles - (tilesClicados - 1);
    let gemasLivres = (totalTiles - minas) - (tilesClicados - 1);
    
    let prob = casasLivres / gemasLivres;
    multAtual = multAtual * prob * 0.99; // Margem da casa
    
    multEl.innerText = multAtual.toFixed(2) + "x";
    
    let ganho = aposta * multAtual;
    profitEl.innerText = "€" + ganho.toFixed(2);
    
    btnAcao.innerText = `LEVANTAR €${ganho.toFixed(2)}`;
}

function cashout() {
    let ganho = aposta * multAtual;
    saldo += ganho;
    
    msgEl.innerHTML = `<span style="color:#10b981">GANHASTE €${ganho.toFixed(2)}!</span>`;
    
    terminarJogo(false);
}

function gameOver(idx) {
    let el = gridEl.children[idx];
    el.classList.add('bomb', 'exploded');
    el.innerHTML = '<i class="fa-solid fa-bomb"></i>';
    
    msgEl.innerHTML = `<span style="color:#ef4444">BOOM! Perdeste €${aposta.toFixed(2)}</span>`;
    
    terminarJogo(true);
}

function terminarJogo(perdeu) {
    jogoAtivo = false;
    atualizarSaldoDisplay();

    // Revelar tudo
    for(let i=0; i<totalTiles; i++) {
        let el = gridEl.children[i];
        el.classList.add('revealed');
        
        if(grelhaLogica[i] === 1) {
            if(!el.classList.contains('exploded')) {
                el.classList.add('bomb');
                el.innerHTML = '<i class="fa-solid fa-bomb" style="opacity:0.6"></i>';
            }
        } else {
            if(!el.classList.contains('gem')) {
                el.style.opacity = "0.3";
                el.innerHTML = '<i class="fa-regular fa-gem"></i>';
            }
        }
    }

    // Reset Botão
    btnAcao.innerText = "JOGAR NOVAMENTE";
    btnAcao.classList.remove('btn-cashout');
    btnAcao.classList.add('btn-primary');
    betInput.disabled = false;
    mineInput.disabled = false;
}

function atualizarSaldoDisplay() {
    if(saldoEl) saldoEl.innerText = saldo.toFixed(2) + " €";
}