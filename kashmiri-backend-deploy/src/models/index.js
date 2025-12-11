const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      underscored: true,
      freezeTableName: false,
      timestamps: true
    },
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Import models
const User = require('./user')(sequelize);
const Guest = require('./guest')(sequelize);
const RoomType = require('./room_type')(sequelize);
const Booking = require('./booking')(sequelize);
const BookingRoom = require('./booking_room')(sequelize);
const Offer = require('./offer')(sequelize);
const Staff = require('./staff')(sequelize);

// Associations
User.hasOne(Guest, { foreignKey: 'user_id' });
Guest.belongsTo(User, { foreignKey: 'user_id' });

Guest.hasMany(Booking, { foreignKey: 'guest_id' });
Booking.belongsTo(Guest, { foreignKey: 'guest_id' });

Booking.hasMany(BookingRoom, { foreignKey: 'booking_id' });
BookingRoom.belongsTo(Booking, { foreignKey: 'booking_id' });

RoomType.hasMany(BookingRoom, { foreignKey: 'room_type_id' });
BookingRoom.belongsTo(RoomType, { foreignKey: 'room_type_id' });

Offer.hasMany(Booking, { foreignKey: 'offer_id' });
Booking.belongsTo(Offer, { foreignKey: 'offer_id' });

  // Staff (no specific associations for now)
  // You can associate staff with users or departments later

module.exports = {
  sequelize,
  Sequelize,
  User,
  Guest,
  RoomType,
  Booking,
  BookingRoom,
  Offer
  ,
  Staff
};