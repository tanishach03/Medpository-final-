require('dotenv').config();
const express = require("express");
const app = express();
const methodOverRide = require("method-override");
const connectDB = require("./utils/db");
const cors = require('cors')
app.use(cors())

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(methodOverRide("_method"));

// Define Routes
app.use('/api/user', require('./routes/User'))
app.use('/api/document', require('./routes/Document'))
app.use('/api/doctor', require('./routes/Doctor'))

// app.use('/api/user', require('./routes/User'))
// app.use('/api/user', require('./routes/User'))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
