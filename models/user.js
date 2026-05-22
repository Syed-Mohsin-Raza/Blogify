const { Schema, model } = require('mongoose');
const crypto = require('crypto');

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  salt: {
    type: String,
  },
  password: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: '/images/default.png'
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER'
  }
}, { timestamps: true });

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.createHmac('sha512', salt).update(user.password).digest('hex');
    this.salt = salt;
    this.password = hashedPassword;
    next();
});

userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }
    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvidedPassword = crypto.createHmac('sha512', user.salt).update(password).digest('hex');
    if (hashedPassword === userProvidedPassword) {
        const token = require('../services/authentication').generateToken(user);
        return token;    
    } else {
        throw new Error('Invalid password');
    }  
});

module.exports = model('User', userSchema);