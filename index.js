const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const mqtt = require('mqtt')  // require mqtt
const fs = require('fs');
// Baca file JSON
const data = fs.readFileSync('pengaturan.json', 'utf8');
const variables = JSON.parse(data);
// Mengimpor variabel dari file JSON
const client = mqtt.connect(variables.mqtt_broker)
let nomor_tujuan = variables.nomor_tujuan + "@c.us";
const nomor_bot = variables.nomor_bot;
var topic1 = "27ceac888c8c5cd05bdfd0ed598d197a";
var topic2 = "2f7b597ff4b6b593a9ff60450c4859c1";
var topic3 = "2782be171fa951d04bfa9a3366b9fc90";
var topic4 = "57b3cb8c25a896df10597295e446cb83";
var topic5 = "277d26ffaebc339311ee64ccaa6719b3";
var topic6 = "136c277600e031916b3f108fde2999d4";
var isFlag = false;
var isGroupRequest = false;
var reply = "";
var incomingMessages = "";
var pengirim = "";
var isChangeNumber = false;


const WaWebclient = new Client({
    authStrategy: new LocalAuth()
});

console.log('\nSedang Menghubungkan ke Whatsapp Web........\n');
WaWebclient.initialize();
mqttEvent();

WaWebclient.on('qr', qr => {
    console.log('Silahkan scan kode QR dibawah untuk login!\n');
    qrcode.generate(qr, { small: true });
});

WaWebclient.on('ready', () => {
    console.log('Terhubung!\n');
    WaWebclient.sendMessage(nomor_tujuan, "Terhubung");
});

WaWebclient.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

WaWebclient.on('auth_failure', msg => {
    console.error('AUTENTIKASI GAGAL', msg);
});

WaWebclient.on('message', async msg => {
    incomingMessages = msg.body.toLowerCase();
    let chat = await msg.getChat();
    pengirim = msg.from
    if (pengirim == nomor_tujuan) {
        console.log("Pengirim dikenali \n")
    }
    else {
        console.log("Pengirim tidak dikenali \n")
    }
    if (!chat.isGroup) {
        console.log("Pesan Pribadi :" + incomingMessages + "\n");
        if (incomingMessages.includes('periksa')) {
            client.publish(topic1, 'periksa')
            WaWebclient.sendMessage(pengirim, "Sedang memeriksa kondisi.....");
        }
        else if (incomingMessages.includes('jadwal')) {
            client.publish(topic2, 'jadwal')
            WaWebclient.sendMessage(pengirim, "Sedang memeriksa jadwal tersimpan.....");
        }
        else if (incomingMessages.includes('ubah waktu')) {
            client.publish(topic3, 'ubah_waktu')
            WaWebclient.sendMessage(pengirim, "Sedang memuat...........");
            isFlag = true;
            console.log("Kondisi Flag ubah waktu: " + isFlag + "\n");
        }
        else if (incomingMessages.includes('ubah nomor tujuan')) {
            WaWebclient.sendMessage(pengirim, "Silakan masukkan nomor tujuan baru dalam format internasional");
            isChangeNumber = true;
        } else if (isChangeNumber && incomingMessages.match(/^\d+$/)) {
            updateNomorTujuan(incomingMessages);
            WaWebclient.sendMessage(pengirim, "Nomor tujuan berhasil diubah menjadi: " + incomingMessages);
            nomor_tujuan = incomingMessages + "@c.us";
            isChangeNumber = false;
        }
        else if (incomingMessages.includes('cek nomor tujuan')) {
            let nomor_tujuan_bersih = nomor_tujuan.split('@')[0];
            WaWebclient.sendMessage(pengirim, "Nomor tujuan saat ini adalah: " + nomor_tujuan_bersih);
        }
        else if (incomingMessages.includes(':') && isFlag == true) {
            client.publish(topic4, incomingMessages)
            isFlag = false;
            console.log("Kondisi Flag ubah waktu: " + isFlag + "\n");
        }
        else {
            const result = "Gunakan perintah berikut \n - Periksa (Untuk mengecek Kondisi Lampu) \n - Jadwal (Untuk mengecek jadwal tersimpan) \n - Ubah waktu (Untuk mengatur jadwal pengecekan) \n - Ubah nomor tujuan (Untuk mengubah nomor tujuan pesan terjadwal)\n - Cek nomor tujuan (Untuk memeriksa nomor tujuan saat ini)";
            WaWebclient.sendMessage(pengirim, result);
            console.log("Kesalahan perintah!, mohon " + result + "\n");
        }
    }
});

WaWebclient.on('disconnected', (reason) => {
    console.log('Terputus Karena :', reason);
});

let rejectCalls = true;
WaWebclient.on('call', async (call) => {
    console.log('Panggilan masuk, menolak panggilan.', call);
    if (rejectCalls) await call.reject();
    await WaWebclient.sendMessage(call.from, `${call.fromMe ? 'Panggilan Keluar' : 'Panggilan Masuk'} dari ${call.from}, tipe panggilan ${call.isGroup ? 'grup' : ''} ${call.isVideo ? 'video' : 'suara'}. ${rejectCalls ? 'Panggilan ditolak otomatis oleh script.' : ''}`);
});

async function mqttEvent() {
    client.on('connect', function () {
        client.subscribe(topic5)
        client.subscribe(topic6)
    })

    client.on('reconnect', function () {
        console.log('MQTT Reconnect...')
        client.subscribe(topic5)
        client.subscribe(topic6)
    })

    client.on('message', async function (topic, message) {
        console.log(message.toString());
        console.log(topic);
        if (topic === topic6) {
            reply = message.toString();
            await WaWebclient.sendMessage(nomor_tujuan, reply);
        }
        else if (topic === topic5) {
            reply = message.toString();
            await WaWebclient.sendMessage(pengirim, reply);
        }
    });
}

function updateNomorTujuan(newNumber) {
    variables.nomor_tujuan = newNumber;
    fs.writeFileSync('pengaturan.json', JSON.stringify(variables, null, 2), 'utf8');
}