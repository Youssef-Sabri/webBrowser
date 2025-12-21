const mongoose = require('mongoose');

const tabSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    username: String,
    items: [{
        id: Number,
        title: String,
        url: String,
        history: [String],
        currentIndex: Number,
        lastRefresh: Number,
        zoom: Number
    }]
});

module.exports = mongoose.model('Tab', tabSchema);
