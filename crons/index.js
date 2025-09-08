const cron = require("node-cron");
const Ticket = require("../models/Ticket");
const { TicketStatus } = require("../enum");
const { sendEmail } = require("../utils/email");
const { sendSMS } = require("../utils/sms");
const User = require("../models/User");

const SLA_HOURS = 24; // SLA limit

const escalationMap = {};    // in-memory escalation tracking { ticketId: level }
 
function initCRON() {
  // cron.schedule("*/5 * * * *", async () => {
  //   const now = new Date();

  //   const openTickets = await Ticket.find({
  //     status: TicketStatus.Open.key
  //   }).populate("createdBy assignee");

  //   for (const ticket of openTickets) {
  //     const ticketAgeHours = (now - ticket.createdAt) / (1000 * 60 * 60);

  //     let newLevel = 0;

  //     if (ticketAgeHours > SLA_HOURS + 24) {
  //       newLevel = 3; // SLA + 24h
  //     } else if (ticketAgeHours > SLA_HOURS + 12) {
  //       newLevel = 2; // SLA + 12h
  //     } else if (ticketAgeHours > SLA_HOURS) {
  //       newLevel = 1; // SLA breached
  //     }

  //     const ticketId = ticket._id.toString();  // ensure string key
  //     const currentLevel = escalationMap[ticketId] || 0;

  //     // escalate only when level increases
  //     if (newLevel > currentLevel) {
  //       const admins = await User.find({ role: "Admin" });

  //       for (const admin of admins) {
  //         const msg = `Ticket #${ticket._id} ("${ticket.title}") is still OPEN.
  //                       ⏰ SLA Alert Level ${newLevel}:
  //                       - Created: ${ticket.createdAt.toLocaleString()}
  //                       - Age: ${ticketAgeHours.toFixed(1)} hours
  //                       - Assigned to: ${ticket.assignee?.name || "Unassigned"}

  //                       Please review it urgently.`;

  //         await sendEmail(admin.email, `Ticket Escalation Alert - Level ${newLevel}`, msg);
  //         console.log(`From cron Escalation email sent to ${admin.email} for ticket #${ticket._id} at level ${newLevel}`);
  //         // await sendSMS(admin.phone, `Ticket Escalation Alert - Level ${newLevel}`, msg);

  //       }

  //       // update map
  //       escalationMap[ticketId] = newLevel;
  //     }
  //   }
  // });
}

/* ============= using above code email send after every 5 min after once SLA breached ============= */
// function initCRON() {
//   // schedule job
//   cron.schedule("*/5 * * * *", async () => {
//     const now = new Date();
//     const breachedTickets = await Ticket.find({
//       status: TicketStatus.Open.key,
//       createdAt: { $lt: new Date(now - SLA_HOURS * 60 * 60 * 1000) },
//       escalated: { $ne: true }
//     }).populate("createdBy assignee");

//     for (const ticket of breachedTickets) {
//       console.log(`Escalating ticket #${ticket._id}`);

//       const admins = await User.find({ role: "Admin" });

//       for (const admin of admins) {
//         const msg = `Ticket #${ticket._id} ("${ticket.title}") has been open for more than ${SLA_HOURS} hours without resolution. 
// Please review it urgently. Assigned to: ${ticket.assignee?.name || "Unassigned"}.`;

//         await sendEmail(admin.email, "Ticket Escalation Alert", msg);
//         await sendSMS(admin.phone, msg);
//       }

//       ticket.escalated = true;
//       await ticket.save();
//     }
//   });
// }

module.exports = initCRON;
