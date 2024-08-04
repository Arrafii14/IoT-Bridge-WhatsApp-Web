const fs = require('fs');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const mqtt = require('mqtt');
const data = fs.readFileSync('pengaturan.json', 'utf8');
const variables = JSON.parse(data);


const options = {
    clean: true,
    connectTimeout: 5000,
    clientId: 'bridge_tcrm',
    username: variables.mqtt_username,
    password: variables.mqtt_password,
};

const MQTTclient = mqtt.connect(variables.mqtt_broker, options);
const nomor_tujuan = variables.nomor_tujuan;
const nomor_bot = variables.nomor_bot;
const id_group = variables.id_group;
var pengirim = "";
var periksa_semua = "tcrm/periksa/semua"; // Topic untuk memeriksa semua GI
var topic_group = "tcrm/status/grup";     // Topic untuk menerima status GI ( Group )
var topic_reply = "tcrm/status/balas";    // Topic untuk balasan langsung
var koneksi = "tcrm/koneksi";             // Topic untuk memeriksa koneksi
var periksa_jadwal = "tcrm/periksa/jadwal"; // Topic untuk memeriksa semua GI berdasarkan jadwal
var reply = "";
var incomingMessages = "";

const whatsapp = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true
    }
});

console.log('\nSedang Menghubungkan ke Whatsapp Web........\n');
whatsapp.initialize();


whatsapp.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

whatsapp.on('qr', qr => {
    console.log('Silahkan scan kode QR dibawah untuk login!\n');
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {
        small: true
    });
});

whatsapp.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

whatsapp.on('auth_failure', msg => {
    console.error('AUTENTIKASI GAGAL', msg);
});

whatsapp.on('ready', () => {
    console.log('READY');
    console.log('Terhubung!\n');
    whatsapp.sendMessage(nomor_tujuan, "Terhubung");
});

whatsapp.on('message', async msg => {
    incomingMessages = msg.body.toLowerCase();
    let chat = await msg.getChat();
    mentions = await msg.getMentions();
    pengirim = msg.from;

    if (!chat.isGroup) {
        console.log("Pesan Pribadi :" + incomingMessages + "\n");
        console.log(`Message received from ${msg.from}: ${msg.body}`);
        whatsapp.sendMessage(nomor_tujuan, "Pesan Pribadi :" + incomingMessages + "\n");
        whatsapp.sendMessage(nomor_tujuan, `Message received from ${msg.from}: ${msg.body}`);
    }

    else if (chat.isGroup) {
        console.log("Pesan Grup :" + incomingMessages + "\n");
        console.log(`Message received from ${msg.from}: ${msg.body}`);
        whatsapp.sendMessage(nomor_tujuan, "Pesan Pribadi :" + incomingMessages + "\n");
        whatsapp.sendMessage(nomor_tujuan, `Message received from ${msg.from}: ${msg.body}`);
    }
}); 