import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};

// Common validation schemas
export const schemas = {
  // Auth schemas
  register: z.object({
    body: z.object({
      email: z.string().email('Invalid email format'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional()
    })
  }),

  login: z.object({
    body: z.object({
      email: z.string().email('Invalid email format'),
      password: z.string().min(1, 'Password is required')
    })
  }),

  // Menu schemas
  createMenuItem: z.object({
    body: z.object({
      name: z.string().min(1, 'Name is required'),
      description: z.string().optional(),
      price: z.number().positive('Price must be positive'),
      category: z.enum(['STARTERS', 'BREAKFAST', 'LUNCH', 'DESSERTS', 'BEVERAGES']),
      image: z.string().optional(),
      isAvailable: z.boolean().optional(),
      isFeatured: z.boolean().optional()
    })
  }),

  updateMenuItem: z.object({
    params: z.object({
      id: z.string().cuid()
    }),
    body: z.object({
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      price: z.number().positive().optional(),
      category: z.enum(['STARTERS', 'BREAKFAST', 'LUNCH', 'DESSERTS', 'BEVERAGES']).optional(),
      image: z.string().optional(),
      isAvailable: z.boolean().optional(),
      isFeatured: z.boolean().optional()
    })
  }),

  // Booking schemas
  createBooking: z.object({
    body: z.object({
      date: z.string().datetime('Invalid date format'),
      time: z.string().min(1, 'Time is required'),
      partySize: z.number().int().positive('Party size must be positive'),
      specialRequests: z.string().optional()
    })
  }),

  updateBooking: z.object({
    params: z.object({
      id: z.string().cuid()
    }),
    body: z.object({
      date: z.string().datetime().optional(),
      time: z.string().optional(),
      partySize: z.number().int().positive().optional(),
      specialRequests: z.string().optional(),
      status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional()
    })
  }),

  // Order schemas
  createOrder: z.object({
    body: z.object({
      items: z.array(z.object({
        menuItemId: z.string().cuid(),
        quantity: z.number().int().positive('Quantity must be positive'),
        price: z.number().positive('Price must be positive')
      })).min(1, 'At least one item is required'),
      paymentMethod: z.string().optional(),
      deliveryAddress: z.string().optional(),
      specialInstructions: z.string().optional()
    })
  }),

  updateOrder: z.object({
    params: z.object({
      id: z.string().cuid()
    }),
    body: z.object({
      status: z.enum(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED']).optional(),
      paymentMethod: z.string().optional(),
      deliveryAddress: z.string().optional(),
      specialInstructions: z.string().optional()
    })
  }),

  // User schemas
  updateProfile: z.object({
    body: z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional()
    })
  }),

  changePassword: z.object({
    body: z.object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z.string().min(6, 'New password must be at least 6 characters')
    })
  })
};