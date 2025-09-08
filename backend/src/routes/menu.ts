import express from 'express';
import { PrismaClient } from '@prisma/client';
import { validateRequest, schemas } from '../middleware/validation';
import { authenticateToken, requireRole, optionalAuth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all menu items (public)
router.get('/', optionalAuth, async (req: any, res) => {
  try {
    const { category, featured, available } = req.query;
    
    const where: any = {};
    
    if (category && category !== 'all') {
      where.category = category.toUpperCase();
    }
    
    if (featured === 'true') {
      where.isFeatured = true;
    }
    
    if (available !== 'false') {
      where.isAvailable = true;
    }

    const menuItems = await prisma.menuItem.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { category: 'asc' },
        { name: 'asc' }
      ]
    });

    res.json({ menuItems });
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get menu item by ID (public)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await prisma.menuItem.findUnique({
      where: { id }
    });

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ menuItem });
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get menu categories (public)
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await prisma.menuItem.groupBy({
      by: ['category'],
      where: { isAvailable: true },
      _count: {
        id: true
      }
    });

    const categoryList = categories.map(cat => ({
      value: cat.category.toLowerCase(),
      label: cat.category.charAt(0) + cat.category.slice(1).toLowerCase(),
      count: cat._count.id
    }));

    res.json({ categories: categoryList });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create menu item (admin only)
router.post('/', authenticateToken, requireRole(['ADMIN']), validateRequest(schemas.createMenuItem), async (req, res) => {
  try {
    const menuItem = await prisma.menuItem.create({
      data: req.body
    });

    res.status(201).json({
      message: 'Menu item created successfully',
      menuItem
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update menu item (admin only)
router.put('/:id', authenticateToken, requireRole(['ADMIN']), validateRequest(schemas.updateMenuItem), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: 'Menu item updated successfully',
      menuItem
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    console.error('Update menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete menu item (admin only)
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.menuItem.delete({
      where: { id }
    });

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    console.error('Delete menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle menu item availability (admin/staff only)
router.patch('/:id/toggle-availability', authenticateToken, requireRole(['ADMIN', 'STAFF']), async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await prisma.menuItem.findUnique({
      where: { id }
    });

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    const updatedItem = await prisma.menuItem.update({
      where: { id },
      data: { isAvailable: !menuItem.isAvailable }
    });

    res.json({
      message: `Menu item ${updatedItem.isAvailable ? 'enabled' : 'disabled'} successfully`,
      menuItem: updatedItem
    });
  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;