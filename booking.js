const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Booking = sequelize.define('booking', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    booking_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    check_in: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    check_out: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    total_guests: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    original_amount: {
      type: DataTypes.DECIMAL(10,2)
    },
    discount_amount: {
      type: DataTypes.DECIMAL(10,2)
    },
    includes_breakfast: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    breakfast_charges: {
      type: DataTypes.DECIMAL(10,2)
    },
    status: {
      type: DataTypes.ENUM('pending','confirmed','checked_in','checked_out','cancelled'),
      defaultValue: 'pending'
    },
    payment_status: {
      type: DataTypes.ENUM('pending','partial','paid','refunded'),
      defaultValue: 'pending'
    },
    payment_method: {
      type: DataTypes.ENUM('cash','card','bank_transfer','easypaisa','jazzcash')
    },
    payment_proof: {
      type: DataTypes.TEXT
    },
    amount_paid: {
      type: DataTypes.DECIMAL(10,2),
      defaultValue: 0
    },
    remaining_amount: {
      type: DataTypes.DECIMAL(10,2),
      defaultValue: 0
    },
    special_requests: {
      type: DataTypes.TEXT
    }
  });

  return Booking;
};