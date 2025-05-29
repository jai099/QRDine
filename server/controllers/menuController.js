const MenuItem = require('../models/MenuItem');

//get all items
exports.getAvailableItems = async (req, res) => {
    const items = await MenuItem.find({ isAvailable: true });
    res.json(items);
}

// get items by category
exports.getItemsByCategory = async (req, res) => {
    const { category } = req.params;
    const items = await MenuItem.find({ category, isAvailable: true });
    res.json(items);
}

//Add a new item
exports.adddMenuItem = async (req, res) => {
    try {
        const data = Array.isArray(req.body) ? req.body : [req.body];

        // Validate and save using insertMany
        const savedItems = await MenuItem.insertMany(data);
        res.status(201).json({ message: 'Menu item(s) added successfully', data: savedItems });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Edit item
exports.updateMenuItem = async (req, res) => {
    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
};

//delete an item
exports.deleteMenuItem = async (req, res) => {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted Successfully ' });
};

exports.toggleAvailability = async (req, res) => {
    const item = await MenuItem.findById(req.params.id);
    item.isAvailable = !item.isAvailable;
    await item.save();
    res.json(item);
}


