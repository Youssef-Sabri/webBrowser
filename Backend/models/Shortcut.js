const mongoose = require('mongoose');

const shortcutSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    username: String,
    items: [{
        id: String,
        title: String,
        url: String,
        icon: String,
        gradient: String,
        isCustom: Boolean
    }]
});

module.exports = mongoose.model('Shortcut', shortcutSchema);
