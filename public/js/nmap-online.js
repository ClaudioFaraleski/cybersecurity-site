async function executarNmapOnline() {
    const target = document.getElementById('target').value;
    const scanType = document.getElementById('scanType').value;
    const statusDiv = document.querySelector('.scan-status');
    const outputDiv = document.querySelector('.output');
    
    if (!validarTarget(target)) {
        alert('Por favor, insira um alvo válido');
        return;
    }
    
    statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Executando scan...';
    outputDiv.textContent = '';
    
    try {
        const response = await fetch('/api/nmap-scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ target, scanType })
        });
        
        const data = await response.json();
        
        if (data.erro) {
            statusDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erro no scan';
            outputDiv.textContent = data.erro;
        } else {
            statusDiv.innerHTML = '<i class="fas fa-check-circle"></i> Scan completo';
            outputDiv.textContent = data.resultado;
        }
    } catch (error) {
        statusDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Erro na requisição';
        outputDiv.textContent = 'Erro ao executar o scan';
    }
}

function validarTarget(target) {
    // Validar IP ou domínio
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const dominioRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return ipRegex.test(target) || dominioRegex.test(target);
}
