const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    username: String,
    items: [{
        url: String,
        title: String
    }]
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);
