const PluginBase = require('../../PluginBase');
const { DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs').promises;

class SEOPlugin extends PluginBase {
  constructor() {
    super('seo', '1.0.0');
    this.dependencies = ['products', 'categories'];
  }

  async initialize(app, db) {
    super.initialize(app, db);
    this.SEOMeta = this.createSEOMetaModel(db);
    this.Sitemap = this.createSitemapModel(db);
    
    // Force sync to create tables with proper structure
    await this.SEOMeta.sync({ force: false });
    await this.Sitemap.sync({ force: false });
    
    const seoRoutes = require('./routes');
    app.use('/api/seo', seoRoutes);
    
    // Generate sitemap on startup
    await this.generateSitemap();
    console.log('SEO Plugin initialized');
  }

  createSEOMetaModel(db) {
    return db.define('SEOMeta', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      pageType: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Type of page (product, category, home, etc.)'
      },
      pageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID of the specific page (product ID, category ID, etc.)'
      },
      title: {
        type: DataTypes.STRING(60),
        allowNull: false,
        comment: 'Page title (max 60 characters)'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Meta description (max 160 characters)'
      },
      keywords: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Meta keywords'
      },
      ogTitle: {
        type: DataTypes.STRING(60),
        allowNull: true,
        comment: 'Open Graph title'
      },
      ogDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Open Graph description'
      },
      ogImage: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Open Graph image URL'
      },
      canonicalUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Canonical URL'
      },
      robots: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'index, follow',
        comment: 'Robots meta tag content'
      },
      structuredData: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'JSON-LD structured data'
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      tableName: 'seo_meta',
      timestamps: true,
      indexes: [
        {
          fields: ['pageType', 'pageId']
        }
      ]
    });
  }

  createSitemapModel(db) {
    return db.define('Sitemap', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      priority: {
        type: DataTypes.FLOAT,
        defaultValue: 0.5,
        validate: {
          min: 0.0,
          max: 1.0
        }
      },
      changeFreq: {
        type: DataTypes.ENUM('always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'),
        defaultValue: 'weekly'
      },
      lastModified: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      tableName: 'sitemaps',
      timestamps: true
    });
  }

  async generateMetaTags(pageType, pageId = null, customData = {}) {
    try {
      let meta = await this.SEOMeta.findOne({
        where: { pageType, pageId, isActive: true }
      });

      if (!meta) {
        // Generate default meta tags
        meta = await this.generateDefaultMetaTags(pageType, pageId, customData);
      }

      return {
        title: meta.title,
        description: meta.description,
        keywords: meta.keywords,
        ogTitle: meta.ogTitle || meta.title,
        ogDescription: meta.ogDescription || meta.description,
        ogImage: meta.ogImage,
        canonicalUrl: meta.canonicalUrl,
        robots: meta.robots,
        structuredData: meta.structuredData
      };
    } catch (error) {
      console.error('Error generating meta tags:', error);
      return this.getDefaultMetaTags();
    }
  }

  async generateDefaultMetaTags(pageType, pageId, customData) {
    let title = '';
    let description = '';
    let structuredData = null;

    switch (pageType) {
      case 'home':
        title = customData.siteName || 'Ecommerce Store';
        description = customData.siteDescription || 'Discover amazing products at great prices';
        structuredData = this.generateOrganizationStructuredData(customData);
        break;
      
      case 'product':
        const product = customData.product;
        if (product) {
          title = `${product.name} - ${customData.siteName || 'Ecommerce Store'}`;
          description = product.description?.substring(0, 160) || `Buy ${product.name} at great prices`;
          structuredData = this.generateProductStructuredData(product);
        }
        break;
      
      case 'category':
        const category = customData.category;
        if (category) {
          title = `${category.name} - ${customData.siteName || 'Ecommerce Store'}`;
          description = category.description?.substring(0, 160) || `Browse ${category.name} products`;
        }
        break;
      
      default:
        title = customData.title || 'Ecommerce Store';
        description = customData.description || 'Discover amazing products';
    }

    return await this.SEOMeta.create({
      pageType,
      pageId,
      title,
      description,
      keywords: customData.keywords,
      ogTitle: customData.ogTitle || title,
      ogDescription: customData.ogDescription || description,
      ogImage: customData.ogImage,
      canonicalUrl: customData.canonicalUrl,
      robots: customData.robots || 'index, follow',
      structuredData
    });
  }

  generateProductStructuredData(product) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images?.[0]?.url || '',
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'USD',
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: `${process.env.FRONTEND_URL}/product/${product.id}`
      }
    };
  }

  generateOrganizationStructuredData(customData) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: customData.siteName || 'Ecommerce Store',
      url: process.env.FRONTEND_URL,
      logo: customData.logo || '',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: customData.phone || '',
        contactType: 'customer service'
      }
    };
  }

  getDefaultMetaTags() {
    return {
      title: 'Ecommerce Store',
      description: 'Discover amazing products at great prices',
      keywords: 'ecommerce, online shopping, products',
      ogTitle: 'Ecommerce Store',
      ogDescription: 'Discover amazing products at great prices',
      ogImage: '',
      canonicalUrl: '',
      robots: 'index, follow',
      structuredData: null
    };
  }

  async generateSitemap() {
    try {
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      
      // Clear existing sitemap entries
      await this.Sitemap.destroy({ where: {} });

      // Add static pages
      const staticPages = [
        { url: '/', priority: 1.0, changeFreq: 'daily' },
        { url: '/products', priority: 0.9, changeFreq: 'daily' },
        { url: '/categories', priority: 0.8, changeFreq: 'weekly' },
        { url: '/about', priority: 0.6, changeFreq: 'monthly' },
        { url: '/contact', priority: 0.6, changeFreq: 'monthly' }
      ];

      for (const page of staticPages) {
        await this.Sitemap.create({
          url: `${baseUrl}${page.url}`,
          priority: page.priority,
          changeFreq: page.changeFreq
        });
      }

      // Add product pages
      const Product = this.db.models.Product;
      const products = await Product.findAll({
        where: { isActive: true },
        attributes: ['id', 'slug', 'updatedAt']
      });

      for (const product of products) {
        await this.Sitemap.create({
          url: `${baseUrl}/product/${product.slug || product.id}`,
          priority: 0.8,
          changeFreq: 'weekly',
          lastModified: product.updatedAt
        });
      }

      // Add category pages
      const Category = this.db.models.Category;
      const categories = await Category.findAll({
        where: { isActive: true },
        attributes: ['id', 'slug', 'updatedAt']
      });

      for (const category of categories) {
        await this.Sitemap.create({
          url: `${baseUrl}/category/${category.slug || category.id}`,
          priority: 0.7,
          changeFreq: 'weekly',
          lastModified: category.updatedAt
        });
      }

      console.log('Sitemap generated successfully');
    } catch (error) {
      console.error('Error generating sitemap:', error);
    }
  }

  async getSitemapXML() {
    try {
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const sitemapEntries = await this.Sitemap.findAll({
        where: { isActive: true },
        order: [['priority', 'DESC']]
      });

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

      for (const entry of sitemapEntries) {
        xml += '  <url>\n';
        xml += `    <loc>${entry.url}</loc>\n`;
        xml += `    <lastmod>${entry.lastModified.toISOString()}</lastmod>\n`;
        xml += `    <changefreq>${entry.changeFreq}</changefreq>\n`;
        xml += `    <priority>${entry.priority}</priority>\n`;
        xml += '  </url>\n';
      }

      xml += '</urlset>';
      return xml;
    } catch (error) {
      console.error('Error generating sitemap XML:', error);
      return '';
    }
  }

  async updateMetaTags(pageType, pageId, metaData) {
    try {
      const [meta, created] = await this.SEOMeta.findOrCreate({
        where: { pageType, pageId },
        defaults: metaData
      });

      if (!created) {
        await meta.update(metaData);
      }

      return meta;
    } catch (error) {
      console.error('Error updating meta tags:', error);
      throw error;
    }
  }

  async deleteMetaTags(pageType, pageId) {
    try {
      await this.SEOMeta.destroy({
        where: { pageType, pageId }
      });
    } catch (error) {
      console.error('Error deleting meta tags:', error);
      throw error;
    }
  }

  getRoutes() {
    return require('./routes');
  }

  getMiddleware() {
    return [];
  }

  getModels() {
    return {
      SEOMeta: this.SEOMeta,
      Sitemap: this.Sitemap
    };
  }
}

module.exports = SEOPlugin; 