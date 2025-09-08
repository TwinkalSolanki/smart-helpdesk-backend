const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { success, error } = require('../constant');

exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const totalTickets = await Ticket.countDocuments({ createdBy: userId });
        const openTickets = await Ticket.countDocuments({ createdBy: userId, status: 'Open' });
        const inProgressTickets = await Ticket.countDocuments({ createdBy: userId, status: 'InProgress' });
        const resolvedTickets = await Ticket.countDocuments({ createdBy: userId, status: 'Resolved' });
        
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        const ticketsThisMonth = await Ticket.countDocuments({ createdBy: userId, createdAt: { $gte: startOfMonth, $lte: endOfMonth } });

        const avgResolution = await Ticket.aggregate([
            { $match: { createdBy: userId, status: 'Resolved', resolvedAt: { $exists: true}}},
            { $project: { resolutionTIme: { $subtract: ['$resolvedAt', '$createdAt'] } } },
            { $group: { _id: null, avgResolutionTimeMs: { $avg: '$resolutionTIme' } } },
        ]);

        const avgResolutionTime = avgResolution.length > 0 ? (avgResolution[0].avgResolutionTimeMs / (1000 * 60 * 60)).toFixed(2) : null; // in hours


        const stats = {
            totalTickets,
            openTickets,
            inProgressTickets,
            resolvedTickets,
            avgResolutionTime,
            userSatisfactionScore: 0,   // do it later when feedback module is done
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
        const userId = req.user._id;
        const limit = parseInt(req.query.limit) || 10;
        const tickets = await Ticket.find({
            $or: [
                { createdBy: userId },
                { assignee: userId }
            ]
        })
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

exports.getTicketChartData = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const period = req.query.period || '7d';
        const days = parseInt(period.replace('d', ''), 10) || 7;

        const now = new Date();
        const startDate = new Date();
        startDate.setDate(now.getDate() - days);

        // Initialize labels for each day
        const labels = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(now.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric'}));
        }

        const createdData = await Ticket.aggregate([
            { $match: { 
                  createdAt: { $gte: startDate },
                  $or: [{ createdBy: userId }, { assignee: userId }]
              }
            },
            { 
              $group: { 
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }},
                count: { $sum: 1 }
              }
            }
        ]);

        const resolvedData = await Ticket.aggregate([
            { $match: { 
                  resolvedAt: { $gte: startDate },
                  $or: [{ createdBy: userId }, { assignee: userId }]
              }
            },
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$resolvedAt' } },
                count: { $sum: 1 }
              }
            }
        ]);

        const createdMap = Object.fromEntries(createdData.map(d => [d._id, d.count]));
        const resolvedMap = Object.fromEntries(resolvedData.map(d => [d._id, d.count]));

        const createdCounts = [];
        const resolvedCounts = [];

        for( let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(now.getDate() - i);
            const key = date.toISOString().split('T')[0];    //YYYY-MM-DD
            createdCounts.push(createdMap[key] || 0);
            resolvedCounts.push(resolvedMap[key] || 0);
        }

        res.json({
            labels,
            datasets: [
                { labels: 'Created', data: createdCounts },
                { labels: 'Resolved', data: resolvedCounts }
            ]
        });
    } catch (err) {
        console.log('Error Fetching ticket chart data:', err)
        res.status()(500).json({ success: false, message: err.message || error.SERVER_ERROR });
    }
}
