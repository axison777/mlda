const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search, active = 'true' } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    
    if (active === 'true') {
      where.isActive = true;
    }
    
    if (category && category !== 'all') {
      where.category = category;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    // Calculate final prices
    const productsWithPrices = products.map(product => {
      let finalPrice = product.price;
      let hasDiscount = false;

      if (product.discount && product.discountType) {
        hasDiscount = true;
        if (product.discountType === 'percentage') {
          finalPrice = product.price * (1 - product.discount / 100);
        } else if (product.discountType === 'fixed') {
          finalPrice = Math.max(0, product.price - product.discount);
        }
      }

      return {
        ...product,
        finalPrice: parseFloat(finalPrice.toFixed(2)),
        hasDiscount
      };
    });

    res.json({
      products: productsWithPrices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get products error', error);
    res.status(500).json({
      message: 'Error fetching products',
      error: error.message
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Calculate final price
    let finalPrice = product.price;
    let hasDiscount = false;

    if (product.discount && product.discountType) {
      hasDiscount = true;
      if (product.discountType === 'percentage') {
        finalPrice = product.price * (1 - product.discount / 100);
      } else if (product.discountType === 'fixed') {
        finalPrice = Math.max(0, product.price - product.discount);
      }
    }

    const productWithPrice = {
      ...product,
      finalPrice: parseFloat(finalPrice.toFixed(2)),
      hasDiscount
    };

    res.json({ product: productWithPrice });
  } catch (error) {
    logger.error('Get product error', error);
    res.status(500).json({
      message: 'Error fetching product',
      error: error.message
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: req.body
    });

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    logger.error('Create product error', error);
    res.status(500).json({
      message: 'Error creating product',
      error: error.message
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.update({
      where: { id },
      data: req.body
    });

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    logger.error('Update product error', error);
    res.status(500).json({
      message: 'Error updating product',
      error: error.message
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    logger.error('Delete product error', error);
    res.status(500).json({
      message: 'Error deleting product',
      error: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};