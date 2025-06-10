const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // corrected typo from 'reqiured' to 'required'
        trim: true,
    },
    description: {
        type: String,
        default: '',
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Starters', 'Main Course', 'Drinks', 'Desserts'],
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    image: {
        type: String,
        default: '', // You can store a URL or path to the image
        trim: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
