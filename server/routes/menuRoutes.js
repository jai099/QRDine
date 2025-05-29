const express = require('express')
const router = express.Router();
const menuController = require('../controllers/menuController');

// customer routes
router.get('/available', menuController.getAvailableItems);
router.get('/category/:category', menuController.getItemsByCategory);

//admin routes

router.post('/add', menuController.adddMenuItem);
router.put('/update/:id', menuController.updateMenuItem);
router.delete('/delete/:id', menuController.deleteMenuItem);
router.patch('/toggle/:id', menuController.toggleAvailability);

module.exports = router;