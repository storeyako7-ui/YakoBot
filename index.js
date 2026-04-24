console.log('Starting YakoBot...')
let { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys')
let { Boom } = require('@hapi/boom')
let qrcode = require('qrcode-terminal')
let fs = require('fs')
let path = require('path')

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    })

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update
        if(qr) {
            console.log('Escanea este QR:')
            qrcode.generate(qr, {small: true})
        }
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('Conexion cerrada. Reconectando...', shouldReconnect)
            if(shouldReconnect) {
                connectToWhatsApp()
            }
        } else if(connection === 'open') {
            console.log('YakoBot conectado a WhatsApp ✅')
        }
    })

    sock.ev.on('creds.update', saveCreds)
}

connectToWhatsApp()
