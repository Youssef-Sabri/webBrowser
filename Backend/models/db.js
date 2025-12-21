// Aggregate and export all models
const User = require('./User');
const Settings = require('./Settings');
const Shortcut = require('./Shortcut');
const History = require('./History');
const Bookmark = require('./Bookmark');
const Tab = require('./Tab');

module.exports = {
  User,
  Settings,
  Shortcut,
  History,
  Bookmark,
  Tab
};