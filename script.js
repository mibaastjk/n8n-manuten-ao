document.addEventListener('DOMContentLoaded', function() {
    const severityButtons = document.querySelectorAll('.severity-btn');
    const fotoProblemaInput = document.getElementById('fotoProblema');
    const previewFoto = document.getElementById('previewFoto');

    severityButtons.forEach(button => {
        button.addEventListener('click', function() {
            severityButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
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
});

