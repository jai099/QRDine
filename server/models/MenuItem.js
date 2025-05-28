const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        reqiured: true,
        trim:true,  
    },
    description: {
        type: String,
        default: '',
        trim:true,
    },
    price: {
        type: Number,
        required: true,
        
    },
    category: {
        type: String,
        required: true,
        enum:['Starters','Main Course',]
    }
})