const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    sku: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    }
  });

  return Product;
};