const CartItem = require('../models/CartItem');

exports.getCart = async (req, res) => {
  try {
    const items = await CartItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  const { productId, name, price } = req.body;
  try {
    let item = await CartItem.findOne({ productId });
    if (item) {
      item.quantity += 1;
      await item.save();
    } else {
      item = await CartItem.create({ productId, name, price });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateQuantity = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    const item = await CartItem.findById(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.quantity = quantity;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeItem = async (req, res) => {
  const { id } = req.params;
  try {
    await CartItem.findByIdAndDelete(id);
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
