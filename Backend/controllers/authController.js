const { User, Settings } = require('../models/db');
const { assembleUserData } = require('../utils/helpers');

exports.register = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const existing = await User.findOne({ username });
        if (existing) return res.status(400).json({ status: 'error', message: 'Username taken' });

        const newUser = new User({ username, password, email });
        await newUser.save();

        const newSettings = new Settings({ userId: newUser._id });
        await newSettings.save();

        res.json({ status: 'success', user: await assembleUserData(newUser) });
    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (!user) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });

        const fullUserData = await assembleUserData(user);
        res.json({ status: 'success', user: fullUserData });
    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
    }
};
