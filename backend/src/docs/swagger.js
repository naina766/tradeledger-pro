const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'TradeLedger Pro – Secure Trade Analytics Platform API',
      version: '1.0.0',
      description: 'API Documentation for TradeLedger Pro - An internship-grade SaaS backend featuring JWT rotations, RBAC, analytics aggregates, and Docker orchestrations.',
      contact: {
        name: 'Developer support',
        email: 'support@tradeledgerpro.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Local Development Server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Trade: {
          type: 'object',
          required: ['asset_name', 'asset_category', 'trade_type', 'entry_price', 'quantity'],
          properties: {
            id: { type: 'integer' },
            asset_name: { type: 'string' },
            asset_category: { type: 'string', enum: ['CRYPTO', 'STOCK', 'FOREX', 'COMMODITY'] },
            exchange: { type: 'string' },
            trade_type: { type: 'string', enum: ['BUY', 'SELL'] },
            status: { type: 'string', enum: ['OPEN', 'CLOSED'] },
            entry_price: { type: 'number' },
            exit_price: { type: 'number' },
            quantity: { type: 'number' },
            profit_loss: { type: 'number' },
            trade_date: { type: 'string', format: 'date-time' },
            notes: { type: 'string' },
            user_id: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    paths: {
      '/auth/register': {
        post: {
          summary: 'Register a new user account',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password', 'confirmPassword'],
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                    confirmPassword: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'User created and logged in successfully' },
            400: { description: 'Validation error' }
          }
        }
      },
      '/auth/login': {
        post: {
          summary: 'Log in to user account',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Authenticated successfully. Returns access + refresh tokens.' },
            401: { description: 'Invalid email or password' }
          }
        }
      },
      '/auth/refresh': {
        post: {
          summary: 'Rotate expired access tokens using a refresh token',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['refreshToken'],
                  properties: {
                    refreshToken: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Tokens rotated successfully' },
            403: { description: 'Invalid or expired refresh token' }
          }
        }
      },
      '/auth/logout': {
        post: {
          summary: 'Log out and invalidate tokens',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['refreshToken'],
                  properties: {
                    refreshToken: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Logged out successfully' }
          }
        }
      },
      '/auth/profile': {
        get: {
          summary: 'Fetch authenticated user details',
          tags: ['Authentication'],
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: 'Profile details returned' },
            401: { description: 'Unauthorized access' }
          }
        },
        put: {
          summary: 'Update user name or email',
          tags: ['Authentication'],
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email'],
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Metadata updated successfully' }
          }
        }
      },
      '/auth/profile/password': {
        put: {
          summary: 'Change password credential',
          tags: ['Authentication'],
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['currentPassword', 'newPassword', 'confirmNewPassword'],
                  properties: {
                    currentPassword: { type: 'string' },
                    newPassword: { type: 'string' },
                    confirmNewPassword: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Password changed successfully' },
            400: { description: 'Current password incorrect or validation mismatch' }
          }
        }
      },
      '/trades': {
        post: {
          summary: 'Log a new trade execution',
          tags: ['Trades'],
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['asset_name', 'asset_category', 'trade_type', 'entry_price', 'quantity'],
                  properties: {
                    asset_name: { type: 'string' },
                    asset_category: { type: 'string', enum: ['CRYPTO', 'STOCK', 'FOREX', 'COMMODITY'] },
                    exchange: { type: 'string' },
                    trade_type: { type: 'string', enum: ['BUY', 'SELL'] },
                    status: { type: 'string', enum: ['OPEN', 'CLOSED'] },
                    entry_price: { type: 'number' },
                    exit_price: { type: 'number' },
                    quantity: { type: 'number' },
                    notes: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Trade recorded successfully' }
          }
        },
        get: {
          summary: 'Search and read paginated trade logs',
          tags: ['Trades'],
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'trade_type', in: 'query', schema: { type: 'string', enum: ['BUY', 'SELL'] } },
            { name: 'asset_category', in: 'query', schema: { type: 'string', enum: ['CRYPTO', 'STOCK', 'FOREX', 'COMMODITY'] } },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['OPEN', 'CLOSED'] } },
            { name: 'sort', in: 'query', schema: { type: 'string', default: 'trade_date' } },
            { name: 'order', in: 'query', schema: { type: 'string', default: 'DESC' } }
          ],
          responses: {
            200: { description: 'Array of trade logs with pagination metadata' }
          }
        }
      },
      '/trades/analytics': {
        get: {
          summary: 'Retrieve user trade analytics metrics',
          tags: ['Trades'],
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: 'KPI numbers including Win-rate, Net Profit, and Best Asset Ticker' }
          }
        }
      },
      '/trades/{id}': {
        get: {
          summary: 'Fetch detailed information of a trade log',
          tags: ['Trades'],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Details returned' },
            404: { description: 'Trade not found' }
          }
        },
        put: {
          summary: 'Edit details of an existing trade record',
          tags: ['Trades'],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    asset_name: { type: 'string' },
                    asset_category: { type: 'string', enum: ['CRYPTO', 'STOCK', 'FOREX', 'COMMODITY'] },
                    exchange: { type: 'string' },
                    trade_type: { type: 'string', enum: ['BUY', 'SELL'] },
                    status: { type: 'string', enum: ['OPEN', 'CLOSED'] },
                    entry_price: { type: 'number' },
                    exit_price: { type: 'number' },
                    quantity: { type: 'number' },
                    notes: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Trade updated successfully' }
          }
        },
        delete: {
          summary: 'Delete trade from registry',
          tags: ['Trades'],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Trade deleted successfully' }
          }
        }
      },
      '/admin/users': {
        get: {
          summary: 'List all registered platform accounts (Admin Only)',
          tags: ['Administration'],
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: 'Accounts list' }
          }
        }
      },
      '/admin/trades': {
        get: {
          summary: 'Search and read system-wide trade logs (Admin Only)',
          tags: ['Administration'],
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } }
          ],
          responses: {
            200: { description: 'Array of platform trades' }
          }
        }
      },
      '/admin/analytics': {
        get: {
          summary: 'Retrieve global system analytics indicators (Admin Only)',
          tags: ['Administration'],
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: 'Global metrics summary' }
          }
        }
      },
      '/admin/trades/{id}': {
        delete: {
          summary: 'Force delete any trade record (Admin Only)',
          tags: ['Administration'],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Record deleted administratively' }
          }
        }
      }
    }
  },
  apis: [] // Explicitly bypass empty JSDoc comment file scans
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
  swaggerUi,
  swaggerDocs
};
