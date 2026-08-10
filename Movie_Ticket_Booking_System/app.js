// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const path = require('path');
// const dbCon = require('./app/config/db');
// const SwaggerDoc = require('./swagger-output.json');
// const Swagger = require('swagger-ui-express');


// const app = express();
// dbCon();
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Routes mapping
// app.use('/api', require('./app/routes/indexRoutes'))

// app.use('/api-docs', Swagger.serve, Swagger.setup(SwaggerDoc));


// mongoose.connect(process.env.MONGODB_URL)
//   .then(() => app.listen(process.env.PORT || 5000, () => console.log('Server & DB running!')))
//   .catch(err => console.log(err));




require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dbCon = require('./app/config/db');
const Swagger = require('swagger-ui-express');
const fs = require('fs');

const app = express();
dbCon();

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes mapping
app.use('/api', require('./app/routes/indexRoutes'));

// Safe Swagger parsing initialization block
try {
  const rawSwaggerDoc = fs.readFileSync(path.join(__dirname, 'swagger-output.json'), 'utf8');
  const SwaggerDoc = JSON.parse(rawSwaggerDoc || '{}');
  app.use('/api-docs', Swagger.serve, Swagger.setup(SwaggerDoc));
} catch (err) {
  console.log("⚠️ Swagger document parsing failed or empty. Run 'node Swagger.js' first.");
}

// Unified Database connection sequence fallback
mongoose.connect(process.env.MONGODB_URL || process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT || 5000, () => console.log('🚀 Server & DB running smoothly on Port 5000!')))
  .catch(err => console.error("Database Connection Failure: ", err));