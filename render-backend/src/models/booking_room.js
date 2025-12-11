const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const BookingRoom = sequelize.define('booking_room', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price_per_night: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    }
  });

  return BookingRoom;
};