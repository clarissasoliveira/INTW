document.addEventListener('DOMContentLoaded', () => {

    // --- FUNCIONALIDADE 0: LÓGICA DO MODO CLARO/ESCURO ---
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun');
    const moonIcon = document.querySelector('.moon');
    const htmlEl = document.documentElement;

    // Função para aplicar o tema e atualizar o ícone
    const applyTheme = (theme) => {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme); // Salva a preferência
        // Atualiza qual ícone é visível
        if (theme === 'light') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    };
    
    // Verifica a preferência do usuário no localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Verifica a preferência do sistema operacional
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    // Define o tema inicial
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersLight) {
        applyTheme('light');
    } else {
        applyTheme('dark'); // Padrão
    }

    // Listener para o clique no botão
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    });


    // --- FUNCIONALIDADE 1: ANIMAÇÃO AO ROLAR A PÁGINA ---
    const fadeInSections = document.querySelectorAll('.fade-in');
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    fadeInSections.forEach(section => sectionObserver.observe(section));

    // --- FUNCIONALIDADE 2: NAVEGAÇÃO ATIVA ---
    const navLinks = document.querySelectorAll('header nav a');
    const sections = document.querySelectorAll('main section');
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
    }, { rootMargin: '-30% 0px -70% 0px' });
    sections.forEach(section => navObserver.observe(section));
    
    // --- FUNCIONALIDADE 3: VALIDAÇÃO DE FORMULÁRIOS (sem alterações) ---
    const forms = {
        evento: document.getElementById('evento-form'),
        sugestao: document.getElementById('sugestao-form'),
        contato: document.getElementById('contato-form'),
        newsletter: document.getElementById('newsletter-form')
    };

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

    const validateField = (field) => {
        if (field.hasAttribute('required') && field.value.trim() === '') {
            showError(field, 'Este campo é obrigatório.');
            return false;
        }
        if (field.type === 'email' && field.value.trim() !== '' && !isEmailValid(field.value)) {
            showError(field, 'Por favor, insira um e-mail válido.');
            return false;
        }
        showSuccess(field);
        return true;
    };

    const validateForm = (form) => {
        let isFormValid = true;
        const fieldsToValidate = form.querySelectorAll('input, textarea, select');
        fieldsToValidate.forEach(field => {
            if(!validateField(field)) {
                isFormValid = false;
            }
        });
        return isFormValid;
    };
    
    for (const key in forms) {
        if (forms[key]) {
            forms[key].addEventListener('submit', function(e) {
                e.preventDefault();
                const fieldsToValidate = this.querySelectorAll('[required], [type="email"]');
                let isFormValid = true;
                fieldsToValidate.forEach(field => {
                    if (!validateField(field)) {
                        isFormValid = false;
                    }
                });

                if (isFormValid) {
                    alert('Formulário enviado com sucesso! (Isso é uma simulação)');
                    this.reset();
                    // Limpa as mensagens de erro após o reset
                     this.querySelectorAll('.error-message').forEach(err => err.textContent = '');
                     this.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
                } else {
                     alert('Por favor, corrija os erros no formulário.');
                }
            });
        }
    }
});