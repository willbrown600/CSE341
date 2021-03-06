const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendInBlueTransport = require('nodemailer-sendinblue-transport');

const User = require('../models/user');

const transporter = nodemailer.createTransport(
    sendInBlueTransport({
        auth: {
            api_key: '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'
        }
    })
);

var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;
//Instantiate the client
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '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';
//var apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
//var emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message
    });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({
            email: email
        })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/login');
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Invalid email or password.');
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                });
        })
        .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({
            email: email
        })
        .then(userDoc => {
            if (userDoc) {
                req.flash(
                    'error',
                    'E-Mail exists already, please pick a different one.'
                );
                return res.redirect('/signup');
            }
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: {
                            items: []
                        }
                    });
                    return user.save();
                })
                .then(result => {
                    res.redirect('/login');
                    return transporter.sendMail({
                        to: email,
                        from: 'willzshop@node-complete.com',
                        subject: 'Signup successful!',
                        html: '<h1>You successfully signed up!</h1>'
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};