// Verifica se já existe um utilizador salvo no navegador (Cache)
const savedName = localStorage.getItem('userDisplayName');

// Define quais botões mostrar IMEDIATAMENTE
let navButtonsHTML = '';

if (savedName) {
    // Se houver nome salvo, mostra o estado de LOGADO
    navButtonsHTML = `
        <div class="user-display" style="margin-right: 15px; color: white; font-weight: bold;">
            <i class="fa-solid fa-user"></i> ${savedName}
        </div>
        <button class="btn btn-outline" id="logoutBtn" style="border-color: #ef4444; color: #ef4444;">SAIR</button>
    `;
} else {
    // Se não houver, mostra Entrar/Registo
    navButtonsHTML = `
        <button class="btn btn-outline" onclick="if(window.toggleLogin) window.toggleLogin()">ENTRAR</button>
        <button class="btn btn-gradient" onclick="if(window.toggleRegister) window.toggleRegister()">REGISTO</button>
    `;
}

// HTML da Navbar (Agora com os botões dinâmicos inseridos)
const navbarHTML = `
<nav class="navbar" style="z-index: 1000; position: relative;">
    <div class="container nav-content">
        <a href="index.html" class="logo-link">
            <div class="logo">
                <img src="Imagens-Casino/SobrosaRoyalCasino.png" class="logo-img" alt="Sobrosa Logo" style="width: 200px; height: 200px;">
                <div class="logo-text">
                    <h1>SOBROSA ROYAL</h1>
                    <span>Casino • Versão Alfa</span>
                </div>
            </div>
        </a>

        <div class="nav-links">
            <a href="index.html">Inicio</a>
            <a href="index.html">Jogos</a>
            <a href="PromoçõesCasino.html">Promoções</a>
            <a href="Vips.html">VIP</a>
            <a href="Sobre.html">Sobre</a>
        </div>
        
        <div class="nav-actions" id="navActionsBlock">
            ${navButtonsHTML}
        </div>
    </div>
</nav>`;

// HTML do Footer
const footerHTML = `
<footer class="footer">
    <div class="container">
        <div class="footer-grid">
            <div class="footer-col">
                <h4 class="footer-title brand-title">SOBROSA ROYAL</h4>
                <p class="footer-desc">Casino Clube é uma demo para fins educativos.</p>
            </div>
            <div class="footer-col">
                <h4 class="footer-title">Links</h4>
                <ul class="footer-links">
                    <li><a href="index.html">Inicio</a></li>
                    <li><a href="PromoçõesCasino.html">Promoções</a></li>
                    <li><a href="Vips.html">VIP</a></li>
                </ul>
            </div>
            <div class="footer-col">
                 <h4 class="footer-title">Pagamentos</h4>
                 <div class="payment-icons">
                    <i class="fa-brands fa-cc-visa"></i> <i class="fa-brands fa-bitcoin"></i>
                 </div>
            </div>
        </div>
        <div class="footer-bottom"><p>&copy; 2025 Casino Clube — Demo.</p></div>
    </div>
</footer>`;

// HTML dos Modais
const modalsHTML = `
<div class="overlay" id="loginOverlay">
    <div class="login-card">
        <h2>Entrar</h2>
        <form id="loginForm" class="login-form">
            <div class="form-group"><label>Email</label><input type="email" id="email" required></div>
            <div class="form-group"><label>Senha</label><input type="password" id="password" required></div>
            <div class="form-actions">
                <button type="button" class="btn-cancel" onclick="if(window.toggleLogin) window.toggleLogin()">Cancelar</button>
                <button type="submit" class="btn-confirm">Entrar</button>
            </div>
        </form>
    </div>
</div>
<div class="overlay" id="registerOverlay">
    <div class="login-card">
        <h2>Criar Conta</h2>
        <form id="registerForm" class="login-form">
            <div class="form-group"><label>Nome</label><input type="text" id="reg-name" required></div>
            <div class="form-group"><label>Email</label><input type="email" id="reg-email" required></div>
            <div class="form-group"><label>Senha</label><input type="password" id="reg-password" required></div>
            <div class="form-actions">
                <button type="button" class="btn-cancel" onclick="if(window.toggleRegister) window.toggleRegister()">Cancelar</button>
                <button type="submit" class="btn-confirm">Registar</button>
            </div>
        </form>
    </div>
</div>`;

// Injeção no DOM
document.body.insertAdjacentHTML('afterbegin', navbarHTML + modalsHTML);
document.body.insertAdjacentHTML('beforeend', footerHTML);
console.log("UI Otimizada Carregada");

// --- EFEITO MOUSE FOLLOWER (VERSÃO ALTA PERFORMANCE) ---

// 1. Criar a div da luz automaticamente
const spotlight = document.createElement('div');
spotlight.classList.add('luz-cursor');
document.body.appendChild(spotlight);

// 2. Mover a luz instantaneamente
document.addEventListener('mousemove', (e) => {
    // Usamos requestAnimationFrame para garantir que a luz move 
    // à mesma velocidade que o ecrã atualiza (60fps ou 144fps)
    requestAnimationFrame(() => {
        spotlight.style.left = e.clientX + 'px';
        spotlight.style.top = e.clientY + 'px';
    });
});