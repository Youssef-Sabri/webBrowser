const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    username: String,
    items: [{
        id: Number,
        url: String,
        title: String,
        timestamp: String
    }]
});

module.exports = mongoose.model('History', historySchema);
