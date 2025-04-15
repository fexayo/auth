const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const mongoose = require('mongoose');
const cookie = require('cookie-parser');
const { protectedRoute, currentUser } = require('./middleware/protectedRoute');
const cors = require('cors');
const rateLimiter = require('./middleware/rateLimiter');

// to config env - it is used to store sensitive data
require('dotenv').config();

// Middlewares
app.use('/public', express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookie());
app.use(rateLimiter);

// const allowedOrigins = [
//   'http://localhost:3000',
//   'https://frontend.com'
// ];

const allowedOrigins = process.env.CLIENT_URL;

app.use(cors({ 
  origin: allowedOrigins, // allowing a specific origin
  credentials: true // for cookies
}));

//to set view engine
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;

// to connect to MondoDB
mongoose.connect(process.env.MONGO_URI)
.then((result) => {app.listen(PORT, '0.0.0.0', () => {
    console.log('Connected to Backend')
  });
})

//routes 
// the index and 404 page will be on app.js
app.get('*', currentUser);

app.get('/',(req, res) => {
  res.render('index');
});

app.get('/cakes', protectedRoute, (req, res) => {
  res.render('cakes');
});

app.use(authRoutes);
app.use(userRoutes);

// create a cookie
// app.get('/set-cookies', (req, res) => {
  // res.setHeader('Set-Cookie', 'newCookie2=true');
  // res.send('New cookie created');
//   res.cookie('newCookie3', true, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true });
//   res.send('New cookie created');
// });

// // read cookie
// app.get('/read-cookies', (req, res) => {
//   const cookie = req.headers.cookie;
//   res.send(cookie);
// });

app.use((req, res) => {
  res.status(404).send('404');
});