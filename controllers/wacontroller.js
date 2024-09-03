const { Client, LocalAuth } = require('whatsapp-web.js');

const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

const api = async (req,res) => {
    const user_token = 'r03nGkadZ';
    const token = req.query.token || req.body.token;
    let nohp = req.query.nohp || req.body.nohp;
    const pesan = req.query.pesan || req.body.pesan;

    if (token !== user_token) {
        return res
            .status(401)
            .json({status: 'Gagal', pesan: 'Token tidak valid'});
    }

    try {
        if (nohp.startsWith('0')) {
            nohp = '62' + nohp.slice(1) + '@c.us';
        } else if (nohp.startsWith('+')) {
            nohp = nohp.slice(1) + '@c.us';
        } else {
            nohp = nohp + '@c.us';
        }

        const user = await client.isRegisteredUser(nohp);
    
        if (user) {
            client.sendMessage(nohp, pesan);
            res.json({status: 'Berhasil terkirim!', pesan})
        }
        else {
            res.json({status: 'Gagal Terkirim.', pesan: 'Nomor tidak terdaftar'})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({status: 'Error.', pesan : 'Error server.'})
    }
};

module.exports = api;