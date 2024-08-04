# IoT Bridge WhatsApp Web

Script untuk menghubungkan mikrokontroler melalui protokol MQTT ke WhatsApp Web

Deskripsi
Proyek ini adalah aplikasi Node.js yang menggunakan beberapa skrip untuk berbagai fungsi. Skrip utama adalah index.js yang menginisialisasi dan menjalankan aplikasi. Ada juga skrip get-id.js yang digunakan untuk mendapatkan ID dari sumber tertentu. File konfigurasi pengaturan.json digunakan untuk menyimpan pengaturan aplikasi.

## Pengaturan

1. **Menyesuaikan `pengaturan.json`**
   File `pengaturan.json` berisi pengaturan penting yang perlu disesuaikan sebelum menjalankan aplikasi. Contohnya adalah pengaturan nomor telepon tujuan, nomor bot, dan detail broker MQTT. Berikut adalah contoh isi `pengaturan.json`:

   ```json
   {
     "nomor_tujuan": "nomor tujuan jadwal",
     "nomor_bot": "nomor bot",
     "mqtt_broker": "mqtt://broker.emqx.io",
     "mqtt_username": "emqx",
     "mqtt_password": "public",
     "jam": 15,
     "menit": 39,
     "detik": 0
   }
   ```

## Penjelasan

    nomor_tujuan: Nomor telepon tujuan pengiriman pesan dalam jadwal. Contoh: "628xxxxxx".
    nomor_bot: Nomor telepon yang digunakan oleh bot. Contoh: "628xxxxxx".
    mqtt_broker: Alamat broker MQTT yang digunakan. Contoh: "mqtt://your-mqtt-broker-address".
    mqtt_username: Username untuk autentikasi ke broker MQTT. Contoh: "your_username".
    mqtt_password: Password untuk autentikasi ke broker MQTT. Contoh: "your_password".
    jam: Jam yang ditentukan untuk jadwal. Contoh: 15.
    menit: Menit yang ditentukan untuk jadwal. Contoh: 39.
    detik: Detik yang ditentukan untuk jadwal. Contoh: 0.

2. Instalasi Dependensi
   - Gunakan NodeJS
   - Copy code/Clone repo ini
   - npm install
3. Menjalankan Aplikasi
   Setelah mengatur pengaturan.json dan menginstal semua dependensi, kamu bisa menjalankan aplikasi dengan perintah berikut:
   Copy code
   node index.js
   Aplikasi akan berjalan dan menggunakan pengaturan yang telah kamu tentukan di pengaturan.json.
   dan scan kode QR untuk login

4. Struktur Proyek
        get-id.js: Skrip untuk mendapatkan ID dari sumber tertentu.
        index.js: Entry point utama yang menginisialisasi dan menjalankan aplikasi.
        package.json: File konfigurasi yang berisi metadata proyek dan daftar dependensi.
        package-lock.json: File yang memastikan instalasi proyek di masa depan dapat direproduksi secara konsisten.
        pengaturan.json: File konfigurasi untuk menyimpan pengaturan aplikasi.

## Kontribusi
Jika kamu ingin berkontribusi pada proyek ini, silakan buat pull request atau hubungi kami untuk informasi lebih lanjut.
