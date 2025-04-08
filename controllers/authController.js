const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Creating jwt token
let maxAge = 2 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: maxAge });
};

// Handle errors
const handleErrors = (err) => {
    console.log(err);
    // console.log(err.message, err.code, err.errors);
    const errors = { email: '', password: '' };


    // Email Error for Sign In
    if (err.message === 'Incorrect email') {
        errors.email = 'That email does not exist';
    }

    // Password Error for Sign In
    if (err.message === 'Incorrect password') {
        errors.password = 'That password is incorrect';
    }

    // Duplicate key error
    if (err.code === 11000) {
        errors.email = 'Email already exists';
    }

    // validation error
    if(err.message = 'User validation error'){
        console.log(Object.values(err.errors));
        Object.values(err.errors).forEach(({ properties }) => {
          errors[properties.path] = properties.message});
    }

    return errors;
}

module.exports.signup_get = (req, res) => {
    res.render('signup');
    // res.send('sign up page');
};

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    // res.render('index');
    try {
        const result = await User.create({ email, password });
        const token = createToken({ id: result._id });
        res
          .cookie('jwt', token, { maxAge: maxAge * 1000, httpOnly: true } )  // setting cookie
          .status(201)
          .json({result: result._id});
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({errors});
    }

    // User.create(email, password)
    // .then((result) => {res.send('New user created!')})
    // .catch((err) => {
    //   console.log(err);
    //   res.send('Could not create a new user!');
    // })
};

module.exports.signin_get = (req, res) => {
    res.render('signin', {title: 'Signin'});
    // res.send('fex')
};

module.exports.signin_post = async (req, res) => {
    const { email, password } = req.body;

    try {
      const result = await User.login(email, password);
    //   console.log(user);
    const token = createToken({ id: result._id });
    res
      .cookie('jwt', token, { maxAge: maxAge * 1000, httpOnly: true } ) 
      .status(200)
      .json({result: result._id});
    } catch (error) {
      const errors = handleErrors(error);
      res.status(400).json({errors});
    }
};

module.exports.signout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};