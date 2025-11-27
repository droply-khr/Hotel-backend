const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Offer = sequelize.define('offer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    offer_type: {
      type: DataTypes.ENUM('percentage','fixed','free-nights','buy-x-get-y'),
      allowNull: false
    },
    discount_value: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    free_nights: {
      type: DataTypes.INTEGER
    },
    buy_nights: {
      type: DataTypes.INTEGER
    },
    get_nights: {
      type: DataTypes.INTEGER
    },
    min_nights: {
      type: DataTypes.INTEGER
    },
    valid_from: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    valid_to: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    applicable_room_types: {
      type: DataTypes.JSON
    },
    applicable_venues: {
      type: DataTypes.JSON
    },
    includes_breakfast: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    offer_code: {
      type: DataTypes.STRING(20),
      unique: true
    },
    exclude_weekends: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    excluded_dates: {
      type: DataTypes.JSON
    }
  });

  return Offer;
};