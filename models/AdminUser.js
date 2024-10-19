const { Schema, model } = require('mongoose');

const adminUserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = model('AdminUser', adminUserSchema);