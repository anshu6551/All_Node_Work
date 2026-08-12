const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });
const fs = require('fs');
const path = require('path');

const doc = {
  info: {
    title: "Institute Mnagement System API",
    description: "Backend REST endpoints managed with Winston Logger and Swagger UI documentation"
  },
  servers: [
    {
      url: "http://localhost:5000/api",
      description: "Local development server"
    }
  ],
  // 🔐 Configures the standard global Bearer Security Scheme
  
};

const outputFile = "./swagger-output.json"; 
const endPointsFiles = ["./app/routes/indexRoute.js"]; 

swaggerAutogen(outputFile, endPointsFiles, doc)
  
  
