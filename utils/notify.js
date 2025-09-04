const { sendEmail } = require("./email");
const { sendSMS } = require("./sms");

async function notifyTicketAssigned(ticket, agent) {
  const subject = `[Smart Helpdesk] Ticket #${ticket.ticketNumber} Assigned - ${ticket.title}`;

  const html = `
    <p>Hello,</p>
    <p>Your ticket <b>"${ticket.title}"</b> (Ticket #${ticket.ticketNumber}) has been assigned to <b>${agent.name}</b>.</p>
    <p>We will notify you with further updates.</p>
    <br/>
    <p>Regards,<br/>Smart Helpdesk Team</p>
  `;

  await sendEmail(ticket.createdBy.email, subject, html);

  const message = `Ticket ${ticket.title} ("#${ticket.ticketNumber}") has been assigned to ${agent.name}.`;
  await sendSMS(ticket.createdBy.phone, message);
}

async function notifyTicketResolved(ticket) {
  const subject = `[Smart Helpdesk] Ticket #${ticket.ticketNumber} Resolved - ${ticket.title}`;

  const html = `
    <p>Hello,</p>
    <p>Good news! Your ticket <b>"${ticket.title}"</b> (Ticket #${ticket.ticketNumber}) has been resolved.</p>
    <p><b>Resolution Notes:</b> ${ticket.resolutionNotes || "N/A"}</p>
    <br/>
    <p>Regards,<br/>Smart Helpdesk Team</p>
  `;

  await sendEmail(ticket.createdBy.email, subject, html);
  
  const message = `Ticket ${ticket.title} ("#${ticket.ticketNumber}") has been resolved. Notes: ${ticket.resolutionNotes || "N/A"}`;
  await sendSMS(ticket.createdBy.phone, message);
}

module.exports = { notifyTicketAssigned, notifyTicketResolved };
