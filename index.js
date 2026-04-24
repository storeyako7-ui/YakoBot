console.log('Starting YakoBot...')
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const qrcode = require('qrcode-terminal')

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth')
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false // Lo imprimimos nosotros
    })

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update
        
        if(qr) {
            console.log('==== ESCANEA ESTE QR CON WHATSAPP ====')
            qrcode.generate(qr, {small: true})
            console.log('=====================================')
        }
        
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('Conexion cerrada. Reconectando:', shouldReconnect)
            if(shouldReconnect) startBot()
        } 
        else if(connection === 'open') {
            console.log('✅ YakoBot conectado a WhatsApp')
        }
    })

    sock.ev.on('creds.update', saveCreds)
}

startBot()
