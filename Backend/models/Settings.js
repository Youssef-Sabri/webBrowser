const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    searchEngine: { type: String, default: 'https://www.google.com/search?hl=en&q=' }
});

module.exports = mongoose.model('Settings', settingsSchema);
