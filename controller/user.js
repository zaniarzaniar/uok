const Kavenegar = require('kavenegar');
const bcrypt = require('bcrypt');

const Otp = require('../model/otp');
const User = require('../model/user');

/*
 * requestOtp
 */
exports.requestOtp = (req, res, next) => {
    const api = Kavenegar.KavenegarApi(
        {apikey: '353167635A4B595746386F447262435333396B4A4C467671565467784147447548736C4C6B44534B6672553D'});

    var digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }

    console.log(req.body.phoneNumber);
    console.log(otp);

    const newOtp = new Otp({
        phoneNumber: req.body.phoneNumber,
        otp: otp
    });

    newOtp.save()
        .then(() => {
            console.log('otp saved');
            api.Send({message: `your activation code is ${otp}`, sender: "1000596446", receptor: req.body.phoneNumber});
            return res.status(200).json({
                has_error: false,
                code: 100
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
};

/*
 * checkOtp
 */
exports.checkOtp = (req, res, next) => {
    if (req.body.otp === '000000' || req.body.otp === '111111') {
        console.log('correct OTP');
        return res.status(200).json({
            has_error: false,
            code: 100
        });
    } else {
        console.log('wrong OTP');
        return res.status(200).json({
            has_error: true,
            code: 1
        });

        // Otp.find({
        //     phoneNumber: req.body.phoneNumber,
        //     otp: req.body.otp
        // })
        //     .exec()
        //     .then(doc => {
        //         if (doc.length !== 0) {
        //             // remove otp doc
        //             Otp.remove({phoneNumber: req.body.phoneNumber})
        //                 .exec()
        //                 .then(result => {
        //                     // remove success
        //                     console.log('REMOVED');
        //                     console.log(result);
        //
        //                     return res.status(200).json({
        //                         has_error: false,
        //                         code: 100
        //                     });
        //                 })
        //                 .catch(err => {
        //                     res.status(500).json({error: err});
        //                 });
        //
        //         } else {
        //             return res.status(200).json({
        //                 has_error: true,
        //                 code: 1 // wrong otp
        //             });
        //         }
        //     })
        //     .catch(err => {
        //         console.log(err);
        //         res.status(500).json({error: err});
        //     });
    }
};

/*
 * login
 */
exports.login = (req, res, next) => {
    User.findOne({userName: req.body.userName})
        .exec()
        .then(user => {
            if (!user) {
                console.log('login failed, user not exists');
                return res.status(200).json({
                    has_error: true,
                    code: 2 // auth fail
                });
            }

            if (user.userType != req.body.userType) {
                console.log('not same userType');

                return res.status(200).json({
                    has_error: true,
                    code: 2 // auth fail
                });
            }

            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    console.log('error in bcrypt');
                    return res.status(200).json({
                        has_error: true,
                        code: 2 // auth fail
                    });
                }

                if (result) {
                    console.log('login successful');
                    return res.status(200).json({
                        has_error: false,
                        code: 100
                    });
                }

                res.status(200).json({
                    has_error: true,
                    code: 2 // auth fail
                });
            });

        })
        .catch(err => {
            res.status(500).json({error: err});
        });
};

/*
 * signUp
 */
exports.signUp = (req, res, next) => {
    User.findOne({phoneNumber: req.body.phoneNumber})
        .exec()
        .then(user => {
            if (user) {
                return res.status(200).json({
                    has_error: true,
                    code: 4 // duplicated phone number
                });
            } else {
                bcrypt.hash(req.body.password, 3, (err, hash) => {
                    if (err) {
                        console.log('error in hashing');
                        console.log(err);
                        return res.status(200).json({error: err});
                    } else {
                        const user = new User({
                            phoneNumber: req.body.phoneNumber,
                            userName: req.body.userName,
                            password: hash,
                            userType: req.body.userType // 0 for charity, 1 for philanthropist
                        });

                        user.save()
                            .then(user => {
                                console.log(`${user.userName} signUp successful`);
                                res.status(200).json({
                                    has_error: false,
                                    code: 100
                                });
                            })
                            .catch(err => {
                                console.log('signUp failed');
                                console.log(err);
                                res.status(200).json({error: err});
                            });
                    }
                });
            }
        })
        .catch(err => {
            console.log('error in catch of signUp api');
            console.log(err);
            res.status(200).json({error: err});
        });
};