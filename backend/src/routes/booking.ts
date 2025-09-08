import express from 'express';
import { PrismaClient } from '@prisma/client';
import { validateRequest, schemas } from '../middleware/validation';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Create booking (authenticated users only)
router.post('/', authenticateToken, validateRequest(schemas.createBooking), async (req: any, res) => {
  try {
    const { date, time, partySize, specialRequests } = req.body;
    const userId = req.user.id;

    // Check if booking date is in the future
    const bookingDate = new Date(date);
    const now = new Date();
    
    if (bookingDate <= now) {
      return res.status(400).json({ error: 'Booking date must be in the future' });
    }

    // Check for existing booking at the same time
    const existingBooking = await prisma.booking.findFirst({
      where: {
        date: bookingDate,
        time,
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      }
    });

    if (existingBooking) {
      return res.status(400).json({ 
        error: 'Time slot is already booked. Please choose a different time.' 
      });
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        date: bookingDate,
        time,
        partySize,
        specialRequests
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's bookings (authenticated users only)
router.get('/my-bookings', authenticateToken, async (req: any, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const userId = req.user.id;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { userId };
    if (status) {
      where.status = status.toUpperCase();
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          }
        }
      }),
      prisma.booking.count({ where })
    ]);

    res.json({
      bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get booking by ID (authenticated users - own bookings or admin)
router.get('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user owns the booking or is admin
    if (booking.userId !== userId && userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update booking (authenticated users - own bookings or admin)
router.put('/:id', authenticateToken, validateRequest(schemas.updateBooking), async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if booking exists and user has permission
    const existingBooking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (existingBooking.userId !== userId && userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // If updating date/time, check for conflicts
    if (req.body.date || req.body.time) {
      const checkDate = req.body.date ? new Date(req.body.date) : existingBooking.date;
      const checkTime = req.body.time || existingBooking.time;

      const conflictingBooking = await prisma.booking.findFirst({
        where: {
          id: { not: id },
          date: checkDate,
          time: checkTime,
          status: {
            in: ['PENDING', 'CONFIRMED']
          }
        }
      });

      if (conflictingBooking) {
        return res.status(400).json({ 
          error: 'Time slot is already booked. Please choose a different time.' 
        });
      }
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: req.body,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.json({
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel booking (authenticated users - own bookings or admin)
router.patch('/:id/cancel', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const existingBooking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (existingBooking.userId !== userId && userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (existingBooking.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all bookings (admin only)
router.get('/', authenticateToken, requireRole(['ADMIN', 'STAFF']), async (req, res) => {
  try {
    const { status, date, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status) {
      where.status = status.toUpperCase();
    }
    if (date) {
      const filterDate = new Date(date as string);
      where.date = {
        gte: new Date(filterDate.setHours(0, 0, 0, 0)),
        lt: new Date(filterDate.setHours(23, 59, 59, 999))
      };
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          }
        }
      }),
      prisma.booking.count({ where })
    ]);

    res.json({
      bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;