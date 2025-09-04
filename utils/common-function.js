function generateTicketNumber(objectId) {
  // Take first 6 characters of ObjectId → short & unique enough
  return objectId.toString().slice(0, 6).toUpperCase();
}

module.exports = { generateTicketNumber };