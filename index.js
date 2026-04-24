console.log('Iniciando YakoBot...')
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys')

async function conectarBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info')
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true // ESTO SACA EL QR SIN LIBRERÍA
    })

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        
        if(connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('Conexión cerrada. Reconectar:', shouldReconnect)
            if(shouldReconnect) conectarBot()
        } 
        else if(connection === 'open') {
            console.log('✅ BOT CONECTADO A WHATSAPP')
        }
    })

    sock.ev.on('creds.update', saveCreds)
}

conectarBot()
