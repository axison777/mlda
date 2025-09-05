const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { validate, productSchemas } = require('../utils/validators');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Public routes (for visitors to browse products)
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Admin routes
router.post('/', authenticateToken, requireAdmin, validate(productSchemas.create), productController.createProduct);
router.put('/:id', authenticateToken, requireAdmin, validate(productSchemas.update), productController.updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, productController.deleteProduct);

module.exports = router;