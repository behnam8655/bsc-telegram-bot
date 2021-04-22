//FIRESTRORE
const admin = require("firebase-admin");
const serviceAccount = require('../../bsc-alerts-bot-484f052e0c53.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

//BOT
const config = require("./config.json");
const { Telegraf } = require("telegraf");
const bot = new Telegraf(config.telegramToken, config.botOptions);

const areArgsValid = (args) => {
    let valid = true;
    args.forEach(a => {
        if (!a) valid = false;
    })
    return valid;
}

module.exports = {
    db,
    bot,
    areArgsValid
}
