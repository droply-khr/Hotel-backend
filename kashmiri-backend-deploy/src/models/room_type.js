const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RoomType = sequelize.define('room_type', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT
    },
    base_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amenities: {
      type: DataTypes.JSON,
      allowNull: true
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true
    },
    total_rooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  });

  return RoomType;
};