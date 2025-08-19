const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

const app = express();

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Passport config
require('./config/passport')(passport);

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // for form submissions
app.use(express.json()); // for JSON bodies (fetch API, axios, etc.)

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,  // still fine for login sessions
  cookie: { secure: false } // okay for localhost
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const tweetRoutes = require('./routes/tweets');
const adminRoutes = require('./routes/admin');
const walletRoutes = require('./routes/wallet');
const claimRoutes = require('./routes/claim');
const transferRoutes = require('./routes/transfer');
const leaderboardRoutes = require("./routes/leaderboard");

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/tweets', tweetRoutes);
app.use('/admin', adminRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use('/wallet', walletRoutes);
app.use('/claim', claimRoutes);
app.use('/transfer', transferRoutes);



// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log(`MOONCHAD server running at http://localhost:${process.env.PORT || 3000}`);
});
