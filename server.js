const express = require('express');
const path = require('path');
const fs = require('fs');
const expressLayouts = require('express-ejs-layouts');
const { exec } = require('child_process');
const axios = require('axios');

const app = express();
const port = 3000;

const data = JSON.parse(fs.readFileSync('./data/vulnerabilidades.json', 'utf-8'));

// Configurações do Express e Layout
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware para definir variáveis padrão do layout
app.use((req, res, next) => {
    res.locals.style = '';
    res.locals.script = '';
    next();
});

// Rotas da página inicial
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Home',
    style: '',
    script: '<script src="/js/home.js"></script>'
  });
});

app.get('/index', (req, res) => {
  res.render('index', { 
    title: 'Home',
    style: '',
    script: '<script src="/js/home.js"></script>'
  });
});

// Dados de exemplo com mais detalhes
const vulnerabilidades = [
    { 
        id: 1, 
        nome: 'SQL Injection', 
        cvss: 9.8,
        descricao: 'Vulnerabilidade que permite injeção de comandos SQL',
        impacto: 'Alto',
        mitigacao: 'Usar prepared statements e validar entradas'
    },
    { 
        id: 2, 
        nome: 'Cross-Site Scripting (XSS)', 
        cvss: 8.5,
        descricao: 'Vulnerabilidade que permite a injeção de scripts em páginas web',
        impacto: 'Médio',
        mitigacao: 'Validar e codificar saídas'
    },
    { 
        id: 3, 
        nome: 'Buffer Overflow', 
        cvss: 9.3,
        descricao: 'Vulnerabilidade que permite a escrita além dos limites de um buffer',
        impacto: 'Alto',
        mitigacao: 'Usar funções seguras e validar tamanhos'
    }
];

// Lista de vulnerabilidades
app.get('/vulnerabilidades', (req, res) => {
  res.render('vulnerabilidades', { 
    title: 'Vulnerabilidades',
    vulnerabilidades
  });
});

// Detalhes de uma vulnerabilidade
app.get('/vulnerabilidade/:id', (req, res) => {
  const vuln = vulnerabilidades.find(v => v.id === parseInt(req.params.id));
  if (!vuln) {
    res.status(404).send('Vulnerabilidade não encontrada');
  } else {
    res.render('vulnerabilidade', { vulnerabilidade: vuln });
  }
});

// Página de ferramentas
app.get('/ferramentas', (req, res) => {
  res.render('ferramentas', { title: 'Ferramentas' });
});

// Simulação de comandos Kali
const comandosKali = {
    'ls': 'Desktop  Documents  Downloads  Music  Pictures  Videos',
    'pwd': '/home/kali',
    'whoami': 'kali',
    'ifconfig': 'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255',
    'help': 'Comandos disponíveis:\nls\npwd\nwhoami\nifconfig\nhelp'
};

app.post('/terminal/comando', express.json(), (req, res) => {
    const comando = req.body.comando.trim();
    const resultado = comandosKali[comando] || `Comando não encontrado: ${comando}`;
    res.json({ resultado });
});

