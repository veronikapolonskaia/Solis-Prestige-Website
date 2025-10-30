const PluginBase = require('../../PluginBase');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;
const handlebars = require('handlebars');

class EmailPlugin extends PluginBase {
  constructor() {
    super('email', '1.0.0');
    this.transporter = null;
    this.templates = new Map();
    this.templatePath = path.join(__dirname, 'templates');
  }

  async initialize(app, db) {
    super.initialize(app, db);
    
    // Initialize email transporter
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Load email templates
    await this.loadTemplates();
    
    console.log('Email Plugin initialized');
  }

  async loadTemplates() {
    try {
      const templateFiles = await fs.readdir(this.templatePath);
      
      for (const file of templateFiles) {
        if (file.endsWith('.hbs')) {
          const templateName = path.basename(file, '.hbs');
          const templateContent = await fs.readFile(
            path.join(this.templatePath, file),
            'utf8'
          );
          this.templates.set(templateName, handlebars.compile(templateContent));
        }
      }
    } catch (error) {
      console.error('Error loading email templates:', error);
    }
  }

  async sendEmail(to, subject, templateName, data = {}) {
    try {
      const template = this.templates.get(templateName);
      if (!template) {
        throw new Error(`Template ${templateName} not found`);
      }

      const html = template(data);
      
      const mailOptions = {
        from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
        to,
        subject,
        html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  // Predefined email methods
  async sendWelcomeEmail(user) {
    return this.sendEmail(
      user.email,
      'Welcome to Our Store!',
      'welcome',
      {
        name: user.firstName,
        loginUrl: `${process.env.FRONTEND_URL}/login`,
      }
    );
  }

  async sendOrderConfirmation(order, user) {
    return this.sendEmail(
      user.email,
      `Order Confirmation - #${order.orderNumber}`,
      'order-confirmation',
      {
        order,
        user,
        orderUrl: `${process.env.FRONTEND_URL}/orders/${order.id}`,
      }
    );
  }

  async sendPasswordReset(user, resetToken) {
    return this.sendEmail(
      user.email,
      'Password Reset Request',
      'password-reset',
      {
        name: user.firstName,
        resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
      }
    );
  }

  async sendLowStockAlert(product) {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [process.env.ADMIN_EMAIL];
    
    for (const email of adminEmails) {
      await this.sendEmail(
        email,
        'Low Stock Alert',
        'low-stock-alert',
        {
          product,
          productUrl: `${process.env.ADMIN_URL}/products/${product.id}`,
        }
      );
    }
  }

  async sendOrderStatusUpdate(order, user, status) {
    return this.sendEmail(
      user.email,
      `Order Status Update - #${order.orderNumber}`,
      'order-status-update',
      {
        order,
        user,
        status,
        orderUrl: `${process.env.FRONTEND_URL}/orders/${order.id}`,
      }
    );
  }

  getRoutes() {
    return [{
      path: '/api/email',
      router: require('./routes'),
      middleware: []
    }];
  }

  getMiddleware() {
    return [];
  }

  getModels() {
    return {};
  }
}

module.exports = EmailPlugin; 