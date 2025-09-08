const Notification = require('../models/notification');

function generateTicketNumber(objectId) {
  // Take first 6 characters of ObjectId → short & unique enough
  return objectId.toString().slice(0, 6).toUpperCase();
}

//notification functions
async function createNotification(userId, userRole, template){
    return await Notification.create({
      userId,
      userRole,
      title: template.title,
      message: template.message,
      type: template.type
    });
}

async function markNotificationAsRead(userId, userRole, notificationId) {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, userId, userRole },
      { $set: { read: true } },
      { new: true}
    )
}

async function getUserNotifications(userId, userRole, limit = 10) {
     return await Notification.find({ userId, userRole }).sort({ createdAt: -1}).limit(limit);
}

async function getUnreadNotificationCount(userId, userRole){
    return await Notification.countDocuments({userId, userRole, read: false });
}

module.exports = { generateTicketNumber, createNotification, markNotificationAsRead, getUserNotifications, getUnreadNotificationCount };