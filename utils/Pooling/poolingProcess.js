const axios = require('axios').default;
const MailUtils = require('../mailUtils');
const { performance } = require('perf_hooks');


const RequestsRecords = require('../../models/poolRequestModel');

class poolingProcess {
    constructor(check,requestURL, axiosConfig, req) {

        this.check = check;
        this.i = 0;
        this.loop_length = 50;
        this.loop_speed = 10000;
        this.handler = setInterval(this.loopPooling.bind(this), this.loop_speed);
        this.requestURL = requestURL
        this.axiosConfig = axiosConfig
        this.req = req
    }

    
    getData(requestURL, axiosConfig) {
        var client = axios.create(axiosConfig);
        return client.get(requestURL);
    }

    // create a promise that resolves after a short delay
    delayPromise(ms) {
        return new Promise(function (resolve) {
            setTimeout(resolve, ms);
        });
    }


    loopPooling(){
        this.i+= 1; 
        this.runPooling(this.requestURL, this.axiosConfig, this.req);
        if (this.i===this.loop_length) clearInterval(this.handler);
    }
    
// interval is how often to poll
// timeout is how long to poll waiting for a result (0 means try forever)

runPooling(requestURL, axiosConfig, req) {

    console.log("pooling ...");

    var time = performance.now();

    this.getData(requestURL, axiosConfig).then(function ({ data }) {
        var mailUtils = new MailUtils();

        if (!this.checkIsDown(data)) {

            //***********************CHECK POOL DOWN RECROD MUST SAVED HERE !!!************************* */

            var Request = RequestsRecords.create({
                check: this.check._id,
                isUp: false,
                DateTimeCreated: Date.now(),
                ResponseTime: (performance.now() - time) / 1000
            }).then(x => {

            }).catch(err => {
            });

            //Send Notification using webhook
            axios.post(this.check.webhook, {
                url: requestURL,
                isup: false
            }).then(x => {
            }).catch(err => {
                console.log("axios error !", err);
            })
            //Sending Notification Mail with check status 

            var mailOptions = {
                from: 'no-reply@BostaApp.com'
                , to: req.user.email
                , subject: 'Bosta check notification'
                , text: 'Hello,\n\n' + check.name + ' check is down by trying the url: ' + requestURL + '.\n'
            };

            mailUtils.sendMail(mailOptions);
            return this.delayPromise(this.check.interval).then(this.runPooling(requestURL, axiosConfig, req));

        } else {
            //***********************CHECK POOL UP RECROD MUST SAVED HERE !!!************************* */    

            var Request = RequestsRecords.create({
                check: this.check._id,
                isUp: true,
                DateTimeCreated: Date.now(),
                ResponseTime: (performance.now() - time) / 1000
            }).then(x => {

            }).catch(err => {
                console.log("saving errorrrrrrrrrrrrrrrr", err)
            });

            //Send Notification using webhook

            axios.post(this.check.webhook, {
                url: requestURL,
                isup: true
            })
                .then(function (response) {
                })
                .catch(function (error) {
                });
            //Sending Mail

            var mailOptions = {
                from: 'no-reply@BostaApp.com'
                , to: req.user.email
                , subject: 'Bosta check notification'
                , text: 'Hello,\n\n' + this.check.name + ' check is up by trying the url: ' + requestURL + '.\n'
            };
            var mailUtils = new MailUtils();
            mailUtils.sendMail(mailOptions);

            //Try After check interval
            // run again with a short delay
        }
    }.bind(this)).catch(err => {
        console.log("poooling errorrrrrr", err);
    });

}

checkIsDown(data) {
    return data.status != this.check.assertCode && (this.check.assertCode != "" && this.check.assertCode);
}

errorHandler() {
    throw new Error('timeout error on poll');
}
}

module.exports = poolingProcess;