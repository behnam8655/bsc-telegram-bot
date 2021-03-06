const { bot, areArgsValid } = require("../commons/commons")
const { setPriceAlert, removePriceAlert, viewAlerts } = require("../libs/dbDriver")

// error handling
bot.catch((err, ctx) => {
    console.error("[Bot] Error", err);
    ctx.reply(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

// initialize the commands
bot.command("/start", (ctx) => ctx.reply("Eccoci qua"));
bot.command("/help", (ctx) => ctx.reply(`
  /setAlert <tokenContract> <above/below> <priceTarget> <alias>
  /deleteAlert <tokenContract>
  `));
bot.command("/u", (ctx) => updatePrices());
bot.command("/s", async (ctx) => {
    const token = ctx.message.text.split(" ")[1];
    const triggerType = ctx.message.text.split(" ")[2];
    const priceTarget = ctx.message.text.split(" ")[3];
    const alias = ctx.message.text.split(" ")[4] ?? "";
    if (!areArgsValid([token, triggerType, priceTarget, ctx.message.from.id])) throw new Error("invalid argumets")
    await setPriceAlert(token, triggerType, priceTarget, ctx.message.from.id, alias);
    ctx.reply("fatt")
});

bot.command("/deleteAlert", async (ctx) => {
    const token = ctx.message.text.split(" ")[1];
    removePriceAlert(token, ctx.message.from.id);
});

bot.command("/viewAlerts", async (ctx) => {
    viewAlerts(ctx.message.from.id);
});

bot.on("message", (ctx) => {
    ctx.reply(ctx.message.text ?? "no message found")
})

console.log("bot initialized...")