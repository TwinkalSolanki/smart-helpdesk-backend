const { error } = require('../constant');
const { markNotificationAsRead, getUserNotifications, getUnreadNotificationCount } = require('../utils/common-function');

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const limit = parseInt(req.query.limit) || 10;

        const notifications = await getUserNotifications(userId, userRole, limit);
        const unreadCount = await getUnreadNotificationCount(userId, userRole);

        res.json({
            success: true,
            data: notifications,
            unreadCount,
            userRole
        });
    } catch (err) {
        console.error("Error fetching notifications:", err);
        res.status(500).json({ success: false, message: err.message || error.SERVER_ERROR });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const notificationId = req.params.id;

        const notification = await markNotificationAsRead(userId, userRole, notificationId);
        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        res.json({ success: true, message: "Notification marked as read" });
    } catch (err) {
        console.error("Error marking notification as read:", err);
        res.status(500).json({ success: false, message: err.message || error.SERVER_ERROR });
    }
};

// exports.getUnreadCount = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const unreadCount = await getUnreadNotificationCount(userId);

//         res.json({ success: true, data: { unreadCount } });
//     } catch (err) {
//         console.error("Error fetching unread count:", err);
//         res.status(500).json({ success: false, message: err.message || error.SERVER_ERROR });
//     }
// };
