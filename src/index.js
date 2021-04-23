const express = require('express');
require("./bot/bot")
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const { bot } = require("./commons/commons")
const config = require("./commons/config.json");
const { updatePrices } = require("./libs/prices")

app.post("/", async (req, res) => {
    console.log("received: " + req.body.message.text + " from " + req.body.message.chat.first_name + " " + req.body.message.chat.username)
    await bot.handleUpdate(req.body, res).catch(
        () => res.status(500).send()
    )
});

// const rthw = `/bot${config.telegramToken}`;
// app.post(rthw, async (req, res) => {
//     console.log("req.body")
//     await bot.handleUpdate(req.body, res).catch(
//         () => res.status(500).send()
//     )
// });

setInterval(() => {
    updatePrices()
}, 15000)

app.listen(config.port, () => {
    console.log(`Local server running on port ${config.port}`);
})
