const mongoose = require('mongoose');
const {Schema} = mongoose;
const { isEmail, isStrongPassword } = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    //   minLength: [8, 'Minimum password length required is 8 characters'],
      validate: [isStrongPassword, 'Format not accepted, Try a new password']
    },
    avatar: {
      data: Buffer,
      contentType: String
    }
}, {timestamps: true});

// Mongoose Hooks
// after event
// userSchema.post('save',(doc, next) => {
//     console.log('an after event has occured');
//     console.log(doc);

//     next();
// });

// before event
userSchema.pre('save', async function(next) {
const salt = await bcrypt.genSalt(10); // generating salt
this.password = await bcrypt.hash(this.password, salt); // hashing password

next();
});

// Static method to login user
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({email});

  if (user) {
    const auth = await bcrypt.compare(password, user.password);

      if (auth) {
        return user;
    }
    throw Error('Incorrect password');
  }
  throw Error('Incorrect email');
};

const User = mongoose.model('User', userSchema);

module.exports = User;