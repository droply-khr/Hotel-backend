require('dotenv').config();
const { sequelize, RoomType, Offer } = require('../models');
const logger = require('./logger');

async function seed() {
  try {
    await sequelize.sync({ alter: true });

    // Seed room types if none exist
    const count = await RoomType.count();
    if (count === 0) {
      const roomTypes = [
        { name: 'Premium Deluxe Mountain View', description: 'Premium deluxe room offering stunning panoramic mountain views and elevated comfort', base_price: 12000, capacity: 3, amenities: ['Private balcony', 'Panoramic mountain view', 'Central heating', 'King-size bed', 'Smart LED TV', 'High-speed Wi-Fi', 'Mini-fridge', 'Tea/coffee kettle', 'Work desk', 'Seating area', 'Modern ensuite bathroom', 'Premium toiletries', '24/7 room service', 'Power backup'], total_rooms: 5 },
        { name: 'Deluxe Mountain View', description: 'Spacious room designed for comfort with breathtaking mountain scenery', base_price: 8000, capacity: 3, amenities: ['Window/balcony mountain view', 'Heating', 'Queen/king bed', 'LED TV', 'Free Wi-Fi', 'Tea/coffee setup', 'Attached bathroom', 'Toiletries', 'In-room dining', 'Daily housekeeping'], total_rooms: 6 },
        { name: 'Standard Mountain View', description: 'Affordable and cozy room with refreshing mountain views', base_price: 6000, capacity: 2, amenities: ['Window mountain view', 'Double bed', 'Heating on request', 'LED TV', 'Wi-Fi', 'Attached washroom', 'Basic toiletries', 'Daily cleaning'], total_rooms: 8 },
        { name: 'Deluxe Jungle View', description: 'Stylish room surrounded by serene green jungle scenery', base_price: 8000, capacity: 3, amenities: ['Jungle-facing window/balcony', 'Queen/king bed', 'Heating', 'LED TV', 'Wi-Fi', 'Tea/coffee kettle', 'Spacious bathroom', 'Toiletries', 'In-room dining', 'Housekeeping'], total_rooms: 4 },
        { name: 'Chinar Suite Overseas', description: 'Luxury suite inspired by Kashmir\'s Chinar heritage with premium interiors', base_price: 18000, capacity: 3, amenities: ['Large balcony', 'Scenic mountain/pine view', 'Luxury king bed', 'Lounge sitting', 'Split AC', 'Heating', 'Smart TV', 'High-speed Wi-Fi', 'Mini-bar', 'Tea/coffee setup', 'Modern bathroom', 'Premium toiletries', 'Bathrobes', 'Slippers', 'Dedicated room service'], total_rooms: 3 },
        { name: 'Leepa Suite Overseas', description: 'Sophisticated suite inspired by Leepa Valley\'s natural beauty', base_price: 18000, capacity: 3, amenities: ['Oversized scenic windows', 'Luxury bedding', 'Separate sitting area', 'Heating', 'Smart LED TV', 'Wi-Fi', 'Tea/coffee bar', 'Mini-fridge', 'Spacious bathroom', 'Hair dryer', 'Toiletries kit', 'Priority housekeeping'], total_rooms: 3 },
        { name: 'Pandu Suite Executive', description: 'Executive suite offering elegant space, privacy, and comfort', base_price: 16000, capacity: 4, amenities: ['One-bedroom layout', 'Sofa lounge', 'Heating', 'Smart TV', 'Wi-Fi', 'Mini-fridge', 'Tea/coffee setup', 'Stylish bathroom', 'Hot water', 'Premium linens', 'Toiletries', 'Round-the-clock support'], total_rooms: 2 },
        { name: 'Taobat Suite Executive', description: 'Executive suite inspired by Taobat meadows, perfect for relaxed stays', base_price: 16000, capacity: 4, amenities: ['Separate bedroom and lounge', 'Valley-facing windows', 'Heating', 'Smart LED TV', 'Wi-Fi', 'Mini-bar', 'Kettle', 'Modern bathroom', 'Towels', 'Linens', 'Room service', 'Housekeeping'], total_rooms: 2 },
        { name: 'Banjosa 2-Bed Family Suite', description: 'Spacious family suite named after Banjosa Lake, ideal for long stays', base_price: 25000, capacity: 6, amenities: ['Two bedrooms', 'Family lounge', 'Dining space', 'Heating', 'Smart TVs', 'High-speed Wi-Fi', 'Family-size fridge', 'Tea/coffee setup', 'Large bathroom(s)', 'Extra mattresses available', 'Premium linens', 'Toiletries'], total_rooms: 2 },
        { name: 'Chrikot 2-Bed Family Suite', description: 'Stylish family suite inspired by Chrikot Fort with heritage feel', base_price: 25000, capacity: 6, amenities: ['Two bedrooms', 'Shared lounge', 'Scenic forest/mountain windows', 'Heating', 'Smart TV', 'Wi-Fi', 'Mini-fridge', 'Kettle', 'Spacious bathrooms', 'Family toiletries', 'Towels', 'Daily room service'], total_rooms: 2 },
        { name: 'Honeymoon Tree House', description: 'Romantic tree house offering privacy, nature, and dreamy ambiance', base_price: 12000, capacity: 2, amenities: ['Elevated private terrace', 'Forest view', 'Romantic lighting', 'Queen/king bed', 'Heating', 'Smart TV', 'Wi-Fi', 'Tea/coffee setup', 'Cozy attached bathroom', 'Honeymoon welcome amenities', 'Maximum privacy'], total_rooms: 1 },
        { name: 'Family Jungle Hut', description: 'Exclusive jungle hut perfect for large families seeking space and nature', base_price: 30000, capacity: 8, amenities: ['Standalone private hut', 'Two bedrooms', 'Large lounge', 'Dining area', 'Heating', 'Multiple smart TVs', 'Wi-Fi', 'Family refrigerator', 'Tea/coffee station', 'Spacious bathrooms', 'Outdoor sitting space', 'Ideal for groups & extended stays'], total_rooms: 1 }
      ];
      await RoomType.bulkCreate(roomTypes);
      logger.info('Seeded room types');
    } else {
      logger.info('Room types already seeded');
    }

    // Seed offers if none exist
    const offersCount = await Offer.count();
    if (offersCount === 0) {
      const today = new Date();
      const validTo = new Date(); validTo.setMonth(validTo.getMonth()+3);
      const offers = [
        { title: 'All Rooms 10% Off', description: 'Universal discount', offer_type: 'percentage', discount_value: 10, min_nights: 1, valid_from: today, valid_to: validTo, is_active: true, offer_code: 'SAVE10' },
        { title: 'Overseas Suite 20% Off', description: 'Overseas suite discount', offer_type: 'percentage', discount_value: 20, min_nights: 2, valid_from: today, valid_to: validTo, is_active: true, offer_code: 'OVERSEAS20', applicable_room_types: JSON.stringify(['Chinar Suite Overseas','Leepa Suite Overseas']) },
        { title: 'Executive Suite 15% Off', description: 'Executive suite special offer', offer_type: 'percentage', discount_value: 15, min_nights: 3, valid_from: today, valid_to: validTo, is_active: true, offer_code: 'EXECUTIVE15', applicable_room_types: JSON.stringify(['Pandu Suite Executive','Taobat Suite Executive']) },
        { title: 'Family Suite 25% Off', description: 'Family suite package deal', offer_type: 'percentage', discount_value: 25, min_nights: 4, valid_from: today, valid_to: validTo, is_active: true, offer_code: 'FAMILY25', applicable_room_types: JSON.stringify(['Banjosa 2 Bed Suit Family','Chrikot 2 Bed Suit Family','Family Jungle Hut']) }
      ];
      await Offer.bulkCreate(offers);
      logger.info('Seeded offers');
    } else {
      logger.info('Offers already seeded');
    }

    process.exit(0);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

if (require.main === module) {
  seed();
}

module.exports = seed;
