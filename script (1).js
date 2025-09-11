document.addEventListener("DOMContentLoaded", function () {
  const severityButtons = document.querySelectorAll(".severity-btn");
  const fotoProblemaInput = document.getElementById("fotoProblema");
  const previewFoto = document.getElementById("previewFoto");
  const form = document.querySelector("form");
  const submitBtn = document.querySelector(".submit-btn");
  const successModal = document.getElementById("successModal");
  document.addEventListener('DOMContentLoaded', function() 
    const form = document.querySelector('form'); // Seleciona o formulário

    let selectedSeverity = ''; // Variável para armazenar o nível de gravidade selecionado

    severityButtons.forEach(button => {
        button.addEventListener('click', function() {
            severityButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            selectedSeverity = this.dataset.severity; // Armazena o valor da gravidade
        });
    });

    fotoProblemaInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewFoto.src = e.target.result;
                previewFoto.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            previewFoto.src = '#';
            previewFoto.style.display = 'none';
        }
    });

    // Adiciona o event listener para o submit do formulário
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const formData = {
            nomeLoja: document.getElementById('nomeLoja').value,
            localizacaoLoja: document.getElementById('localizacaoLoja').value,
            descricaoProblema: document.getElementById('descricaoProblema').value,
            nivelGravidade: selectedSeverity, // Usa o valor da gravidade selecionada
            contato: document.getElementById('contato').value
            // A foto do problema é mais complexa para enviar via JSON diretamente. 
            // Se precisar enviar a foto, considere usar FormData e um endpoint que aceite multipart/form-data.
            // Por simplicidade, este exemplo não inclui o envio da foto.
        };

        // Envia os dados para o Webhook do n8n
        fetch('https://n8n.srv882894.hstgr.cloud/webhook-test/4e33cb60-b7cc-4a49-bead-ce3cb2cbb0ef', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Sucesso:', data);
            alert('Solicitação enviada com sucesso!');
            form.reset(); // Limpa o formulário após o envio
            previewFoto.style.display = 'none';
            severityButtons.forEach(btn => btn.classList.remove('selected'));
            selectedSeverity = '';
        })
        .catch((error) => {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao enviar a solicitação.');
        });
    });
});


  let selectedSeverity = "";

  // Animação de entrada dos elementos
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observar elementos para animação
  document.querySelectorAll('.form-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.6s ease';
    observer.observe(section);
  });

  // Gerenciar seleção de gravidade
  severityButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remover seleção anterior
      severityButtons.forEach((btn) => btn.classList.remove("selected"));
      
      // Adicionar seleção atual
      this.classList.add("selected");
      selectedSeverity = this.dataset.severity;
      
      // Feedback visual
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });

    // Efeitos de hover
    button.addEventListener("mouseenter", function() {
      if (!this.classList.contains("selected")) {
        this.style.transform = 'translateY(-2px)';
      }
    });

    button.addEventListener("mouseleave", function() {
      if (!this.classList.contains("selected")) {
        this.style.transform = '';
      }
    });
  });

  // Gerenciar upload de foto
  fotoProblemaInput.addEventListener("change", function () {
    const file = this.files[0];
    const uploadBox = this.closest('.file-upload-box');
    
    if (file) {
      // Validar tamanho do arquivo (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('Arquivo muito grande. Máximo 5MB permitido.', 'error');
        this.value = '';
        return;
      }

      // Validar tipo de arquivo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        showNotification('Formato não suportado. Use JPG, PNG ou GIF.', 'error');
        this.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        previewFoto.src = e.target.result;
        previewFoto.style.display = "block";
        
        // Animar a aparição da prévia
        previewFoto.style.opacity = '0';
        previewFoto.style.transform = 'scale(0.8)';
        setTimeout(() => {
          previewFoto.style.transition = 'all 0.3s ease';
          previewFoto.style.opacity = '1';
          previewFoto.style.transform = 'scale(1)';
        }, 50);
        
        // Atualizar texto do upload
        const uploadText = uploadBox.querySelector('.upload-text strong');
        uploadText.textContent = `Foto selecionada: ${file.name}`;
        uploadBox.style.borderColor = 'var(--accent-color)';
        uploadBox.style.background = 'rgba(16, 185, 129, 0.05)';
      };
      reader.readAsDataURL(file);
    } else {
      previewFoto.src = "#";
      previewFoto.style.display = "none";
      
      // Resetar texto do upload
      const uploadText = uploadBox.querySelector('.upload-text strong');
      uploadText.textContent = 'Clique para adicionar uma foto';
      uploadBox.style.borderColor = '';
      uploadBox.style.background = '';
    }
  });

  // Validação em tempo real dos campos
  const inputs = document.querySelectorAll('input[required], textarea[required]');
  inputs.forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('input', clearFieldError);
  });

  function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    if (!value) {
      showFieldError(field, 'Este campo é obrigatório');
    } else if (field.id === 'telefone') {
      validatePhone(field);
    }
  }

  function validatePhone(field) {
    const value = field.value.trim();
    const phoneRegex = /^55\d{10,11}$/;
    
    if (!phoneRegex.test(value)) {
      showFieldError(field, 'Digite um telefone válido (Ex: 5521987306767)');
    }
  }

  function showFieldError(field, message) {
    clearFieldError({ target: field });
    
    field.style.borderColor = 'var(--danger-color)';
    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
      color: var(--danger-color);
      font-size: 0.875rem;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    `;
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    field.parentNode.appendChild(errorDiv);
  }

  function clearFieldError(e) {
    const field = e.target;
    const errorDiv = field.parentNode.querySelector('.field-error');
    
    if (errorDiv) {
      errorDiv.remove();
    }
    
    field.style.borderColor = '';
    field.style.boxShadow = '';
  }

  // Submissão do formulário
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Validar campos obrigatórios
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        showFieldError(field, 'Este campo é obrigatório');
        isValid = false;
      }
    });

    // Validar seleção de gravidade
    if (!selectedSeverity) {
      showNotification('Por favor, selecione o nível de gravidade', 'error');
      isValid = false;
    }

    if (!isValid) {
      // Scroll para o primeiro erro
      const firstError = form.querySelector('.field-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Mostrar loading
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    const formData = new FormData();
    // Adiciona os campos de texto ao FormData
    formData.append("nomeLoja", document.getElementById("nomeLoja").value);
    formData.append("areaEspaco", document.getElementById("areaEspaco").value);
    formData.append("descricaoProblema", document.getElementById("descricaoProblema").value);
    formData.append("sugestaoSolucao", document.getElementById("sugestaoSolucao").value);
    formData.append("nivelGravidade", selectedSeverity);
    formData.append("nomePessoa", document.getElementById("nomePessoa").value);
    formData.append("telefone", document.getElementById("telefone").value);

    // Adicionar foto se houver
    if (fotoProblemaInput.files.length > 0) {
      formData.append("fotoProblema", fotoProblemaInput.files[0]);
    }

    // Simular delay para demonstração
    setTimeout(() => {
      // Enviar dados para o webhook
      fetch("https://n8n.srv882894.hstgr.cloud/webhook-test/4e33cb60-b7cc-4a49-bead-ce3cb2cbb0ef", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Sucesso:", data);
          showSuccessModal();
          resetForm();
        })
        .catch((error) => {
          console.error("Erro:", error);
          showNotification('Ocorreu um erro ao enviar a solicitação. Tente novamente.', 'error');
        })
        .finally(() => {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        });
    }, 1000);
  });

  // Funções auxiliares
  function showSuccessModal() {
    successModal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    successModal.classList.remove('show');
    document.body.style.overflow = '';
  }

  function resetForm() {
    form.reset();
    previewFoto.src = "#";
    previewFoto.style.display = "none";
    severityButtons.forEach((btn) => btn.classList.remove("selected"));
    selectedSeverity = "";
    
    // Limpar erros
    form.querySelectorAll('.field-error').forEach(error => error.remove());
    
    // Resetar upload box
    const uploadBox = form.querySelector('.file-upload-box');
    const uploadText = uploadBox.querySelector('.upload-text strong');
    uploadText.textContent = 'Clique para adicionar uma foto';
    uploadBox.style.borderColor = '';
    uploadBox.style.background = '';
  }

  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'error' ? 'var(--danger-color)' : 'var(--accent-color)'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      box-shadow: var(--shadow-lg);
      z-index: 1001;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      max-width: 400px;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    
    notification.innerHTML = `
      <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'check-circle'}"></i>
      ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 5 segundos
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }

  // Tornar closeModal global para o botão do modal
  window.closeModal = closeModal;

  // Efeitos de parallax suave no scroll
  let ticking = false;
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.background-pattern');
    const speed = scrolled * 0.5;
    
    parallax.style.transform = `translateY(${speed}px)`;
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick);

  // Adicionar efeito de digitação no título
  const title = document.querySelector('.form-header h1');
  if (title) {
    const text = title.textContent;
    title.textContent = '';
    title.style.borderRight = '2px solid white';
    
    let i = 0;
    function typeWriter() {
      if (i < text.length) {
        title.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        setTimeout(() => {
          title.style.borderRight = 'none';
        }, 1000);
      }
    }
    
    setTimeout(typeWriter, 500);
  }
});

