require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const connectDB = require('./app/config/db');
const indexRoute = require('./app/routes/indexRoute');
const { notFound, errorHandler } = require('./app/utils/errorBoundary');
const swaggerSpec = require('./swagger-output.json');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Static file serving for uploaded content (profile pictures, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API docs


app.get('/', (req, res) => {
  res.json({ success: true, message: 'Institute Management System API is running' });
});

// Every feature route is nested under indexRoute, mounted once here
app.use('/api', indexRoute);

// Error boundary (moved into app/utils, wired in directly — not a middleware file)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

module.exports = app;
