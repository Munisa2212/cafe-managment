const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Cafe-Management API",
        version: "1.0.0",
        description: "Cafe-Management system.",
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          User: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              name: { type: "string", example: "John Doe" },
              email: { type: "string", example: "johndoe@example.com" },
              role: { type: "string", enum: ["customer", "user", "staff"], example: "customer" },
              password: { type: "string", example: "securepassword" },
              money: { type: "number", example: 100.50 },
            },
          },
          OrderItem: {
            type: "object",
            properties: {
              product_id: { type: "integer" },
              count: { type: "integer" },
              price: { type: "number" },
            },
          },
          Order: {
            type: "object",
            properties: {
              id: { type: "integer" },
              user_id: { type: "integer" },
              price: { type: "number" },
            },
          },
        },
      },
      security: [
        {
          BearerAuth: [],
        },
      ],
    },
    apis: ["./routes/*.js"],
  };

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger docs available at http://localhost:3000/api-docs");
};

module.exports = swaggerDocs;