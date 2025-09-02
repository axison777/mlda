const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validate, announcementSchemas } = require('../utils/validators');

const prisma = new PrismaClient();

// Get announcements
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userRole = req.user.role.toLowerCase();
    
    const where = {
      isActive: true,
      startDate: { lte: new Date() },
      OR: [
        { endDate: null },
        { endDate: { gte: new Date() } }
      ]
    };

    // Filter by target role if not admin
    if (userRole !== 'admin') {
      where.OR = [
        { targetRole: null },
        { targetRole: req.user.role }
      ];
    }

    const announcements = await prisma.announcement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    res.json({ announcements });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({
      message: 'Error fetching announcements',
      error: error.message
    });
  }
});

// Create announcement (Admin only)
router.post('/', authenticateToken, requireAdmin, validate(announcementSchemas.create), async (req, res) => {
  try {
    const announcement = await prisma.announcement.create({
      data: req.body
    });

    res.status(201).json({
      message: 'Announcement created successfully',
      announcement
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({
      message: 'Error creating announcement',
      error: error.message
    });
  }
});

// Update announcement (Admin only)
router.put('/:id', authenticateToken, requireAdmin, validate(announcementSchemas.update), async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await prisma.announcement.update({
      where: { id },
      data: req.body
    });

    res.json({
      message: 'Announcement updated successfully',
      announcement
    });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({
      message: 'Error updating announcement',
      error: error.message
    });
  }
});

// Delete announcement (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.announcement.delete({
      where: { id }
    });

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({
      message: 'Error deleting announcement',
      error: error.message
    });
  }
});

module.exports = router;