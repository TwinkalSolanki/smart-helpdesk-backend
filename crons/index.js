const cron = require("node-cron");
const Ticket = require("../models/Ticket");
const { TicketStatus } = require("../enum");
const { sendEmail } = require("../utils/email");
const { sendSMS } = require("../utils/sms");
const User = require("../models/User");

const SLA_HOURS = 24; // SLA limit

function initCRON() {
  // schedule job
  cron.schedule("*/5 * * * *", async () => {
    const now = new Date();
    const breachedTickets = await Ticket.find({
      status: TicketStatus.Open.key,
      createdAt: { $lt: new Date(now - SLA_HOURS * 60 * 60 * 1000) },
      escalated: { $ne: true }
    }).populate("createdBy assignee");

    for (const ticket of breachedTickets) {
      console.log(`Escalating ticket #${ticket._id}`);

      const admins = await User.find({ role: "Admin" });

      for (const admin of admins) {
        const msg = `Ticket #${ticket._id} ("${ticket.title}") has been open for more than ${SLA_HOURS} hours without resolution. 
Please review it urgently. Assigned to: ${ticket.assignee?.name || "Unassigned"}.`;

        await sendEmail(admin.email, "Ticket Escalation Alert", msg);
        //await sendSMS(admin.phone, msg);
      }

      ticket.escalated = true;
      await ticket.save();
    }
  });
}

module.exports = initCRON;
