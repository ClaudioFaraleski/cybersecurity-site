async function buscarCVE() {
    const cveId = document.getElementById('cveSearch').value;
    const resultadoDiv = document.querySelector('.search-results');
    
    if (!resultadoDiv) {
        const div = document.createElement('div');
        div.className = 'search-results';
        document.querySelector('.search-section').appendChild(div);
    }
    
    try {
        const response = await fetch(`/api/cve/${cveId}`);
        const data = await response.json();
        
        if (data.vulnerabilities && data.vulnerabilities.length > 0) {
            const vuln = data.vulnerabilities[0].cve;
            const html = `
                <div class="vuln-card">
                    <h3>${vuln.id}</h3>
                    <p class="description">${vuln.descriptions[0].value}</p>
                    <div class="vuln-details">
                        <p><strong>Publicado:</strong> ${new Date(vuln.published).toLocaleDateString()}</p>
                        <p><strong>CVSS:</strong> ${vuln.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || 'N/A'}</p>
                        <p><strong>Severidade:</strong> 
                            <span class="severity ${getSeverityClass(vuln.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore)}">
                                ${getSeverityLevel(vuln.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore)}
                            </span>
                        </p>
                    </div>
                </div>
            `;
            resultadoDiv.innerHTML = html;
        } else {
            resultadoDiv.innerHTML = '<p class="error">CVE não encontrado</p>';
        }
    } catch (error) {
        resultadoDiv.innerHTML = '<p class="error">Erro ao buscar CVE</p>';
    }
}

async function buscarPorCPE() {
    const cpe = document.getElementById('cpeSearch').value;
    const resultadoDiv = document.querySelector('.search-results');
    
    try {
        const response = await fetch(`/api/cve/cpe/${encodeURIComponent(cpe)}`);
        const data = await response.json();
        mostrarResultadosCPE(data, resultadoDiv);
    } catch (error) {
        resultadoDiv.innerHTML = '<p class="error">Erro ao buscar CVEs por CPE</p>';
    }
}

async function buscarPorCPEParcial() {
    const cpe = document.getElementById('cpeSearch').value;
    const resultadoDiv = document.querySelector('.search-results');
    
    try {
        const response = await fetch(`/api/cve/cpe/partial/${encodeURIComponent(cpe)}`);
        const data = await response.json();
        mostrarResultadosCPE(data, resultadoDiv);
    } catch (error) {
        resultadoDiv.innerHTML = '<p class="error">Erro ao buscar CVEs por CPE parcial</p>';
    }
}

function mostrarResultadosCPE(data, resultadoDiv) {
    if (data.vulnerabilities && data.vulnerabilities.length > 0) {
        const html = data.vulnerabilities.map(vuln => `
            <div class="vuln-card">
                <h3>${vuln.cve.id}</h3>
                <p class="description">${vuln.cve.descriptions[0].value}</p>
                <div class="vuln-details">
                    <p><strong>Publicado:</strong> ${new Date(vuln.cve.published).toLocaleDateString()}</p>
                    <p><strong>CVSS:</strong> ${vuln.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || 'N/A'}</p>
                </div>
            </div>
        `).join('');
        resultadoDiv.innerHTML = html;
    } else {
        resultadoDiv.innerHTML = '<p class="info">Nenhuma vulnerabilidade encontrada para este CPE</p>';
    }
}

function getSeverityClass(score) {
    if (!score) return 'low';
    if (score >= 9.0) return 'critical';
    if (score >= 7.0) return 'high';
    if (score >= 4.0) return 'medium';
    return 'low';
}

function getSeverityLevel(score) {
    if (!score) return 'Baixo';
    if (score >= 9.0) return 'Crítico';
    if (score >= 7.0) return 'Alto';
    if (score >= 4.0) return 'Médio';
    return 'Baixo';
}

async function analisarUrl() {
    const url = document.getElementById('vtUrl').value;
    const resultDiv = document.getElementById('vtResult');
    
    resultDiv.innerHTML = '<div class="loading">Analisando site...</div>';
    
    try {
        const response = await fetch('/api/scan-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });
        
        const data = await response.json();
        
        const html = `
            <div class="vt-result-card">
                <h3>Resultado da Análise</h3>
                <p>Positivos: ${data.positives}/${data.total}</p>
                <p>Data da Análise: ${new Date(data.scan_date).toLocaleString()}</p>
                <div class="scan-details">
                    ${Object.entries(data.scans)
                        .map(([scanner, result]) => `
                            <div class="scan-item ${result.detected ? 'detected' : 'clean'}">
                                <strong>${scanner}:</strong> ${result.result || 'Limpo'}
                            </div>
                        `).join('')}
                </div>
            </div>
        `;
        
        resultDiv.innerHTML = html;
    } catch (error) {
        resultDiv.innerHTML = '<div class="error">Erro ao analisar URL</div>';
    }
}
