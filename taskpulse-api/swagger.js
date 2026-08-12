const swaggerAutogen = require("swagger-autogen")({ openapi: '3.0.0' });

const doc = {
  info: {
    title: "TaskPulse API",
    description: "Endpoints for both Local and Live testing",
  },
  // Host aur schemes ki jagah servers array ka use karein
  servers: [
    {
      url: "http://localhost:5000/api",
      description: "Local Development Server",
    },
    
  ],
};

const outputFile = "./swagger-output.json"; // Jahan JSON save hoga
const endpointsFiles = ["./app/routers/indexRoute.js"]; // Aapke routes files

// Isse run karne par json file create hogi
swaggerAutogen(outputFile, endpointsFiles, doc);
