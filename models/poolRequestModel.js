const mongoose = require('mongoose');


const poolRequestSchema = new mongoose.Schema({

    check: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Check"
    },
    isUp:{
        type:Boolean
    },
    DateTimeCreated:{
        type:Date
    },

    ResponseTime:{
        type:Number
    }

});

const RequestsRecords = mongoose.model('RequestsRecords', poolRequestSchema);
module.exports = RequestsRecords;