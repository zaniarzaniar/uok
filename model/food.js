const mongoose = require('mongoose');

const foodSchema = mongoose.Schema({
    philanthropist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },

    charity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },

    time: { // time that food saved (food added)
        type: String,
        required: false
    },

    foodList: [
        {
            name: {type: String, required: true},
            count: {type: Number, required: true}
        }
    ]
});

module.exports = mongoose.model('Food', foodSchema);