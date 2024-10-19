const mongoose = require('mongoose');

const UserCourseCertificateSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

module.exports = mongoose.model('UserCourseCertificate', UserCourseCertificateSchema);