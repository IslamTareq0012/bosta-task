const axios = require('axios').default;
const MailUtils = require('../mailUtils');
const { performance } = require('perf_hooks');


const RequestsRecords = require('../../models/poolRequestModel');

class poolingProcess {
    constructor(check, requestURL, axiosConfig, req) {


        //Observers for notifications 
        this.observers = [];

        this.check = check;
        this.i = 0;
        this.loop_length = 50;
        this.loop_speed = 10000;
        this.handler = setInterval(this.loopPooling.bind(this), this.loop_speed);
        this.requestURL = requestURL
        this.axiosConfig = axiosConfig
        this.req = req
    }


    subscribe(fn) {
        this.observers.push(fn)
    }


    unsubscribe(fnToRemove) {
        this.observers = this.observers.filter(fn => {
            if (fn != fnToRemove)
                return fn
        })
    }

    fire(check,notifyData, thisObj) {
        this.observers.forEach(fn => {
            console.log(fn);
            fn.call(thisObj,check,notifyData)
        })
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


    loopPooling() {
        this.i += 1;
        this.runPooling(this.requestURL, this.axiosConfig, this.req);
        if (this.i === this.loop_length) clearInterval(this.handler);
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



                //Run observers
                this.fire(this.check , {
                    isUP: false,
                    user: req.user,
                    requestURL: requestURL
                },this)
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
                });
                //Run observers
                this.fire(this.check , {
                    isUP: true,
                    user: req.user,
                    requestURL: requestURL
                },this)
            }
        }.bind(this)).catch(err => {
        });

    }

    checkIsDown(data) {
        return data.status != this.check.assertCode && (this.check.assertCode != "" && this.check.assertCode);
    }
}

module.exports = poolingProcess;