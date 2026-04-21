const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MERN Intern API",
      version: "1.0.0",
      description: "Scalable REST API with Auth & Role-Based Access Control",
    },
    servers: [{ url: "https://to-do-list-utvi.onrender.com", description: "Development Server" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options);