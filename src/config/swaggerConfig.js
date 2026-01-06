import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskOBucket API Documentation',
      version: '1.0.0',
      description:
        'REST API documentation for TaskOBucket backend built with Express.js and MongoDB',
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:7000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },

  apis: ['./src/swagger/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
