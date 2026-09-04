const express = require("express");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Single File Express API',
      version: '1.0.0',
      description: 'API documented directly inside server.js',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Local development server',
      },
    ],
  },
  apis: ['./app.js'],
};

app.use(express.json());

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
* @openapi
* /user:
*   get:
*     summary: Retrieve a user object
*     description: Returns details for a dummy user.
*     responses:
*       200:
*         description: A user object.
*/
app.get("/user", (req, res) => {
    res.send({ "firstname": "Pransh", "lastname": "Gupta" });
});

/**
* @openapi
* /test:
*   get:
*     summary: Retrieve test string
*     description: Returns a confirmation message from /test route.
*     responses:
*       200:
*         description: Plain text response.
*/
app.get("/test", (req, res) => {
    res.send("Hello from the server /test!");
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is successfully listening on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
