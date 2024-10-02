const User = require('../models/User');
const { Parser } = require('json2csv');
const { v4: uuidv4 } = require('uuid');
const upload = require('../config/multer.config');


exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, mobile, age, gender, status, location, profile } = req.body;
        console.log('Creating User', req.body);
        const uniqueId = Math.floor(100 + Math.random() * 1000);
        const user = new User({ user_id: uniqueId, firstName, lastName, email, mobile, gender, age, status, location, profile });
        if (uniqueId) {
            console.log('Generated user_id', uniqueId);
            await user.save();
            res.status(201).json(user);
        } else {
            res.status(400).json({ error: 'Error generating unique user ID' });
        }
    } catch (error) {
        console.log('Error:', error);
        res.status(400).json({ error: 'Error creating user' });
    }
};

exports.getUsers = async (req, res) => {
    try {
        // console.log('req', req);

        const { page = 1, limit = 10 } = req.query;
        const users = await User.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await User.countDocuments();
        res.json({
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};


exports.getUser = async (req, res) => {
    try {

        const user = await User.findById(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};

// fetch user details
exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: 'Error updating user' });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
};

// Search users by name or email
exports.searchUsers = async (req, res) => {

    try {
        const { searchQuery } = req.query;
        console.log(' Search req', searchQuery);
        const users = await User.find({
            $or: [
                { firstName: { $regex: searchQuery, $options: 'i' } },
                { lastName: { $regex: searchQuery, $options: 'i' } },
                { email: { $regex: searchQuery, $options: 'i' } }
            ],
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error searching users' });
    }
};

// Export users to CSV
exports.exportToCSV = async (req, res) => {
    try {
        const users = await User.find().lean();
        const fields = ['user_id', 'firstName', 'lastName', 'gender', 'email', 'status'];
        const parser = new Parser({ fields });
        const csv = parser.parse(users);
        res.header('Content-Type', 'text/csv');
        res.attachment('users.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ error: 'Error exporting users' });
    }
};

//Assets upload using Multer

exports.assetsUpload = async (req, res) => {
    upload.single('image')(req, res, async (err) => {
        // console.log('image upload', req);

        if (err) {
            return res.status(500).json({ error: 'Error uploading file' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        res.json({ message: 'File uploaded successfully!', filePath: `/assets/${req.file.filename}` });
    });
};
