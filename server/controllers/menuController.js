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
    const newItem = new MenuItem(req.body);
    await newItem.save();
    res.status(201).json(newItem);
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


