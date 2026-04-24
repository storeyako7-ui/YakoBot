console.log('Iniciando YakoBot...')
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const qrcode = require('qrcode-terminal')

async function conectarBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info')
    
    const sock = makeWASocket({
        auth: state,
        browser: ['YakoBot', 'Chrome', '1.0.0']
    })

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update
        
        if(qr) {
            console.log('==== ESCANEA ESTE QR CON WHATSAPP ====')
            qrcode.generate(qr, {small: true})
            console.log('=====================================')
        }
        
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
