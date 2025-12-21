const mongoose = require('mongoose');

// --- MongoDB Connection Moved to server.js ---

// --- 1. User Model ---
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  joined: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// --- 2. Settings Model ---
const settingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  searchEngine: { type: String, default: 'https://www.google.com/search?hl=en&q=' }
});
const Settings = mongoose.model('Settings', settingsSchema);

// --- 3. Shortcut Model (Nested) ---
const shortcutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  username: String, // Added for readability in "folders"
  items: [{
    id: String,
    title: String,
    url: String,
    icon: String,
    gradient: String,
    isCustom: Boolean
  }]
});
const Shortcut = mongoose.model('Shortcut', shortcutSchema);

// --- 4. History Model (Nested) ---
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
const History = mongoose.model('History', historySchema);

// --- 5. Bookmark Model (Nested) ---
const bookmarkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  username: String,
  items: [{
    url: String,
    title: String
  }]
});
const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

// --- 6. Tab Model (Session) (Nested) ---
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
const Tab = mongoose.model('Tab', tabSchema);

// Export everything
module.exports = {
  User,
  Settings,
  Shortcut,
  History,
  Bookmark,
  Tab
};