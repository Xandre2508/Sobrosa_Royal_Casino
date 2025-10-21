document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 1. Lógica de Validação de Formulário Bootstrap
    // Aplicada ao formulário em contactos.html
    // ============================================

    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (form) {
        form.addEventListener('submit', function (event) {
            
            // Previne o envio por defeito se a validação falhar
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                formMessage.innerHTML = `<div class="alert alert-warning">Por favor, preencha todos os campos obrigatórios.</div>`;
            } else {
                // Se o formulário for válido, previne o envio para simular a submissão via JS
                event.preventDefault();
                
                // Simulação de Submissão AJAX bem-sucedida
                
                // Desativa o botão de envio
                const submitButton = form.querySelector('button[type="submit"]');
                submitButton.disabled = true;
                submitButton.textContent = 'A Enviar...';

                setTimeout(() => {
                    // Mensagem de sucesso profissional
                    formMessage.innerHTML = `
                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                            <strong>Mensagem Enviada!</strong> Agradecemos o seu contacto. Responderemos o mais brevemente possível.
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
                        </div>
                    `;
                    
                    // Limpar o formulário
                    form.reset();
                    form.classList.remove('was-validated');

                    // Reativar o botão
                    submitButton.disabled = false;
                    submitButton.textContent = 'Enviar Mensagem';

                }, 1500); // Simula um atraso de 1.5 segundos
            }

            form.classList.add('was-validated');
        }, false);
    }
    
    // ============================================
    // 2. Lógica Adicional (pode ser expandida no futuro)
    // ============================================
    
    // Exemplo: Função para realçar o link ativo na navegação
    // (Esta lógica é já tratada pelo Bootstrap com a classe 'active', mas pode ser estendida aqui)
});

// Nota: A lógica do scroll reveal foi adicionada diretamente no final de cada ficheiro HTML
// para garantir que dependesse apenas das funções da janela e do DOM.