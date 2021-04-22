const { db } = require("../commons/commons")

const setPriceAlert = (token, triggerType, priceTarget, userId, alias) => {

    let data = {};
    if (triggerType == "above") {
        data = { targetAbove: parseInt(priceTarget), triggeredAbove: false };
    }
    if (triggerType == "below") {
        data = { targetBelow: parseInt(priceTarget), triggeredBelow: false };
    }
    db.collection("alerts").doc(token).collection("subbedUsers").doc(userId.toString()).set({
        ...data,
        "alias": alias,
    }, { merge: true })
    // db.collection("alerts").doc(token).set(
    //     {
    //         subbedUsers: [{
    //             "userChatId": userId,
    //             ...data,
    //             "alias": alias,
    //         }],
    //     },
    //     { merge: true, }
    // );
}


const removePriceAlert = (token, userId) => {
    db.collection("alerts").doc(token).collection("subbedUsers").doc(userId).delete()
}
module.exports = {
    setPriceAlert,
    removePriceAlert,
}