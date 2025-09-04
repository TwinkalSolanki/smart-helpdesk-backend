const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { UserRole } = require('../enum');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true
    },
    phone: { 
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: { 
        type: String, 
        enum: UserRole.enums.map(e => e.key), // Use enum values from UserRole
        default: UserRole.User.key // Default value from UserRole
    }  
}, { timestamps: true });


// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = function(candidate){
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);