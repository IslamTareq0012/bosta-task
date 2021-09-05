const mongoose = require('mongoose');
const headresSchema = new mongoose.Schema({ name: String, value: String });
const authenticationchema = new mongoose.Schema({ username: String, password: String, basicHeader: String });

const MailUtils = require('../utils/mailUtils');

const checkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please fill check name'],
        unique: true,
    },
    url: {
        type: String,
        required: [true, 'Please fill the URL']
    },
    protocol: {
        type: String,
        required: [true, 'Please fill the protocol'],

        enum: ['HTTP', 'HTTPS', 'TCP']
    },
    path: {
        type: String

    },
    Port: {
        type: Number
    },
    webhook: {
        type: String
    },
    timeout: {
        type: Number,
        default: 5000 //MS
    },
    interval: {
        type: Number,
        default: 600000
    },
    threshold: {
        type: Number,
        default:1
    },
    authentication: {
        type: authenticationchema
    },
    headers: {
        type: [headresSchema]
    },
    assertCode: {
        type: String
    },
    tags: {
        type: [String]
    },
    ignoreSSL: {
        type: Boolean
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isPaused: {
        type: Boolean
    },
    isDeleted: {
        type: Boolean
    },
    isUp: {
        type: Boolean,
        default: true
    }
});


checkSchema.pre('save', async function (next) {
    this.authentication.basicHeader = 'Basic ' +
        Buffer.from(this.authentication.username + ':' + this.authentication.password).toString('base64');
});
const Check = mongoose.model('Check', checkSchema);
module.exports = Check;