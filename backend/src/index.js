const express = require('express');
const passport = require('passport');
require('./config/passport');

const app = express();

// ...existing code...

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

// ...existing code...

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
