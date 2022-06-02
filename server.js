const qrcode = require('qrcode-terminal');
const axios = require('axios');

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async message => {
    const content = message.body
    const kalimat1=content.split(' ')[0];

    if (content === 'pls meme') {
        const meme = await axios.get('https://meme-api.herokuapp.com/gimme')
            .then(res => res.data)

        client.sendMessage(message.from, await MessageMedia.fromUrl(meme.url))

    } else if (content === 'test') {
        //const media = MessageMedia.fromFilePath('./path/iphone.jpg');
        client.sendMessage(message.from, 'test');

        //client.sendMessage(message.from, 'test'+message.from);
    } else if (kalimat1 === '!insertDataTps') {
        const created_by=message.from.split('@')[0];

        let data={
            no_tps:content.split(' ')[1],
            no_urut:content.split(' ')[2],
            jml_suara:content.split(' ')[3],
            created_by:created_by
        }

        axios.post('http://localhost:8085/api/data/insertdatautama', data)
            .then((response) => {
                if (response) {
                    client.sendMessage(message.from, 'Terima Kasih, Anda telah Berhasil menambahkan data Tps '+content.split(' ')[1] );
                }
            })
        .catch((err) => console.log(err))

    } else if (kalimat1 === '!updateTps') {


        let data={
            no_tps:content.split(' ')[1],
            jml_dtp:content.split(' ')[2],
            jml_rusak:content.split(' ')[3],
        }

        axios.patch('http://localhost:8085/api/data/updatedtp', data)
            .then((response) => {
                if (response) {
                    client.sendMessage(message.from, 'Terima Kasih, Anda telah Berhasil merubah data tps'+content.split(' ')[1]);
                }
            })
        .catch((err) => console.log(err))

    }
});

client.initialize();