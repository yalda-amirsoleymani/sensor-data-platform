const express = require('express');
const app = express();
const morgan = require('morgan');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const { login, requireAuth } = require('./auth');

// Middleware
app.use(morgan('dev'));
app.use(express.json());

// Routes
const readingsRoutes = require('./routes/readingsRoutes');
const alarmsRoutes = require('./routes/alarmsRoutes');
const alarmTypesRoutes = require('./routes/alarmTypesRoutes');
const devicesRoutes = require('./routes/devicesRoutes');
const healthRoutes = require('./routes/healthRoutes');
const locationsRoutes = require('./routes/locationsRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Use routes with API prefixes
app.use('/api/readings', readingsRoutes);
app.use('/api/alarms', alarmsRoutes);
app.use('/api/alarm-types', alarmTypesRoutes);
app.use('/api/devices', devicesRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello from Sensor API');
});

// only start the server if not in test
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;




