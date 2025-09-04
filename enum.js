const Enum = require('enum');

const TicketStatus = new Enum({
    Open: 1,
    InProgress: 2,
    Resolved: 3
});

const Priority = new Enum({
    Low: 1,
    Medium: 2,
    High: 3
});

const UserRole = new Enum({
    Admin: 1,
    Agent: 2,
    User: 3
});

module.exports = { TicketStatus, Priority, UserRole };