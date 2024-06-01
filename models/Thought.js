const { Schema, model } = require("mongoose"); 
const reactionSchema = require("./Reaction"); // Import the reaction model (not just the schema)
const dateFormat = require("../utils/dateFormat");

const thoughtSchema = new Schema(
  {
    thoughtText: { // No need for a thoughtId, MongoDB will automatically assign an _id
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema], 
    userId: { // Added to link thoughts to the user who created them
      type: Schema.Types.ObjectId,
      ref: 'User',  // Reference the User model
      required: true
    }
  },
  {
    toJSON: {
      virtuals: true,
      getters: true, // Include getters (for formatted createdAt)
    },
    id: false, // Prevent a duplicate _id field from being created
  }
);

// Virtual for reaction count
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("Thought", thoughtSchema);

module.exports = Thought;
