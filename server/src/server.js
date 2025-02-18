const express = require('express');
const app = express();
const apiRoutes = require('./routes/api');

// Routes
app.use('/api', apiRoutes);

// ... rest of the code ... 