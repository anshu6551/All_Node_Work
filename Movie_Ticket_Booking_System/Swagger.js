// const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

// const doc = {
//     info: {
//         title: "CRUD API",
//         description: "Product CRUD using Winston and Swagger API"
//     },
//     servers: [
//         {
//             url: "http://localhost:5000/api",
//             description: "Local development server"
//         }
//     ]
// };

// const outputFile = "./swagger-output.json"; 
// const endPointsFiles = ["./app/routes/indexRoutes"]; // Double check this path matches your folder structure!

// swaggerAutogen(outputFile, endPointsFiles, doc).then(() => {
//     console.log("⚡ Swagger documentation successfully generated!");
// });


// Open Swagger.js
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });
const fs = require('fs');
const path = require('path');

const doc = {
  info: {
    title: "Movie Ticket Booking System API",
    description: "Backend REST endpoints managed with Winston Logger and Swagger UI documentation"
  },
  servers: [
    {
      url: "http://localhost:5000/api",
      description: "Local development server"
    }
  ],
}

const outputFile = "./swagger-output.json"; 
const endPointsFiles = ["./app/routes/indexRoutes.js"]; 

swaggerAutogen(outputFile, endPointsFiles, doc)