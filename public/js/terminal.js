document.addEventListener('DOMContentLoaded', () => {
    let commandBuffer = '';
    const term = new Terminal({
        cursorBlink: true,
        theme: {
            background: '#1E1E1E',
            foreground: '#00FF00'
        }
    });

    term.open(document.getElementById('terminal'));
    term.write('kali@cybersec:~$ ');

    async function processCommand(comando) {
        try {
            const response = await fetch('/terminal/comando', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ comando })
            });
            const data = await response.json();
            term.write('\r\n' + data.resultado);
            term.write('\r\nkali@cybersec:~$ ');
        } catch (error) {
            term.write('\r\nErro ao processar comando');
            term.write('\r\nkali@cybersec:~$ ');
        }
    }

    term.onKey(({ key, domEvent }) => {
        if (domEvent.keyCode === 13) { // Enter
            if (commandBuffer.trim()) {
                processCommand(commandBuffer);
            } else {
                term.write('\r\nkali@cybersec:~$ ');
            }
            commandBuffer = '';
        } else if (domEvent.keyCode === 8) { // Backspace
            if (commandBuffer.length > 0) {
                commandBuffer = commandBuffer.slice(0, -1);
                term.write('\b \b');
            }
        } else {
            commandBuffer += key;
            term.write(key);
        }
    });
});
