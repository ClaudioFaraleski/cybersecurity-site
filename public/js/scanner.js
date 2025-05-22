async function iniciarScan() {
    const target = document.getElementById('target').value;
    const scanType = document.getElementById('scanType').value;
    const resultado = document.getElementById('resultado');
    
    resultado.innerHTML = '<div class="loading">Executando scan...</div>';
    
    try {
        const response = await fetch('/api/scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ target, scanType })
        });
        
        const data = await response.json();
        resultado.innerHTML = `<pre>${data.resultado}</pre>`;
    } catch (error) {
        resultado.innerHTML = '<div class="error">Erro ao executar scan</div>';
    }
}

async function executarNmap() {
    const target = document.getElementById('nmapTarget').value;
    const type = document.getElementById('nmapType').value;
    await executarFerramenta('nmap', `${type} ${target}`);
}

async function executarGobuster() {
    const target = document.getElementById('gobusterTarget').value;
    const wordlist = document.getElementById('gobusterWordlist').value;
    await executarFerramenta('gobuster', `dir -u ${target} -w ${wordlist}`);
}

async function executarNikto() {
    const target = document.getElementById('niktoTarget').value;
    await executarFerramenta('nikto', `-host ${target}`);
}

async function executarFerramenta(ferramenta, argumentos) {
    const resultDiv = document.querySelector('.result-output');
    resultDiv.textContent = 'Executando...';
    
    try {
        const response = await fetch('/executar-ferramenta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ferramenta, argumentos })
        });
        
        const data = await response.json();
        resultDiv.textContent = data.erro || data.resultado;
    } catch (error) {
        resultDiv.textContent = 'Erro ao executar ferramenta';
    }
}
