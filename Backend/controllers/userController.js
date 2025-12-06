const { User } = require('../models/db');
const { assembleUserData } = require('../utils/helpers');

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const fullUserData = await assembleUserData(user);
        res.json({ status: 'success', data: fullUserData });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
