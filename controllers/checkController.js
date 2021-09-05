const Check = require('../models/checkModel');
const poolRequest = require('../models/poolRequestModel');

const base = require('./baseController');

const poolingProcess = require('../utils/Pooling/poolingProcess');

exports.createCheck = async (req, res, next) => {
    try {
        var check = await Check.create({
            name: req.body.name,
            url: req.body.url,
            protocol: req.body.protocol,
            path: req.body.path,
            Port: req.body.port,
            webhook: req.body.webhook,
            timeout: req.body.timeout,
            interval: req.body.interval,
            threshold: req.body.threshold,
            authentication: req.body.authentication,
            headers: req.body.headers,
            assertCode: req.body.assertCode,
            tags: req.body.tags,
            ignoreSSL: req.body.ignoreSSL,
            user: req.user.id
        });
        res.status(201).json({
            status: 'success',
            data: {
                check
            }
        });
    }
    catch (e) {
        console.log('Create Check error');
        next(e);
    }
}



exports.testPool = async (req, res, next) => {

    try {
        var checkCursor = await Check.find({ _id: req.query.id });
        var check = checkCursor[0];

        var checkHeaders = {};
        var requestURL = check.path == "" ? check.protocol + "://" + check.url + "/" + check.path : check.protocol + "://" + check.url


        for (let index = 0; index < check.headers.length; index++) {
            const element = check.headers[index];
            checkHeaders[check.headers[index].name] = check.headers[index].value;

        }
        if (check.authentication) {
            checkHeaders["Authorization"] = check.authentication.basicHeader;

        }

        //Configure AXIOS
        const axiosConfig = {
            timeout: check.timeout,
            headers: checkHeaders
        };
        var poolingMngr = new poolingProcess(check,requestURL, axiosConfig, req);
        poolingMngr.loopPooling();
        res.send("Pooling Just Started .... !");
    } catch (err) {
        next(err);
    }

}

//TODO :
//Enhancement : Use pipeline aggregation
exports.checksReport = async (req, res, next) => {

    if (!req.body.tags || req.body.tags.length == 0) {
        var result = {};
        let status = null;

        let TotalRequests = 0;

        let avarageReponseTime = 0;

        let totalNumberOfDownURLs = 0;
        let precentageNumberOfDownURLs = 0;


        let totalNumberOfUpURLs = 0;
        let precentageNumberOfUpURLs = 0;


        let downTimes = 0;
        let uptimes = 0;

        var checkCursor = await Check.findOne({ _id: req.body.id });


        var requestsCursor = await poolRequest.find({ check: req.body.id },{
            "_id": 0,
            "__v": 0,
          });
        status = requestsCursor[0].isUp ? "UP" : "Down";

        TotalRequests = requestsCursor.length;


        // Calculate Ups stats
        var UpRequests = requestsCursor.filter(x => x.isUp);
        totalNumberOfUpURLs = UpRequests.length;

        precentageNumberOfUpURLs = (totalNumberOfUpURLs * 100) / TotalRequests;


        // Calculate downs stats
        var DownRequests = requestsCursor.filter(x => !x.isUp);
        totalNumberOfDownURLs = DownRequests.length;
        precentageNumberOfDownURLs = (totalNumberOfDownURLs * 100) / TotalRequests;

        //Avarage Respnse Time
        avarageReponseTime = requestsCursor.map(x => x.ResponseTime).reduce((accumulator, currentValue) => accumulator + currentValue) / TotalRequests;

        downTimes = requestsCursor.filter(x => !x.isUp).length == 0  ?  0 : (requestsCursor.filter(x => !x.isUp).length - 1) * 5 // 5 seconds between each request
        uptimes = (UpRequests.length - 1) * 5


        result["Check"] = checkCursor[0];
        result["Report"] = {
            status: status,
            availability: precentageNumberOfUpURLs,
            outages: totalNumberOfDownURLs,
            downtime: downTimes,
            uptime: uptimes,
            responseTime: avarageReponseTime,
            history: requestsCursor
        };
        res.status(201).json({
            status: 'success',
            data: {
                result
            }
        });
    }
    else {
        var ReportCheckKeyValue = [];

        var checkCursor = await Check.find({tags: { $in: req.body.tags } });

        for (let index = 0; index < checkCursor.length; index++) {
            var result = {};

            var requestsCursor = await poolRequest.find({ check: checkCursor[index] },{
                "_id": 0,
                "__v": 0,
              });
            let status = null;

            let TotalRequests = 0;

            let avarageReponseTime = 0;

            let totalNumberOfDownURLs = 0;
            let precentageNumberOfDownURLs = 0;


            let totalNumberOfUpURLs = 0;
            let precentageNumberOfUpURLs = 0;


            let downTimes = 0;
            let uptimes = 0;



            status = requestsCursor[0].isUp ? "UP" : "Down";

            TotalRequests = requestsCursor.length;


            // Calculate Ups stats
            var UpRequests = requestsCursor.filter(x => x.isUp);
            totalNumberOfUpURLs = UpRequests.length;
            precentageNumberOfUpURLs = (totalNumberOfUpURLs * 100) / TotalRequests;


            // Calculate downs stats
            var DownRequests = requestsCursor.filter(x => !x.isUp);
            totalNumberOfDownURLs = DownRequests.length;
            precentageNumberOfDownURLs = (totalNumberOfDownURLs * 100) / TotalRequests;

            //Avarage Respnse Time
            avarageReponseTime = requestsCursor.map(x => x.ResponseTime).reduce((accumulator, currentValue) => accumulator + currentValue) / TotalRequests;

            downTimes = (requestsCursor.filter(x => !x.isUp).length - 1) * 5; // 5 seconds between each request
            uptimes = (UpRequests - 1) * 5;

            result["Check"] = checkCursor[0];
            result["Report"] = {
                status: status,
                availability: precentageNumberOfUpURLs,
                outages: totalNumberOfDownURLs,
                downtime: downTimes,
                uptime: uptimes,
                responseTime: avarageReponseTime,
                history: requestsCursor
            };

            ReportCheckKeyValue.push(result);
        }
        res.status(201).json({
            status: 'success',
            data: {
                ReportCheckKeyValue
            }
        });

    }

}

exports.getAllChecks = base.getAll(Check);
exports.updateCheck = base.updateOne(Check);
