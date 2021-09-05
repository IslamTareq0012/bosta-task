const axios = require('axios').default;

module.exports = function (check,notifyData) { 
    axios.post(check.webhook, {
        url: notifyData.requestURL,
        isup: notifyData.isUP
    }).then(x => {
    }).catch(err => {
        console.log("axios error !", err);
    })
};