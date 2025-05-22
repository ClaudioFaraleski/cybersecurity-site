# Portal de Cybersegurança

Um portal web interativo para análise de vulnerabilidades e ferramentas de segurança.

## 🚀 Funcionalidades

### 1. Scanner de Vulnerabilidades
- Nmap Scanner para análise de portas e serviços
- Gobuster para enumeração de diretórios
- Análise de sites com VirusTotal
- Scanner personalizado para testes específicos

### 2. Base de Dados de Vulnerabilidades
- Busca de CVEs
- Pesquisa por CPE
- Detalhes completos de vulnerabilidades
- Exemplos práticos de exploração

### 3. Ferramentas Integradas
- SQL Injection Tester
- XSS Scanner
- Directory Traversal
- Command Injection

## 📋 Pré-requisitos

```bash
node.js v14+
npm
nmap
gobuster
```

## 🔧 Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/cybersecurity-site.git
```

2. Instale as dependências
```bash
cd cybersecurity-site
npm install
```

3. Configure as variáveis de ambiente
```bash
VIRUSTOTAL_API_KEY=sua_chave_aqui
PORT=3000
```

4. Inicie o servidor
```bash
npm start
```

## 🛠️ Estrutura do Projeto

```
cybersecurity-site/
│
├── public/
│   ├── js/
│   │   ├── scanner.js
│   │   ├── vulnerabilidades.js
│   │   └── nmap-online.js
│   │
│   ├── style.css
│   └── images/
│
├── views/
│   ├── layout.ejs
│   ├── index.ejs
│   ├── vulnerabilidades.ejs
│   ├── scanner.ejs
│   └── ferramentas.ejs
│
├── server.js
└── package.json
```

## 📦 APIs Utilizadas

- **VirusTotal API**: Análise de URLs maliciosas
- **NVD API**: Base de dados de vulnerabilidades
- **CVE API**: Informações sobre CVEs

## 🔍 Funcionalidades Detalhadas

### Scanner de Vulnerabilidades
```bash
# Exemplo de uso do Nmap
nmap -sV -T4 exemplo.com

# Exemplo de Gobuster
gobuster dir -u http://exemplo.com -w wordlist.txt
```

### Busca de CVEs
- Pesquisa por ID: CVE-2021-44228
- Pesquisa por CPE: cpe:2.3:o:microsoft:windows_10
- Filtros por severidade CVSS

## 🔒 Segurança

- Validação de entrada
- Sanitização de dados
- Rate limiting
- Proteção contra ataques comuns



## ✒️ Autores

* **Claudio Faraleski Junior** - *Desenvolvedor Principal*

## 🎁 Agradecimentos

* Comunidade de Cybersegurança
* Contribuidores do projeto
* Ferramentas open source utilizadas

---
⌨️ com ❤️ por [Claudiofaraleski](https://github.com/claudiofaraleski)
