const { Product } = require('../models');
const logger = require('../utils/logger');

exports.createProduct = async (req, res, next) => {
  try {
    const payload = req.body;

    const productData = {
      name: payload.name,
      description: payload.description,
      price: payload.price,
      category: payload.category,
      stock: payload.stock,
      is_available: payload.isAvailable,
      sku: payload.sku,
      image_url: payload.imageUrl
    };

    const created = await Product.create(productData);
    res.status(201).json({ success: true, product: created });
  } catch (err) {
    logger.error('createProduct error:', err);
    next(err);
  }
};

exports.listProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({ order: [['id', 'DESC']] });
    res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const payload = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.update({
      name: payload.name,
      description: payload.description,
      price: payload.price,
      category: payload.category,
      stock: payload.stock,
      is_available: payload.isAvailable,
      sku: payload.sku,
      image_url: payload.imageUrl
    });

    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.destroy();
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};