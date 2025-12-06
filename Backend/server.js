const express = require('express');
const cors = require('cors');
const { User, Settings, Shortcut, History, Bookmark, Tab } = require('./models/db'); // Import from single file

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());


// --- Helper: Assemble User Data ---
async function assembleUserData(userDoc) {
  const userId = userDoc._id;

  const [settings, shortcuts, history, bookmarks, tabs] = await Promise.all([
    Settings.findOne({ userId }),
    Shortcut.find({ userId }),
    History.find({ userId }).sort({ id: -1 }),
    Bookmark.find({ userId }),
    Tab.find({ userId })
  ]);

  return {
    ...userDoc.toObject(),
    settings: settings || { searchEngine: 'https://www.google.com/search?q=' },
    shortcuts: shortcuts || [],
    history: history || [],
    bookmarks: bookmarks || [],
    tabs: tabs || []
  };
}

// --- Routes ---

// 1. Auth: Register
app.post('/api/register', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ status: 'error', message: 'Username taken' });

    // Create User
    const newUser = new User({ username, password, email });
    await newUser.save();

    // Create Default Settings
    const newSettings = new Settings({ userId: newUser._id });
    await newSettings.save();

    res.json({ status: 'success', user: await assembleUserData(newUser) });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// 2. Auth: Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });

    const fullUserData = await assembleUserData(user);
    res.json({ status: 'success', user: fullUserData });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// 3. Sync: Get All User Data
app.get('/api/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const fullUserData = await assembleUserData(user);
    res.json({ status: 'success', data: fullUserData });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 4. Sync: Update Settings
app.post('/api/user/:userId/settings', async (req, res) => {
  try {
    await Settings.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: req.body },
      { upsert: true, new: true }
    );
    res.json({ status: 'success' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- Helper: Generic Sync Handler (Delete many + Insert many) ---
const syncList = async (Model, userId, items, res) => {
  try {
    await Model.deleteMany({ userId });
    if (items && items.length > 0) {
      const itemsWithUser = items.map(item => ({ ...item, userId }));
      await Model.insertMany(itemsWithUser);
    }
    res.json({ status: 'success' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// 5. Sync: Update Shortcuts
app.post('/api/user/:userId/shortcuts', (req, res) => {
  syncList(Shortcut, req.params.userId, req.body, res);
});

// 6. Sync: Add History Item
app.post('/api/user/:userId/history', async (req, res) => {
  try {
    const newItem = new History({ ...req.body, userId: req.params.userId });
    await newItem.save();
    res.json({ status: 'success' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 7. Sync: Clear History
app.delete('/api/user/:userId/history', async (req, res) => {
  try {
    await History.deleteMany({ userId: req.params.userId });
    res.json({ status: 'success' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 8. Sync: Update Bookmarks
app.post('/api/user/:userId/bookmarks', (req, res) => {
  syncList(Bookmark, req.params.userId, req.body, res);
});

// 9. Sync: Update Tabs
app.post('/api/user/:userId/tabs', (req, res) => {
  syncList(Tab, req.params.userId, req.body, res);
});

app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});