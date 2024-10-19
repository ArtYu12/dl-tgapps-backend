const mongoose = require('mongoose');

const TxSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

module.exports = mongoose.model('Tx', TxSchema);