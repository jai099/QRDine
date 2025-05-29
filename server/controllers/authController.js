const User = require('../models/User');

exports.registerUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create new user
        const newUser = new User({ username, password, role });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
  

exports.loginUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        const user = await User.findOne({ username, role });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful', user: { username: user.username, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
  };