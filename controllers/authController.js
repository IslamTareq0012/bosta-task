const {
    promisify
} = require('util');
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var crypto = require('crypto');

const User = require('../models/userModel');
const verifiyTokenModel = require('../models/verifiyTokenModel');


const AppError = require('../utils/appError');
const MailUtils = require('../utils/mailUtils');


const createToken = (id,email) => {
    return jwt.sign({
        id,
        email
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.login = async (req, res, next) => {
    try {
        const {
            email,
            password
        } = req.body;

        // 1) check if email and password exist
        if (!email || !password) {
            return next(new AppError(404, 'fail', 'Please provide email or password'), req, res, next);
        }

        // 2) check if user exist and password is correct
        const user = await User.findOne({
            email
        }).select('+password');

        if (!user || !await user.correctPassword(password, user.password)) {
            return next(new AppError(401, 'fail', 'Email or Password is wrong'), req, res, next);
        }


        // 3) Check if user if verified
        if (!user.isVerified) {
            return next(new AppError(401, 'fail', 'Your Account Is Not Verified'), req, res, next);
        }

        // 4) All correct, send jwt to client
        const token = createToken(user.id,email);

        // Remove the password from the output 
        user.password = undefined;

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user
            }
        });

    } catch (err) {
        next(err);
    }
};

exports.signup = async (req, res, next) => {
    try {
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            role: req.body.role,
        });


        //verifiy user 
        const VerifiyToken = await verifiyTokenModel.create({
            _userId: user._id,
            token: crypto.randomBytes(16).toString('hex')
        });

        //Sending Mail

        var mailOptions = {
            from: 'no-reply@BostaApp.com'
            , to: user.email
            , subject: 'Account Verification Token'
            , text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api\/v1\/users\/confirmation\/' + "?token=" + VerifiyToken.token + '.\n'
        };

        var mailUtils = new MailUtils();
        var isSuccessedsendingMail = mailUtils.sendMail(mailOptions);

        if (isSuccessedsendingMail) {
            return next(new AppError(401, 'fail', 'Failed To Send Confirmation Mail'), req, res, next);

        } else {
            res.status(200).send('A verification email has been sent to ' + user.email + '.');
        }

    } catch (err) {
        next(err);
    }

};


exports.confirmationPost = function (req, res, next) {
    // Find a matching token
    verifiyTokenModel.findOne({ token: req.query.token }, function (err, token) {
        if (!token) return res.status(400).send({
            type: 'not-verified'
            , msg: 'We were unable to find a valid token. Your token my have expired.'
        });

        // If we found a token, find a matching user
        User.findOne({ _id: token._userId }, function (err, user) {
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
            if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });
            // Verify and save the user
            user.isVerified = true;
            user.save({ validateBeforeSave: false }, function (err) {
                if (err) {
                    return res.status(500).send({ msg: err.message });
                }
                res.status(200).send("The account has been verified. Please log in.");
            });
        });
    });
};

exports.protect = async (req, res, next) => {
    try {
        // 1) check if the token is there
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new AppError(401, 'fail', 'You are not logged in! Please login in to continue'), req, res, next);
        }


        // 2) Verify token 
        const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // 3) check if the user is exist (not deleted)
        const user = await User.findById(decode.id);
        if (!user) {
            return next(new AppError(401, 'fail', 'This user is no longer exist'), req, res, next);
        }

        req.user = user;
        next();

    } catch (err) {
        next(err);
    }
};

// Authorization check if the user have rights to do this action
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError(403, 'fail', 'You are not allowed to do this action'), req, res, next);
        }
        next();
    };
};