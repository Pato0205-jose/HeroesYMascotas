import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const router = express.Router();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Superhéroes y Mascotas',
      version: '1.0.0',
      description: 'Documentación de la API para superhéroes, mascotas y adopciones',
    },
    servers: [
      {
        url: 'http://localhost:3001',
      },
    ],
    tags: [
      { name: 'Héroes', description: 'Operaciones sobre superhéroes' },
      { name: 'Mascotas', description: 'Operaciones sobre mascotas' },
      { name: 'Adopciones', description: 'Operaciones sobre adopciones' },
      { name: 'MascotaVirtual', description: 'Operaciones sobre mascotas virtuales' },
    ],
    components: {
      securitySchemes: {
        heroIdAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-hero-id',
          description: 'ID numérico del héroe autenticado',
        },
      },
    },
    security: [
      {
        heroIdAuth: [],
      },
    ],
  },
  apis: ['./controllers/*.js'],
};

const specs = swaggerJsdoc(options);

router.use('/', swaggerUi.serve, swaggerUi.setup(specs));

export default router; 