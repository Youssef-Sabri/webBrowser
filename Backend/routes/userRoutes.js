const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const syncController = require('../controllers/syncController');

// User data
router.get('/:userId', userController.getUser);

// Sync operations
router.post('/:userId/settings', syncController.updateSettings);
router.post('/:userId/shortcuts', syncController.syncShortcuts);
router.post('/:userId/bookmarks', syncController.syncBookmarks);
router.post('/:userId/tabs', syncController.syncTabs);

// History specific
router.post('/:userId/history', syncController.addHistory);
router.delete('/:userId/history', syncController.clearHistory);

module.exports = router;
