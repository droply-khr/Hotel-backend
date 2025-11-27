const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Staff = sequelize.define('staff', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    designation: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    salary: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: true
    },
    joining_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('Active','Inactive'),
      defaultValue: 'Active'
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    emergency_contact: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    allowed_leaves: {
      type: DataTypes.INTEGER,
      defaultValue: 12
    },
    paid_leaves_taken: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    unpaid_leaves_taken: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    advances: {
      type: DataTypes.DECIMAL(12,2),
      defaultValue: 0
    },
    cnic_front_path: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cnic_back_path: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  });

  return Staff;
};
