module.exports = Object.freeze({
    TicketAssigned: (ticket) => ({
        title: "New Ticket Assigned",
        message: `Ticket #${ticket.ticketNumber} has been assigned to you.`,
        type: "Info"
    }),

    TicketUpdated: (ticket) => ({
        title: "Ticket Updated",
        message: `Ticket #${ticket.ticketNumber} status changed to ${ticket.status}.`,
        type: "Success"
    }),

    TicketCreated: (ticket) => ({
        title: "New Ticket Created",
        message: `Ticket #${ticket.ticketNumber} has been created.`,
        type: "Info"
    }),

    TicketResolved: (ticket) => ({
        title: "Ticket Resolved",
        message: `Your ticket #${ticket.ticketNumber} has been resolved.`,
        type: "Success"
    }),

    SLABreach: (ticket) => ({
        title: "SLA Breach",
        message: `Ticket #${ticket.ticketNumber} has breached SLA.`,
        type: "Error"
    })
});


