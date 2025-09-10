document.addEventListener("DOMContentLoaded", function () {
  const severityButtons = document.querySelectorAll(".severity-btn");
  const fotoProblemaInput = document.getElementById("fotoProblema");
  const previewFoto = document.getElementById("previewFoto");
  const form = document.querySelector("form"); // Seleciona o formulário

  let selectedSeverity = ""; // Variável para armazenar o nível de gravidade selecionado

  severityButtons.forEach((button) => {
    button.addEventListener("click", function () {
      severityButtons.forEach((btn) => btn.classList.remove("selected"));
      this.classList.add("selected");
      selectedSeverity = this.dataset.severity; // Armazena o valor da gravidade
    });
  });

  fotoProblemaInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewFoto.src = e.target.result;
        previewFoto.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      previewFoto.src = "#";
      previewFoto.style.display = "none";
    }
  });

  // Adiciona o event listener para o submit do formulário
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const formData = {
      nomeLoja: document.getElementById("nomeLoja").value,
      localizacaoLoja: document.getElementById("localizacaoLoja").value,
      descricaoProblema: document.getElementById("descricaoProblema").value,
      nivelGravidade: selectedSeverity, // Usa o valor da gravidade selecionada
      contato: document.getElementById("contato").value,
      // A foto do problema é mais complexa para enviar via JSON diretamente.
      // Se precisar enviar a foto, considere usar FormData e um endpoint que aceite multipart/form-data.
      // Por simplicidade, este exemplo não inclui o envio da foto.
    };

    // Envia os dados para o Webhook do n8n
    fetch("https://n8n.srv882894.hstgr.cloud/webhook-test/4e33cb60-b7cc-4a49-bead-ce3cb2cbb0ef", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Sucesso:", data);
        alert("Solicitação enviada com sucesso!");
        form.reset(); // Limpa o formulário após o envio
        previewFoto.style.display = "none";
        severityButtons.forEach((btn) => btn.classList.remove("selected"));
        selectedSeverity = "";
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert("Ocorreu um erro ao enviar a solicitação.");
      });
  });
});
