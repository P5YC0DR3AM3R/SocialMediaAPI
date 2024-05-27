const { Schema, Types } = require("mongoose");
const dateFormat = require("../utils/dateFormat");


const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 255, // Limit to 280 characters
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, // Set to current timestamp
      get: (timestamp) => dateFormat(timestamp), // Format using dateFormat util
    },
  },
  {
    toJSON: {
      getters: true, // Enable the getter for createdAt
    },
    id: false, // Prevent a duplicate _id field from being created
  }
);

module.exports = reactionSchema; // Export the schema
