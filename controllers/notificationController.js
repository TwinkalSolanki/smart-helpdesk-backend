const User = require('../models/User');
const Ticket = require('../models/Ticket');
const { success, error } = require('../constant');

// Mock notification data - in a real app, you'd have a Notification model
const mockNotifications = [
    {
        id: 1,
        title: 'Ticket Assigned',
        message: 'You have been assigned to ticket #12345',
        type: 'info',
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
        id: 2,
        title: 'Ticket Updated',
        message: 'Ticket #12344 status changed to In Progress',
        type: 'success',
        read: false,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
    },
    {
        id: 3,
        title: 'New Ticket Created',
        message: 'A new ticket has been created and needs attention',
        type: 'warning',
        read: true,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
    },
    {
        id: 4,
        title: 'Ticket Resolved',
        message: 'Your ticket #12340 has been resolved',
        type: 'success',
        read: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    }
];

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 10;
        
        // In a real app, you'd query from a Notification model
        // For now, return mock data filtered by limit
        const notifications = mockNotifications.slice(0, limit);
        
        res.json({ 
            success: true, 
            data: notifications,
            unreadCount: notifications.filter(n => !n.read).length
        });
    } catch (err) {
        console.error('Error fetching notifications:', err);
        res.status(500).json({ success: false, message: err.message || error.SERVER_ERROR });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const notificationId = parseInt(req.params.id);
        
        // In a real app, you'd update the notification in the database
        const notification = mockNotifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
        }
        
        res.json({ 
            success: true, 
            message: 'Notification marked as read'
        });
    } catch (err) {
        console.error('Error marking notification as read:', err);
        res.status(500).json({ success: false, message: err.message || error.SERVER_ERROR });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // In a real app, you'd update all notifications for the user
        mockNotifications.forEach(notification => {
            notification.read = true;
        });
        
        res.json({ 
            success: true, 
            message: 'All notifications marked as read'
        });
    } catch (err) {
        console.error('Error marking all notifications as read:', err);
        res.status(500).json({ success: false, message: err.message || error.SERVER_ERROR });
    }
};

exports.getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // In a real app, you'd count unread notifications from the database
        const unreadCount = mockNotifications.filter(n => !n.read).length;
        
        res.json({ 
            success: true, 
            data: { unreadCount }
        });
    } catch (err) {
        console.error('Error fetching unread count:', err);
        res.status(500).json({ success: false, message: err.message || error.SERVER_ERROR });
    }
};
