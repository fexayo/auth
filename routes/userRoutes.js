const { Router } = require('express');
const User = require('../models/user');
const multer = require('multer');

const router = Router();
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      // console.log(file);
      return cb(new Error('File format not accepted'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 3 * 1024 * 1024 }
});

// route to upload user image
router.post('/profile/upload/:id', upload.single('avatar'), async (req, res) => {
  console.log(req.file);
  try {
      const user = await User.findById(req.params.id);
      
      if (!user) {
        console.log('user not found');
      }

      user.avatar = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }

      await user.save();
      res.status(201).send('file uploaded successfully');
    } catch (error) {
      console.log(error);
      res.status(400).send('error uploading file');
    }
  }, (err, req, res, next) => {
    console.log(err.message);
    res.status(400).send(err.message);

    // next();
});

// route to render the profile page
router.get('/profile/upload', (req, res)=> {
  res.render('profile');
});

// route to serve images
router.get('/profile/images/:id', async (req, res) => {
  const user = await User.findById(req.params.id);

  res.set('Content-Type', user.avatar.contentType);
  res.send(user.avatar.data);
});

module.exports = router;

