const express = require('express');
const app = express();
const morgan = require('morgan');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev'));
app.use(express.json()); // Needed if you're handling POST/PUT bodies

// Routes
const readingsRoutes = require('./routes/readingsRoutes');
const alarmsRoutes = require('./routes/alarmsRoutes');
const alarmTypesRoutes = require('./routes/alarmTypesRoutes');
const devicesRoutes = require('./routes/devicesRoutes');
const healthRoutes = require('./routes/healthRoutes');
const locationsRoutes = require('./routes/locationsRoutes');

// Use routes with API prefixes
app.use('/api/readings', readingsRoutes);
app.use('/api/alarms', alarmsRoutes);
app.use('/api/alarm-types', alarmTypesRoutes);
app.use('/api/devices', devicesRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/locations', locationsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello from Sensor API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
