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

    const formData = new FormData(); // Cria um objeto FormData

    // Adiciona os campos de texto ao FormData
    formData.append("nomeLoja", document.getElementById("nomeLoja").value);
    formData.append("localizacaoLoja", document.getElementById("localizacaoLoja").value);
    formData.append("descricaoProblema", document.getElementById("descricaoProblema").value);
    formData.append("nivelGravidade", selectedSeverity);
    formData.append("contato", document.getElementById("contato").value);

    // Adiciona o arquivo da foto, se houver
    if (fotoProblemaInput.files.length > 0) {
      formData.append("fotoProblema", fotoProblemaInput.files[0]);
    }

    // Envia os dados para o Webhook do n8n usando FormData
    fetch("https://n8n.srv882894.hstgr.cloud/webhook-test/4e33cb60-b7cc-4a49-bead-ce3cb2cbb0ef", {
      method: "POST",
      body: formData, // Não defina Content-Type para FormData, o navegador faz isso automaticamente
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Sucesso:", data);
        alert("Solicitação enviada com sucesso!");
        form.reset(); // Limpa o formulário após o envio
        previewFoto.src = "#";
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
