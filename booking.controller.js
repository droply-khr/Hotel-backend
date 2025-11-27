const { Guest, Booking, BookingRoom, RoomType, sequelize } = require('../models');
const logger = require('../utils/logger');

// Helper to generate booking number
const genBookingNumber = () => `BK-${Date.now()}`;

exports.createBooking = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const payload = req.body;
    // Expected payload keys: guestInfo ({firstName,lastName,email,phone,specialRequests}), checkIn, checkOut, rooms [{name,quantity,price}], totalAmount, originalAmount, discountAmount, includesBreakfast, breakfastCharges, paymentType, paymentMethod

    const guestInfo = payload.guestInfo || {};
    if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone) {
      return res.status(400).json({ success: false, message: 'Missing guest information' });
    }

    // Find or create guest
    let guest = await Guest.findOne({ where: { email: guestInfo.email } });
    if (!guest) {
      guest = await Guest.create({
        first_name: guestInfo.firstName,
        last_name: guestInfo.lastName,
        email: guestInfo.email,
        phone: guestInfo.phone,
        address: guestInfo.address || null
      }, { transaction: t });
    }

    const booking = await Booking.create({
      booking_number: genBookingNumber(),
      guest_id: guest.id,
      check_in: payload.checkIn,
      check_out: payload.checkOut,
      total_guests: payload.totalGuests || 1,
      total_amount: payload.totalAmount || 0,
      original_amount: payload.originalAmount || null,
      discount_amount: payload.discountAmount || null,
      includes_breakfast: payload.includesBreakfast ? 1 : 0,
      breakfast_charges: payload.breakfastCharges || 0,
      status: payload.status || 'pending',
      payment_status: payload.paymentType === 'partial' ? 'partial' : (payload.paymentProof ? 'paid' : 'pending'),
      payment_method: payload.paymentMethod || null,
      payment_proof: req.file ? req.file.path : (payload.paymentProof || null),
      amount_paid: payload.amountPaid || 0,
      remaining_amount: payload.remainingAmount || 0,
      special_requests: guestInfo.specialRequests || null
    }, { transaction: t });

    // Create booking room entries
    const rooms = payload.rooms || [];
    for (const r of rooms) {
      // Try to find room type by name
      const rt = await RoomType.findOne({ where: { name: r.name } });
      const roomTypeId = rt ? rt.id : null;

      await BookingRoom.create({
        booking_id: booking.id,
        room_type_id: roomTypeId,
        quantity: r.quantity,
        price_per_night: r.price || 0
      }, { transaction: t });
    }

    await t.commit();

    const created = await Booking.findByPk(booking.id, { include: [{ model: BookingRoom }] });
    res.status(201).json({ success: true, booking: created });
  } catch (err) {
    await t.rollback();
    logger.error(err);
    next(err);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findByPk(id, { include: [{ model: BookingRoom }] });
    if (!booking) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};
