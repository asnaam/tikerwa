const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const puppeteer = require('puppeteer-core');  // pastikan puppeteer-core diimport

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: '/path/to/your/chromium',  // Tentukan path ke Chromium jika perlu
        args: ['--no-sandbox', '--disable-setuid-sandbox']  // Menambahkan opsi --no-sandbox
    }
});

client.on('qr', (qr) => {
    console.log('Scan QR ini untuk login:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot WhatsApp sudah aktif sebagai BOT STIKER PERINTAH! ✅');
});

client.on('message', async (msg) => {
    console.log(`Pesan masuk dari ${msg.from}: ${msg.body}`);

    // Kalau pesan mulai dari ".stiker"
    if (msg.body.toLowerCase() === '.stiker') {
        let mediaMessage;

        // Cek apakah user reply media
        if (msg.hasQuotedMsg) {
            const quotedMsg = await msg.getQuotedMessage();
            if (quotedMsg.hasMedia) {
                mediaMessage = quotedMsg;
            }
        } 
        // Kalau user langsung kirim media + caption ".stiker"
        else if (msg.hasMedia) {
            mediaMessage = msg;
        }

        // Kalau ketemu media (baik dari reply atau dari kiriman langsung)
        if (mediaMessage) {
            const media = await mediaMessage.downloadMedia();
            
            await client.sendMessage(msg.from, media, {
                sendMediaAsSticker: true,
                stickerAuthor: 'Mayugoro', // Ini untuk nambah Author di stiker
                stickerName: 'Mayugoro Stickers'
            });

            console.log('Sticker berhasil dikirim dengan author Mayugoro ✅');
        } else {
            // Kalau gak ada media
            await msg.reply('⚠️ Kirim gambar atau reply gambar dulu sebelum ketik .stiker');
        }
    }
});

client.initialize();
