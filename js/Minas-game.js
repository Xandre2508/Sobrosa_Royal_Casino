// --- CONFIGURAÇÕES DO JOGO ---
let saldo = 1000.00;
let jogoAtivo = false;
let aposta = 10;
let minas = 1;
let tamanhoGrid = 5; // Padrão 5x5
let totalTiles = 25;

let grelhaLogica = []; // 0=Gema, 1=Bomba
let tilesClicados = 0;
let multAtual = 1.00;

// --- ELEMENTOS HTML ---
const gridEl = document.getElementById('minesGrid');
const saldoEl = document.getElementById('saldoDisplay');
const btnMain = document.getElementById('actionButton');
const msgEl = document.getElementById('gameMessage');
const betInput = document.getElementById('betAmount');
const mineInput = document.getElementById('customMines');
const multEl = document.getElementById('currentMultiplier');
const profitEl = document.getElementById('nextProfit');

// Inicializa o jogo
window.onload = function() {
    // Força o tamanho 5x5 logo no início
    mudarTamanho(5); 
};

// --- FUNÇÃO 1: MUDAR TAMANHO DO CAMPO ---
function mudarTamanho(t) {
    if(jogoAtivo) return;

    tamanhoGrid = t;
    totalTiles = t * t;

    // Atualiza botões visuais
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.includes(t + 'x')) btn.classList.add('active');
    });

    // Atualiza o CSS da Grid
    gridEl.style.gridTemplateColumns = `repeat(${t}, 1fr)`;

    // Se tiver minas a mais para o novo tamanho, reseta para 1
    if(minas >= totalTiles) {
        setMinas(1);
    }

    criarGrelhaVisual();
}

// --- FUNÇÃO 2: DEFINIR MINAS ---
function setMinas(n) {
    if(jogoAtivo) return;
    
    // Validação
    if(n >= totalTiles) n = totalTiles - 1;
    if(n < 1) n = 1;

    minas = n;
    mineInput.value = n;

    document.querySelectorAll('.mine-btn').forEach(btn => {
        btn.classList.remove('active');
        if(parseInt(btn.innerText) === n) btn.classList.add('active');
    });
}

function atualizarBotaoMinas() {
    let val = parseInt(mineInput.value);
    setMinas(val);
}

// --- FUNÇÃO 3: AJUSTAR APOSTA ---
function ajustarAposta(multiplicador) {
    if(jogoAtivo) return;
    let val = parseFloat(betInput.value) * multiplicador;
    if(val < 1) val = 1;
    betInput.value = val.toFixed(0);
}

// --- FUNÇÃO 4: CRIAR GRELHA VISUALMENTE ---
function criarGrelhaVisual() {
    gridEl.innerHTML = '';
    
    for(let i=0; i<totalTiles; i++) {
        let tile = document.createElement('div');
        tile.classList.add('tile');
        
        // Ajuste de fonte para grelha 7x7
        if(tamanhoGrid === 7) tile.style.fontSize = "1rem";
        
        tile.onclick = function() { clicarTile(i, tile); };
        gridEl.appendChild(tile);
    }
}

// --- FUNÇÃO 5: COMEÇAR O JOGO ---
btnMain.onclick = function() {
    if(jogoAtivo) {
        cashout(); // Se já joga, o botão serve para levantar
    } else {
        iniciarJogo();
    }
};

function iniciarJogo() {
    aposta = parseFloat(betInput.value);
    
    if(aposta > saldo) {
        msgEl.innerText = "Saldo Insuficiente!";
        msgEl.style.color = "#ef4444";
        return;
    }

    // Deduz Saldo
    saldo -= aposta;
    atualizarSaldo();

    // Reset Variáveis
    jogoAtivo = true;
    tilesClicados = 0;
    multAtual = 1.00;
    msgEl.innerText = "";

    // Atualiza UI
    btnMain.innerText = "LEVANTAR AGORA";
    btnMain.classList.add('btn-cashout');
    btnMain.classList.remove('btn-primary');
    betInput.disabled = true;

    // Gerar Minas (Lógica)
    grelhaLogica = Array(totalTiles).fill(0);
    let colocadas = 0;
    
    while(colocadas < minas) {
        let r = Math.floor(Math.random() * totalTiles);
        if(grelhaLogica[r] === 0) {
            grelhaLogica[r] = 1; // 1 = Bomba
            colocadas++;
        }
    }

    criarGrelhaVisual(); // Limpa a grelha visualmente
    atualizarCalculos();
}

// --- FUNÇÃO 6: CLIQUE NO QUADRADO ---
function clicarTile(idx, el) {
    if(!jogoAtivo) return;
    if(el.classList.contains('revealed')) return;

    el.classList.add('revealed');

    // Se for BOMBA
    if(grelhaLogica[idx] === 1) {
        gameOver(idx);
    } 
    // Se for GEMA
    else {
        el.classList.add('gem');
        el.innerHTML = '<i class="fa-regular fa-gem"></i>';
        tilesClicados++;
        
        calcularMultiplicador();

        // Se encontrou todas as gemas
        if(tilesClicados === (totalTiles - minas)) {
            cashout();
        }
    }
}

// --- FUNÇÃO 7: CÁLCULOS ---
function calcularMultiplicador() {
    let casasLivres = totalTiles - (tilesClicados - 1);
    let gemasLivres = (totalTiles - minas) - (tilesClicados - 1);
    
    let prob = casasLivres / gemasLivres;
    multAtual = multAtual * prob * 0.99; // House edge
    
    multEl.innerText = multAtual.toFixed(2) + "x";
    atualizarCalculos();
}

function atualizarCalculos() {
    let ganho = aposta * multAtual;
    profitEl.innerText = "€" + ganho.toFixed(2);
    
    if(tilesClicados > 0) {
        btnMain.innerText = `LEVANTAR €${ganho.toFixed(2)}`;
    } else {
        btnMain.innerText = "ESCOLHE UM QUADRADO";
    }
}

// --- FUNÇÃO 8: TERMINAR JOGO ---
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
    atualizarSaldo();

    // Revelar tudo
    for(let i=0; i<totalTiles; i++) {
        let el = gridEl.children[i];
        el.classList.add('revealed'); // Bloqueia tudo
        
        if(grelhaLogica[i] === 1) {
            // Se é bomba
            if(!el.classList.contains('exploded')) {
                el.classList.add('bomb');
                el.innerHTML = '<i class="fa-solid fa-bomb" style="opacity:0.6"></i>';
            }
        } else {
            // Se é gema
            if(!el.classList.contains('gem')) {
                el.style.opacity = "0.3";
                el.innerHTML = '<i class="fa-regular fa-gem"></i>';
            }
        }
    }

    // Reset UI
    btnMain.innerText = "JOGAR NOVAMENTE";
    btnMain.classList.remove('btn-cashout');
    btnMain.classList.add('btn-primary');
    betInput.disabled = false;
}

function atualizarSaldo() {
    saldoEl.innerText = saldo.toFixed(2) + " €";
}