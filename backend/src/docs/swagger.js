const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  failOnErrors: true,
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Service App API',
      version: '1.0.0',
      description: 'A simple service app API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/router/*.js', './src/docs/components.yaml'],
};

const specs = swaggerJsdoc(options);

module.exports = {
    specs,
    swaggerUi,
};
