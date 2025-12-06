const { Settings, Shortcut, History, Bookmark, Tab } = require('../models/db');

async function assembleUserData(userDoc) {
    const userId = userDoc._id;

    const [settings, shortcutsDoc, historyDoc, bookmarksDoc, tabsDoc] = await Promise.all([
        Settings.findOne({ userId }),
        Shortcut.findOne({ userId }),
        History.findOne({ userId }),
        Bookmark.findOne({ userId }),
        Tab.findOne({ userId })
    ]);

    return {
        ...userDoc.toObject(),
        settings: settings || { searchEngine: 'https://www.google.com/search?hl=en&q=' },
        shortcuts: shortcutsDoc ? shortcutsDoc.items : [],
        history: historyDoc ? historyDoc.items.reverse() : [],
        bookmarks: bookmarksDoc ? bookmarksDoc.items : [],
        tabs: tabsDoc ? tabsDoc.items : []
    };
}

module.exports = { assembleUserData };
