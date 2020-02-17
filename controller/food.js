const User = require('../model/user');
const Food = require('../model/food');

/*
 * addFood
 */
exports.addFood = (req, res, next) => {
    const food = new Food({
        foodList: req.body.foodList,
        philanthropist: req.body.clientId
    });

    food.save()
        .then(food => {
            User
                .findOne({_id: req.body.clientId})
                .exec()
                .then(user => {
                    if (user) {
                        user.foods.push(food);

                        user.save()
                            .then(() => {
                                console.log('food added');
                                return res.status(200).json({
                                    has_error: false,
                                    code: 100
                                });
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    } else {
                        console.log('addFood, user not found');
                        res.status(200).json({
                            has_error: true,
                            code: 5 // user not found
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(200).json({error: err});
                });
        })
        .catch(err => {
            console.log('error in catch of addFood method');
            console.log(err);
            res.status(200).json({
                error: err
            });
        });
};

/*
 * homeList
 */
exports.homeList = (req, res, next) => {
    Food
        .findOne({_id: req.body.clientId})
        .populate('philanthropist')
        .exec()
        .then(food => {
            return res.status(200).json({
                data: food
            });
        })
        .catch(err => {
            console.log(err);
            res.status(200).json({error: err});
        });

    // User
    //     .findOne({userType: req.body.userType, _id: req.body.clientId})
    //     .select('_id userName phoneNumber address')
    //     .populate('foods')
    //     .exec()
    //     .then(user => {
    //         if (!user) {
    //             return res.status(200).json({
    //                 has_error: true,
    //                 code: 5 // user not found
    //             });
    //         }
    //
    //         return res.status(200).json({
    //             has_error: false,
    //             code: 100,
    //             data: user
    //         });
    //
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.status(200).json({error: err});
    //     });
};

/*
 * checkPush
 */
exports.checkPolling = (req, res, next) => {

};
