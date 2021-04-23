const { db, bot } = require("../commons/commons")

const setPriceAlert = (token, triggerType, priceTarget, userId, alias) => {
    let data = {};
    if (triggerType == "above") {
        data = { targetAbove: parseFloat(priceTarget), triggeredAbove: false };
    }
    if (triggerType == "below") {
        data = { targetBelow: parseFloat(priceTarget), triggeredBelow: false };
    }
    db.collection("alerts").doc(token).collection("subbedUsers").doc(userId.toString()).set({
        ...data,
        "alias": alias,
    }, { merge: true })
}


const removePriceAlert = (token, userId) => {
    db.collection("alerts").doc(token).collection("subbedUsers").doc(userId.toString()).delete()
}

const viewAlerts = (userId) => {
    db.collection("alerts").get().then((snapshot) => {
        snapshot.docs.map(async (tokenDoc) => {
            console.log(userId)
            db.collection("alerts").doc(tokenDoc.id).collection("subbedUsers").get().then((snapshot) => {
                snapshot.docs.map((user) => {
                    console.log(user.id)
                    if (user.id != userId) return;
                    const data = user.data();
                    bot.telegram.sendMessage(userId, alias + " " + tokenDoc.id)
                    if (data.targetAbove)
                        bot.telegram.sendMessage(userId, `Alert above ${data.alertAbove}`)
                    if (data.targetBelow)
                        bot.telegram.sendMessage(userId, `Alert below ${data.targetBelow}`)
                });
            });
        });
    })
}

module.exports = {
    setPriceAlert,
    removePriceAlert,
    viewAlerts,
}