const mongoose = require('mongoose');
const { TicketStatus, Priority } = require('../enum');
const { generateTicketNumber } = require('../utils/common-function');

const ticketSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true  
    },
    description: String,
    category: String,
    priority: {
        type: String,
        enum: Priority.enums.map(e => e.key),
        default: Priority.Medium.key
    },
    ticketNumber: { 
        type: String, 
        unique: true }, // stored in DB
    status: {
        type: String,
        enum: TicketStatus.enums.map(e => e.key),
        default: TicketStatus.Open.key
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resolutionNotes: String
}, { timestamps: true });


// Auto-generate ticketNumber only once
ticketSchema.pre("save", function (next) {
  if (!this.ticketNumber && this._id) {
    this.ticketNumber = generateTicketNumber(this._id);
  }
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);