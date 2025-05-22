document.querySelectorAll('.tool-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const ferramenta = form.dataset.tool;
        const inputs = form.querySelectorAll('input, select');
        let argumentos = '';

        switch(ferramenta) {
            case 'nmap':
                argumentos = inputs[0].value;
                break;
            case 'dirb':
                argumentos = inputs[0].value;
                break;
            case 'sqlmap':
                argumentos = `--url=${inputs[0].value}`;
                break;
            case 'hydra':
                argumentos = `-l ${inputs[0].value} -P ${inputs[1].value} ${inputs[2].value} ${inputs[3].value}`;
                break;
            case 'gobuster':
                argumentos = `dir -u ${inputs[0].value} -w ${inputs[1].value}`;
                break;
        }

        try {
            const response = await fetch('/executar-ferramenta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ferramenta, argumentos })
            });
            const data = await response.json();
            
            document.getElementById('resultado').innerHTML = `
                <pre>${data.erro || data.resultado}</pre>
            `;
        } catch (error) {
            document.getElementById('resultado').innerHTML = `
                <pre class="erro">Erro ao executar ferramenta: ${error.message}</pre>
            `;
        }
    });
});
