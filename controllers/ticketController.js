const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { success, error } = require('../constant');
const autoAssignTicket = require('../utils/autoAssignTicket');
const { notifyTicketAssigned, notifyTicketResolved } = require('../utils/notify');

// exports.createTicket = async (req, res) => {
//     try{
//         const TicketData = {
//             title: req.body.title,
//             description: req.body.description,
//             priority: req.body.priority,
//             category: req.body.category,
//             createdBy: req.user.id,
//             // assignee : req.user.id
//         }
//         // const data = { TicketData, createdBy: req.user._id };
//         const ticket = await Ticket.create(TicketData);

//          // Auto-assign based on priority and category
//         const agent = await autoAssignTicket.maybeAutoAssign(ticket);

//         if (agent) {
//             await notifyTicketAssigned(ticket, agent); //  notify after assigning
//         }

//         req.app.get('io').emit('ticketCreated', ticket); // WebSocket event

//         res.status(201).json({ success: true, message: success.TICKET_CREATED, data: ticket });
//     } catch(err) {
//         console.error('Error creating ticket:', err);
//         res.status(500).json({ success: false, message: err.message || error.SERVER_ERROR});
//     }
// }

exports.createTicket = async (req, res) => {
    try {
        const TicketData = {
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority,
            category: req.body.category,
            createdBy: req.user.id,
        };
        const ticket = await Ticket.create(TicketData);

        // Auto-assign based on priority and category
        const agent = await autoAssignTicket.maybeAutoAssign(ticket);

        // Populate assignee's name before sending response
        const populatedTicket = await Ticket.findById(ticket._id)
            .populate('assignee', 'name')
            .populate('createdBy', 'name email phone');

        if (agent) {
            await notifyTicketAssigned(populatedTicket, agent);
        }

        req.app.get('io').emit('ticketCreated', populatedTicket);

        res.status(201).json({
            success: true,
            message: success.TICKET_CREATED,
            data: populatedTicket
        });
    } catch (err) {
        console.error('Error creating ticket:', err);
        res.status(500).json({ success: false, message: err.message || error.SERVER_ERROR });
    }
};

exports.getAllTicket = async (req, res) => {
    try {
        const tickets = await Ticket.find().populate('assignee', 'name').populate('createdBy', 'name email phone');
        res.json({ success: true, data: tickets, total: tickets.length });
    } catch (err) {
        console.error('Error listing tickets:', err);
        res.status(500).json({ success: false, message: err.message || error.SERVER_ERROR });
    }
}

exports.assignTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if(!ticket) {
            return res.status(404).json({ success: false, message: error.TICKET_NOT_FOUND });
        }
        ticket.assignee = req.body.assignee;
        await ticket.save();

         const resData = await Ticket.findById(ticket._id).populate('assignee', 'name').populate('createdBy', 'name email phone');
        req.app.get('io').emit('ticketAssigned', resData);

        res.json({ success: true, message: success.TICKET_ASSIGNED, data: resData });
    } catch (err) {
        console.error('Error assigning ticket:', err);
        res.status(500).json({ success: true, message: err.message || error.SERVER_ERROR });
    }
}

exports.getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).populate('assignee', 'name').populate('createdBy', 'name email phone');
        if(!ticket) {
            return res.status(404).json({ success: false, message: error.TICKET_NOT_FOUND });
        }
        res.json({ success: true, data: ticket });
    } catch (err) {
        console.error('Error fetching ticket:', err);
        res.status(500).json({ success: false, message: err.message || error.SERVER_ERROR });
    }
}

exports.updateStatus = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).populate('assignee', 'name').populate('createdBy', 'name email phone');
        if(!ticket) {
            return res.status(404).json({ success: false, message: error.TICKET_NOT_FOUND });
        }
        ticket.status = req.body.status;
        ticket.resolutionNotes = req.body.resolutionNotes || ticket.resolutionNotes;
        await ticket.save();

        // If ticket is resolved, notify createdBy
        if (ticket.status === "Resolved") {
          await notifyTicketResolved(ticket);
        }

        req.app.get('io').emit('ticketUpdated', ticket);

        res.json({ success: true, message: success.TICKET_UPDATED, data: ticket });
    } catch (err) {
        console.error('Error updating ticket status:', err);
        res.status(500).json({ success: false, message: err.message || error.SERVER_ERROR });
    }
}

exports.getMyTickets = async (req, res) => {
    try {
        const userId = req.user.id;
        const tickets = await Ticket.find({ createdBy: userId })
            .populate('assignee', 'name')
            .populate('createdBy', 'name email phone')
            .sort({ createdAt: -1 });
        
        res.json({ success: true, data: tickets, total: tickets.length });
    } catch (err) {
        console.error('Error fetching user tickets:', err);
        res.status(500).json({ success: false, message: err.message || error.SERVER_ERROR });
    }
}
