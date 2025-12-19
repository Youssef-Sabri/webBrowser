const { User, Settings, Shortcut, History, Bookmark, Tab } = require('../models/db');

// Helper for generic list sync
const syncList = async (Model, userId, listItems, res) => {
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        await Model.findOneAndUpdate(
            { userId },
            {
                userId,
                username: user.username,
                items: listItems
            },
            { upsert: true, new: true }
        );
        res.json({ status: 'success' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        await Settings.findOneAndUpdate(
            { userId: req.params.userId },
            { $set: req.body },
            { upsert: true, new: true }
        );
        res.json({ status: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.syncShortcuts = (req, res) => {
    syncList(Shortcut, req.params.userId, req.body, res);
};

exports.syncBookmarks = (req, res) => {
    syncList(Bookmark, req.params.userId, req.body, res);
};

exports.syncTabs = (req, res) => {
    syncList(Tab, req.params.userId, req.body, res);
};

exports.addHistory = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        await History.findOneAndUpdate(
            { userId },
            {
                userId,
                username: user.username,
                $push: { items: { $each: [req.body], $position: 0 } }
            },
            { upsert: true, new: true }
        );
        res.json({ status: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.clearHistory = async (req, res) => {
    try {
        const userId = req.params.userId;
        await History.findOneAndUpdate(
            { userId },
            { $set: { items: [] } }
        );
        res.json({ status: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.deleteHistoryItem = async (req, res) => {
    try {
        const { userId, itemId } = req.params;
        // Parse itemId to number since our schema uses Number for id
        const idNum = Number(itemId);

        await History.findOneAndUpdate(
            { userId },
            { $pull: { items: { id: idNum } } }
        );
        res.json({ status: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
};
