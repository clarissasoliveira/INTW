document.addEventListener('DOMContentLoaded', () => {

    // --- FUNCIONALIDADE 1: ANIMAÇÃO AO ROLAR A PÁGINA ---
    const fadeInSections = document.querySelectorAll('.fade-in');

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    fadeInSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- FUNCIONALIDADE 2: NAVEGAÇÃO ATIVA E SUAVE ---
    const navLinks = document.querySelectorAll('header nav a');
    const sections = document.querySelectorAll('main section');

    // Navegação Suave já é feita com CSS 'scroll-behavior: smooth'

    // Lógica para marcar o link ativo
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-30% 0px -70% 0px'
    });

    sections.forEach(section => {
        navObserver.observe(section);
    });
    
    // --- FUNCIONALIDADE 3: VALIDAÇÃO DE FORMULÁRIOS ---

    const forms = {
        evento: document.getElementById('evento-form'),
        sugestao: document.getElementById('sugestao-form'),
        contato: document.getElementById('contato-form'),
        newsletter: document.getElementById('newsletter-form')
    };

    // Funções auxiliares de validação
    const showError = (input, message) => {
        const formGroup = input.parentElement;
        const errorDisplay = formGroup.querySelector('.error-message');
        
        input.classList.add('error');
        errorDisplay.textContent = message;
    };

    const showSuccess = (input) => {
        const formGroup = input.parentElement;
        const errorDisplay = formGroup.querySelector('.error-message');
        
        input.classList.remove('error');
        errorDisplay.textContent = '';
    };

    const isEmailValid = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    // Função genérica para validar campos
    const validateField = (field) => {
        const isRequired = field.hasAttribute('required');

        // 1. Checa campos obrigatórios
        if (isRequired && field.value.trim() === '') {
            showError(field, 'Este campo é obrigatório.');
            return false;
        }

        // 2. Checa formato de e-mail
        if (field.type === 'email' && field.value.trim() !== '' && !isEmailValid(field.value)) {
            showError(field, 'Por favor, insira um e-mail válido.');
            return false;
        }

        // Se passar em tudo
        showSuccess(field);
        return true;
    };

    const validateForm = (form) => {
        let isFormValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });
        
        // Valida e-mails não obrigatórios, se preenchidos
        const optionalEmails = form.querySelectorAll('input[type="email"]:not([required])');
        optionalEmails.forEach(emailField => {
            if (emailField.value.trim() !== '' && !validateField(emailField)) {
                isFormValid = false;
            }
        });

        return isFormValid;
    };

    // Adiciona o listener de 'submit' para cada formulário
    for (const key in forms) {
        if (forms[key]) {
            forms[key].addEventListener('submit', function(e) {
                e.preventDefault(); // Impede o envio real do formulário

                if (validateForm(this)) {
                    // Simulação de sucesso
                    alert('Formulário enviado com sucesso! (Isso é uma simulação)');
                    this.reset(); // Limpa o formulário
                } else {
                     alert('Por favor, corrija os erros no formulário.');
                }
            });
        }
    }
});