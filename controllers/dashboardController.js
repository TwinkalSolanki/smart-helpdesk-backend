const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { success, error } = require('../constant');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalTickets = await Ticket.countDocuments();
        const openTickets = await Ticket.countDocuments({ status: 'Open' });
        const inProgressTickets = await Ticket.countDocuments({ status: 'InProgress' });
        const resolvedTickets = await Ticket.countDocuments({ status: 'Resolved' });
        
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        const ticketsThisMonth = await Ticket.countDocuments({ createdAt: { $gte: startOfMonth, $lte: endOfMonth } });

        const stats = {
            totalTickets,
            openTickets,
            inProgressTickets,
            resolvedTickets,
            avgResolutionTime: 24, // Mock data
            userSatisfactionScore: 4.2, // Mock data
            ticketsThisMonth
        };

        res.json({ success: true, data: stats });
    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        res.status(500).json({ success: false, message: err.message || error.SERVER_ERROR });
    }
};

exports.getRecentTickets = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const tickets = await Ticket.find()
            .populate('createdBy', 'name email')
            .populate('assignee', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit);

        res.json({ success: true, data: tickets });
    } catch (err) {
        console.error('Error fetching recent tickets:', err);
        res.status(500).json({ success: false, message: err.message || error.SERVER_ERROR });
    }
};

exports.getTicketsByStatus = async (req, res) => {
    try {
        const statusCounts = await Ticket.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const data = {
            labels: statusCounts.map(item => item._id),
            datasets: [{
                label: 'Tickets by Status',
                data: statusCounts.map(item => item.count),
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0']
            }]
        };

        res.json({ success: true, data });
    } catch (err) {
        console.error('Error fetching tickets by status:', err);
        res.status(500).json({ success: false, message: err.message || error.SERVER_ERROR });
    }
};

exports.getTicketsByPriority = async (req, res) => {
    try {
        const priorityCounts = await Ticket.aggregate([
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);

        const data = {
            labels: priorityCounts.map(item => item._id),
            datasets: [{
                label: 'Tickets by Priority',
                data: priorityCounts.map(item => item.count),
                backgroundColor: ['#ff4757', '#ffa726', '#66bb6a']
            }]
        };

        res.json({ success: true, data });
    } catch (err) {
        console.error('Error fetching tickets by priority:', err);
        res.status(500).json({ success: false, message: err.message || error.SERVER_ERROR });
    }
};

exports.getTicketTrends = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const trends = await Ticket.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const data = {
            labels: trends.map(item => item._id),
            datasets: [{
                label: 'Tickets Created',
                data: trends.map(item => item.count),
                backgroundColor: '#36a2eb'
            }]
        };

        res.json({ success: true, data });
    } catch (err) {
        console.error('Error fetching ticket trends:', err);
        res.status(500).json({ success: false, message: err.message || error.SERVER_ERROR });
    }
};
