// Espera que o DOM esteja completamente carregado antes de executar o script
document.addEventListener("DOMContentLoaded", function() {

    // Seleciona o formulário de contacto
    const contactForm = document.getElementById("contact-form");

    // Seleciona o elemento onde as mensagens de feedback (sucesso/erro) serão mostradas
    const formMessage = document.getElementById("form-message");

    // Verifica se o formulário existe na página atual (para não dar erro noutras páginas)
    if (contactForm) {
        
        // Adiciona um "ouvinte" para o evento 'submit' (envio) do formulário
        contactForm.addEventListener("submit", function(event) {
            
            // 1. Previne o envio real do formulário (que recarregaria a página)
            event.preventDefault();

            // Limpa mensagens anteriores
            formMessage.innerHTML = "";
            
            // 2. Simulação de Validação (num caso real, verificaria campo a campo)
            // Aqui, vamos apenas verificar se os campos 'required' estão preenchidos,
            // o que o 'novalidate' no HTML permite-nos controlar via JS.
            // Para este projeto, vamos simular que é sempre válido se não estiver vazio.
            
            const nome = document.getElementById("nome").value;
            const email = document.getElementById("email").value;
            const mensagem = document.getElementById("mensagem").value;

            if (nome === "" || email === "" || mensagem === "") {
                // Se algum campo essencial estiver vazio, mostra erro
                formMessage.innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        Por favor, preencha todos os campos obrigatórios.
                    </div>
                `;
            } else {
                // 3. Simulação de Envio (se tudo estiver OK)
                // Num projeto real, aqui ocorreria uma chamada (fetch/AJAX) a um servidor.
                
                // Mostra uma mensagem de sucesso
                formMessage.innerHTML = `
                    <div class="alert alert-success" role="alert">
                        <strong>Mensagem enviada com sucesso!</strong> (Isto é uma simulação, nenhum dado foi realmente enviado).
                    </div>
                `;
                
                // 4. Limpa o formulário após o "envio"
                contactForm.reset();
            }
        });
    }

});