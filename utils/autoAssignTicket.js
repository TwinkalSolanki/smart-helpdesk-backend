const User = require('../models/User');
const Ticket = require('../models/Ticket');
const { UserRole, TicketStatus } = require('../enum');

module.exports = {
  maybeAutoAssign: async (ticket) => {
    // find agents that handle this category
    let candidates = await User.find({ role: UserRole.Agent.key, categories: ticket.category });

    if (!candidates.length) {
      // fallback: all agents
      candidates = await User.find({ role: UserRole.Agent.key });
    }
    if (!candidates.length) return null;

    // find agent with smallest open ticket count
    let chosen = null;
    let min = Infinity;
    for (const agent of candidates) {
      const count = await Ticket.countDocuments({ 
        assignee: agent._id, 
        status: TicketStatus.Open.key 
      });
      if (count < min) { min = count; chosen = agent; }
    }

    if (chosen) {
      ticket.assignee = chosen._id;
      await ticket.save();
      return chosen;
    }
    return null;
  }
};


// const User = require('../models/User');

// exports.maybeAutoAssign = async (ticket) => {
//   if (!ticket.assignee) {
//     const agent = await User.findOne({ role: 'Agent' });
//     if (agent) {
//       ticket.assignee = agent._id;
//       await ticket.save();
//     }
//   }
// };