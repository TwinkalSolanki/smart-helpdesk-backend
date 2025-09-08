const mongoose = require('mongoose');
const { NotificationType, UserRole  } = require('../enum');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userRole: {
        type: String,
        enum: UserRole.enums.map(e => e.key),
        required: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { 
        type: String, 
        enum: NotificationType.enums.map(e => e.key),
        default: NotificationType.Info.key
     },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);