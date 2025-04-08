let express = require('express');
let router = express.Router();
const authController = require('../controllers/authController');

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/signin', authController.signin_get);
router.post('/signin', authController.signin_post);
router.get('/signout', authController.signout_get);

module.exports = router;