// Configuração das ferramentas permitidas
const ferramentasPermitidas = {
    nmap: {
        comando: 'nmap',
        validarArgs: (args) => /^[0-9./\- ]+$/.test(args)
    },
    dirb: {
        comando: 'dirb',
        validarArgs: (args) => /^https?:\/\/[\w-]+(\.[\w-]+)+[/#?]?[\w-./?%&=]*$/.test(args)
    },
    sqlmap: {
        comando: 'sqlmap',
        validarArgs: (args) => /^--url=https?:\/\/[\w-]+(\.[\w-]+)+[/#?]?[\w-./?%&=]*$/.test(args)
    },
    hydra: {
        comando: 'hydra',
        validarArgs: (args) => /^-l\s+\w+\s+-P\s+[\w./]+\s+[\w.-]+\s+\w+$/.test(args)
    },
    gobuster: {
        comando: 'gobuster',
        validarArgs: (args) => /^dir\s+-u\s+https?:\/\/[\w-]+(\.[\w-]+)+\s+-w\s+[\w./]+$/.test(args)
    }
};

app.post('/executar-ferramenta', express.json(), (req, res) => {
    const { ferramenta, argumentos } = req.body;
    
    if (!ferramentasPermitidas[ferramenta]) {
        return res.status(400).json({ erro: 'Ferramenta não permitida' });
    }

    if (!ferramentasPermitidas[ferramenta].validarArgs(argumentos)) {
        return res.status(400).json({ erro: 'Argumentos inválidos' });
    }

    const comando = `${ferramentasPermitidas[ferramenta].comando} ${argumentos}`;
    
    exec(comando, (error, stdout, stderr) => {
        res.json({
            resultado: stdout || stderr,
            erro: error ? error.message : null
        });
    });
});

// Configurar instância do axios com timeout
const axiosInstance = axios.create({
    timeout: 5000,
    headers: {
        'User-Agent': 'CyberSecurity-Site/1.0'
    }
});

// Rota para buscar CVEs
app.get('/api/cve/:id', async (req, res) => {
    try {
        const response = await axios.get(`https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${req.params.id}`, {
            headers: {
                'User-Agent': 'CybersecurityPortal/1.0'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar CVE' });
    }
});

// Rota para pesquisa de CVEs
app.get('/api/search-cves', async (req, res) => {
    try {
        const { keyword, startIndex = 0 } = req.query;
        const response = await axios.get(
            `https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${keyword}&startIndex=${startIndex}`, {
            headers: {
                'User-Agent': 'CybersecurityPortal/1.0'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Erro na pesquisa de CVEs' });
    }
});

// Rota para página de scanner
app.get('/scanner', (req, res) => {
    res.render('scanner', { 
        title: 'Scanner',
        style: '',
        script: '<script src="/js/scanner.js"></script>'
    });
});

// Rota para buscar CVEs por CPE completo
app.get('/api/cve/cpe/:cpe', async (req, res) => {
    try {
        const response = await axios.get(`https://services.nvd.nist.gov/rest/json/cves/2.0?cpeName=${encodeURIComponent(req.params.cpe)}`, {
            headers: {
                'User-Agent': 'CybersecurityPortal/1.0'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar CVEs por CPE' });
    }
});

// Rota para buscar CVEs por CPE parcial
app.get('/api/cve/cpe/partial/:cpe', async (req, res) => {
    try {
        const response = await axios.get(`https://services.nvd.nist.gov/rest/json/cves/2.0?cpeName=${encodeURIComponent(req.params.cpe)}:*:*:*:*:*:*:*`, {
            headers: {
                'User-Agent': 'CybersecurityPortal/1.0'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar CVEs por CPE parcial' });
    }
});

// Rota para página Nmap Online
app.get('/nmap-online', (req, res) => {
    res.render('nmap-online', { title: 'Nmap Online Scanner' });
});

// API para executar Nmap
app.post('/api/nmap-scan', express.json(), async (req, res) => {
    const { target, scanType } = req.body;
    
    // Validar entrada
    if (!/^[a-zA-Z0-9.-]+$/.test(target)) {
        return res.status(400).json({ erro: 'Alvo inválido' });
    }
    
    // Lista de opções permitidas
    const opcoesPermitidas = ['-sV', '-sS', '-A', '-T4 -p-'];
    if (!opcoesPermitidas.includes(scanType)) {
        return res.status(400).json({ erro: 'Tipo de scan inválido' });
    }
    
    try {
        const comando = `nmap ${scanType} ${target}`;
        exec(comando, (error, stdout, stderr) => {
            if (error) {
                res.json({ erro: 'Erro ao executar nmap' });
            } else {
                res.json({ resultado: stdout });
            }
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

const VIRUSTOTAL_API_KEY = 'SUA_API_KEY_AQUI';

app.post('/api/scan-url', express.json(), async (req, res) => {
    try {
        const { url } = req.body;
        
        // Enviar URL para scan
        const scanResponse = await axios.post('https://www.virustotal.com/vtapi/v2/url/scan', null, {
            params: {
                apikey: VIRUSTOTAL_API_KEY,
                url: url
            }
        });

        // Aguardar 15 segundos para obter o resultado
        await new Promise(resolve => setTimeout(resolve, 15000));

        // Obter resultado da análise
        const resultResponse = await axios.get('https://www.virustotal.com/vtapi/v2/url/report', {
            params: {
                apikey: VIRUSTOTAL_API_KEY,
                resource: url
            }
        });

        res.json(resultResponse.data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao analisar URL' });
    }
});

// Configuração para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota catch-all para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
