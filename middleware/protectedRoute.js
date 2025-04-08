const User = require("../models/user");
const jwt = require('jsonwebtoken');

const currentUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
      jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
          if (err) {
            res.locals.user = null;
            next();        
          } else {
            console.log(decodedToken);
              const { id } = decodedToken
              const user = await User.findById(id);
              console.log(user);
              res.locals.user = user;
              next();
          }
      })
    } else {
      res.locals.user = null;
      next();
    }
}

// Protecting '/cakes/' Route
const protectedRoute = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
        if (err) {
          res.redirect('/signin')
          next();        
        } else {
            next();
        }
    })
  } else {
    res.redirect('/signin');
    next();
  }
};

module.exports = { protectedRoute, currentUser };