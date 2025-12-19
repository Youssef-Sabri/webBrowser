const { User, Settings } = require('../models/db');
const { assembleUserData } = require('../utils/helpers');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const { username, password, email } = req.body;

    // 1. Validation
    if (!username || !password || !email) {
        return res.status(400).json({ status: 'error', message: 'All fields are required' });
    }
    if (password.length < 6) {
        return res.status(400).json({ status: 'error', message: 'Password must be at least 6 characters' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ status: 'error', message: 'Invalid email format' });
    }

    try {
        const existing = await User.findOne({ $or: [{ username }, { email }] });
        if (existing) {
            if (existing.username === username) return res.status(400).json({ status: 'error', message: 'Username taken' });
            if (existing.email === email) return res.status(400).json({ status: 'error', message: 'Email already registered' });
        }

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, password: hashedPassword, email });
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
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });

        // 3. Verify Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });

        const fullUserData = await assembleUserData(user);
        res.json({ status: 'success', user: fullUserData });
    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
    }
};
