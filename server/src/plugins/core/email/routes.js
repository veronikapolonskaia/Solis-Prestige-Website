const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth');
const { body, validationResult } = require('express-validator');

// Get all email templates
router.get('/templates', auth, async (req, res) => {
  try {
    const pluginManager = req.app.get('pluginManager');
    const emailPlugin = pluginManager.plugins.get('email');
    
    if (!emailPlugin) {
      return res.status(404).json({ message: 'Email plugin not found' });
    }

    const templates = Array.from(emailPlugin.templates.keys()).map(name => ({
      name,
      description: getTemplateDescription(name),
    }));

    res.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error('Error getting email templates:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Send test email
router.post('/send-test', auth, [
  body('to').isEmail().withMessage('Valid email is required'),
  body('template').notEmpty().withMessage('Template name is required'),
  body('data').isObject().withMessage('Data must be an object'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { to, template, data } = req.body;
    const pluginManager = req.app.get('pluginManager');
    const emailPlugin = pluginManager.plugins.get('email');
    
    if (!emailPlugin) {
      return res.status(404).json({ message: 'Email plugin not found' });
    }

    await emailPlugin.sendEmail(to, 'Test Email', template, data);
    
    res.json({
      success: true,
      message: 'Test email sent successfully',
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ message: 'Failed to send test email' });
  }
});

// Send welcome email
router.post('/send-welcome', auth, [
  body('userId').isInt().withMessage('Valid user ID is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.body;
    const { User } = req.app.get('db').models;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const pluginManager = req.app.get('pluginManager');
    const emailPlugin = pluginManager.plugins.get('email');
    
    await emailPlugin.sendWelcomeEmail(user);
    
    res.json({
      success: true,
      message: 'Welcome email sent successfully',
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    res.status(500).json({ message: 'Failed to send welcome email' });
  }
});

// Send order confirmation email
router.post('/send-order-confirmation', auth, [
  body('orderId').isInt().withMessage('Valid order ID is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId } = req.body;
    const { Order, User } = req.app.get('db').models;
    
    const order = await Order.findByPk(orderId, {
      include: [{ model: User, as: 'user' }],
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const pluginManager = req.app.get('pluginManager');
    const emailPlugin = pluginManager.plugins.get('email');
    
    await emailPlugin.sendOrderConfirmation(order, order.user);
    
    res.json({
      success: true,
      message: 'Order confirmation email sent successfully',
    });
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    res.status(500).json({ message: 'Failed to send order confirmation email' });
  }
});

// Send password reset email
router.post('/send-password-reset', [
  body('email').isEmail().withMessage('Valid email is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const { User } = req.app.get('db').models;
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    const pluginManager = req.app.get('pluginManager');
    const emailPlugin = pluginManager.plugins.get('email');
    
    await emailPlugin.sendPasswordReset(user, resetToken);
    
    res.json({
      success: true,
      message: 'Password reset email sent successfully',
    });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ message: 'Failed to send password reset email' });
  }
});

// Send order status update email
router.post('/send-order-status-update', auth, [
  body('orderId').isInt().withMessage('Valid order ID is required'),
  body('status').notEmpty().withMessage('Status is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId, status } = req.body;
    const { Order, User } = req.app.get('db').models;
    
    const order = await Order.findByPk(orderId, {
      include: [{ model: User, as: 'user' }],
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const pluginManager = req.app.get('pluginManager');
    const emailPlugin = pluginManager.plugins.get('email');
    
    await emailPlugin.sendOrderStatusUpdate(order, order.user, status);
    
    res.json({
      success: true,
      message: 'Order status update email sent successfully',
    });
  } catch (error) {
    console.error('Error sending order status update email:', error);
    res.status(500).json({ message: 'Failed to send order status update email' });
  }
});

// Get email configuration
router.get('/config', auth, async (req, res) => {
  try {
    const config = {
      smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT === '465',
        user: process.env.SMTP_USER,
      },
      from: {
        name: process.env.FROM_NAME,
        email: process.env.FROM_EMAIL,
      },
      adminEmails: process.env.ADMIN_EMAILS?.split(',') || [process.env.ADMIN_EMAIL],
    };

    res.json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error('Error getting email config:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper function to get template descriptions
function getTemplateDescription(templateName) {
  const descriptions = {
    'welcome': 'Welcome email sent to new users',
    'order-confirmation': 'Order confirmation email with order details',
    'password-reset': 'Password reset email with reset link',
    'low-stock-alert': 'Low stock alert sent to administrators',
    'order-status-update': 'Order status update notification',
  };
  
  return descriptions[templateName] || 'Email template';
}

module.exports = router; 