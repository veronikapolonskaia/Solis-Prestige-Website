const PluginBase = require('../../PluginBase');
const { Op } = require('sequelize');

class SearchPlugin extends PluginBase {
  constructor() {
    super('search', '1.0.0');
    this.searchIndex = new Map();
  }

  async initialize(app, db) {
    super.initialize(app, db);
    
    // Build search index
    await this.buildSearchIndex();
    
    console.log('Search Plugin initialized');
  }

  async buildSearchIndex() {
    try {
      const { Product, Category } = this.db.models;
      
      // Get all products with categories
      const products = await Product.findAll({
        include: [{ model: Category, as: 'category' }],
        where: { isActive: true }
      });

      // Build search index
      this.searchIndex.clear();
      
      for (const product of products) {
        const searchTerms = this.extractSearchTerms(product);
        const productData = {
          id: product.id,
          name: product.name,
          description: product.description,
          shortDescription: product.shortDescription,
          sku: product.sku,
          category: product.category?.name || '',
          price: product.price,
          isActive: product.isActive,
          createdAt: product.createdAt
        };

        // Add to search index
        for (const term of searchTerms) {
          if (!this.searchIndex.has(term)) {
            this.searchIndex.set(term, []);
          }
          this.searchIndex.get(term).push(productData);
        }
      }

      console.log(`Search index built with ${this.searchIndex.size} terms`);
    } catch (error) {
      console.error('Error building search index:', error);
    }
  }

  extractSearchTerms(product) {
    const terms = new Set();
    
    // Add product name terms
    const nameWords = product.name.toLowerCase().split(/\s+/);
    nameWords.forEach(word => {
      if (word.length > 2) {
        terms.add(word);
        // Add partial matches
        for (let i = 3; i <= word.length; i++) {
          terms.add(word.substring(0, i));
        }
      }
    });

    // Add SKU
    if (product.sku) {
      terms.add(product.sku.toLowerCase());
    }

    // Add category name
    if (product.category?.name) {
      const categoryWords = product.category.name.toLowerCase().split(/\s+/);
      categoryWords.forEach(word => {
        if (word.length > 2) {
          terms.add(word);
        }
      });
    }

    // Add description keywords (first 10 words)
    if (product.description) {
      const descWords = product.description.toLowerCase().split(/\s+/).slice(0, 10);
      descWords.forEach(word => {
        if (word.length > 3) {
          terms.add(word);
        }
      });
    }

    return Array.from(terms);
  }

  async searchProducts(query, options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        categoryId,
        minPrice,
        maxPrice,
        sortBy = 'relevance',
        sortOrder = 'desc',
        inStock = false
      } = options;

      const { Product, Category, ProductVariant } = this.db.models;
      
      // Build where clause
      const whereClause = {
        isActive: true,
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${query}%`
            }
          },
          {
            description: {
              [Op.iLike]: `%${query}%`
            }
          },
          {
            shortDescription: {
              [Op.iLike]: `%${query}%`
            }
          },
          {
            sku: {
              [Op.iLike]: `%${query}%`
            }
          }
        ]
      };

      // Add category filter
      if (categoryId) {
        whereClause.categoryId = categoryId;
      }

      // Add price filters
      if (minPrice !== undefined) {
        whereClause.price = {
          ...whereClause.price,
          [Op.gte]: minPrice
        };
      }

      if (maxPrice !== undefined) {
        whereClause.price = {
          ...whereClause.price,
          [Op.lte]: maxPrice
        };
      }

      // Add stock filter
      if (inStock) {
        whereClause.quantity = {
          [Op.gt]: 0
        };
      }

      // Build order clause
      let orderClause = [];
      switch (sortBy) {
        case 'price':
          orderClause.push(['price', sortOrder.toUpperCase()]);
          break;
        case 'name':
          orderClause.push(['name', sortOrder.toUpperCase()]);
          break;
        case 'createdAt':
          orderClause.push(['createdAt', sortOrder.toUpperCase()]);
          break;
        case 'relevance':
        default:
          // For relevance, we'll use a simple approach
          // In a real implementation, you might use full-text search or external search engine
          orderClause.push(['name', 'ASC']);
          break;
      }

      // Add secondary sort
      orderClause.push(['id', 'DESC']);

      // Execute search
      const { count, rows } = await Product.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'slug']
          },
          {
            model: ProductVariant,
            as: 'variants',
            attributes: ['id', 'name', 'price', 'quantity']
          }
        ],
        order: orderClause,
        limit,
        offset: (page - 1) * limit,
        distinct: true
      });

      // Calculate relevance scores (simple implementation)
      const productsWithScores = rows.map(product => {
        const score = this.calculateRelevanceScore(product, query);
        return {
          ...product.toJSON(),
          relevanceScore: score
        };
      });

      // Sort by relevance if that's the sort method
      if (sortBy === 'relevance') {
        productsWithScores.sort((a, b) => b.relevanceScore - a.relevanceScore);
      }

      return {
        products: productsWithScores,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  calculateRelevanceScore(product, query) {
    let score = 0;
    const queryLower = query.toLowerCase();

    // Exact name match
    if (product.name.toLowerCase().includes(queryLower)) {
      score += 10;
    }

    // SKU match
    if (product.sku && product.sku.toLowerCase().includes(queryLower)) {
      score += 8;
    }

    // Description match
    if (product.description && product.description.toLowerCase().includes(queryLower)) {
      score += 5;
    }

    // Short description match
    if (product.shortDescription && product.shortDescription.toLowerCase().includes(queryLower)) {
      score += 6;
    }

    // Category match
    if (product.category && product.category.name.toLowerCase().includes(queryLower)) {
      score += 4;
    }

    // Word boundary matches (higher score for word boundaries)
    const words = queryLower.split(/\s+/);
    words.forEach(word => {
      if (word.length > 2) {
        const regex = new RegExp(`\\b${word}`, 'i');
        if (regex.test(product.name)) {
          score += 3;
        }
        if (product.description && regex.test(product.description)) {
          score += 2;
        }
      }
    });

    return score;
  }

  async getSearchSuggestions(query, limit = 5) {
    try {
      const suggestions = new Set();
      const queryLower = query.toLowerCase();

      // Search in product names
      const { Product } = this.db.models;
      const products = await Product.findAll({
        where: {
          isActive: true,
          name: {
            [Op.iLike]: `%${query}%`
          }
        },
        attributes: ['name'],
        limit: 10
      });

      products.forEach(product => {
        const name = product.name;
        const words = name.toLowerCase().split(/\s+/);
        
        // Find words that start with the query
        words.forEach(word => {
          if (word.startsWith(queryLower) && word.length > queryLower.length) {
            suggestions.add(word);
          }
        });
      });

      // Search in categories
      const { Category } = this.db.models;
      const categories = await Category.findAll({
        where: {
          isActive: true,
          name: {
            [Op.iLike]: `%${query}%`
          }
        },
        attributes: ['name'],
        limit: 5
      });

      categories.forEach(category => {
        const words = category.name.toLowerCase().split(/\s+/);
        words.forEach(word => {
          if (word.startsWith(queryLower) && word.length > queryLower.length) {
            suggestions.add(word);
          }
        });
      });

      return Array.from(suggestions).slice(0, limit);
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return [];
    }
  }

  async rebuildSearchIndex() {
    await this.buildSearchIndex();
  }

  getRoutes() {
    return [{
      path: '/api/search',
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

module.exports = SearchPlugin; 