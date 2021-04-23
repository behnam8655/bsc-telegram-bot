const axios = require("axios");
const { db, bot } = require("../commons/commons")
const config = require("../commons/config.json")
const { decodeConstructorArgs } = require("canoe-solidity");

const updatePrices = async () => {
    db.collection("alerts").get().then((snapshot) => {
        snapshot.docs.map(async (tokenDoc) => {
            const price = await getPrice(tokenDoc.id);
            db.collection("alerts").doc(tokenDoc.id).collection("subbedUsers").get().then((snapshot) => {
                snapshot.docs.map((user) => {
                    const u = user.data()
                    if (u.targetAbove < price && !u.triggeredAbove) {
                        db.collection("alerts").doc(tokenDoc.id).collection("subbedUsers").doc(user.id).update({ triggeredAbove: true })
                        bot.telegram.sendMessage(
                            user.id, `ALERT: il prezzo di ${u.alias ? u.alias : tokenDoc.id} è ${price}`)
                    } else if (!u.triggeredAbove) {
                        db.collection("alerts").doc(tokenDoc.id).collection("subbedUsers").doc(user.id).update({ triggeredAbove: false })
                    }
                    if (u.targetBelow > price && !u.triggeredBelow) {
                        db.collection("alerts").doc(tokenDoc.id).collection("subbedUsers").doc(user.id).update({ triggeredBelow: true })
                        bot.telegram.sendMessage(
                            user.id, `ALERT: il prezzo di ${u.alias ? u.alias : tokenDoc.id} è ${price}`)
                    } else if (!u.triggeredBelow) {
                        db.collection("alerts").doc(tokenDoc.id).collection("subbedUsers").doc(user.id).update({ triggeredBelow: false })
                    }
                });
            });
        });
    })
};

const getPrice = async (tokenAddress) => {
    const latestTxs = await getLatestTxsFromToken(tokenAddress);
    for (let i = 0; i < latestTxs.length; i++) {
        const price = await getPriceFromTx(latestTxs[i].hash);
        if (price) {
            // console.log("at: " + new Date(latestTxs[i].timeStamp * 1000)
            // .toLocaleTimeString());
            return price;
        }
    }
    throw new Error;
};

const getPriceFromTx = async (txID) => {
    const { data } = await axios.get(config.bscApiBaseUrl +
        `module=proxy&action=eth_getTransactionByHash&txhash=${txID}`);
    try {

        if (!config.rightFunctions.includes(data.result.input.slice(0, 10))) return;
        const decodedInput =
            decodeConstructorArgs(config.abi, data.result.input.slice(10));

        const bnbInput = parseInt(data.result.value, 16);
        const tokenOut = parseInt(decodedInput.find(
            (e) => e.name == "amountOut").data);
        const tokenPriceInBnb = (bnbInput / tokenOut) * 0.9925;
        // console.log(`BNB value of token: ${tokenPriceInBnb}`);
        return tokenPriceInBnb;
    } catch (e) { return }
};

const getLatestTxsFromToken = async (tokenAddress) => {
    const { data } = await axios.get(config.bscApiBaseUrl +
        `module=account&action=tokentx&contractaddress=${tokenAddress}&page=1&offset=100&sort=desc`);
    return data.result;
};

module.exports = {
    updatePrices
}