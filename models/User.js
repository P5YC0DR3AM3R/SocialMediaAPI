const { Schema, model } = require("mongoose");
const Thought = require("./Thought");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,  // Trim whitespace from username
      maxlength: 150,  // 150 is just an example, adjust as needed
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true, 
      match: [/.+@.+\..+/, "Please enter a valid e-mail address"], // Email validation
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,  // Optionally include getters if you have any
    },
    id: false, // Prevent a duplicate _id field from being created
  }
);

// Virtuals for friend and thought counts
userSchema
  .virtual("friendCount")
  .get(function () {
    return this.friends.length;
  });

userSchema
  .virtual("thoughtCount")
  .get(function () {
    return this.thoughts.length;
  });

  // Middleware to delete associated thoughts when a user is deleted
userSchema.pre(/deleteOne|deleteMany|findOneAndDelete/, async function (next) {
  const userQuery = this.getFilter ? this.getFilter() : { _id: this._id }; // Handle both query and document middleware
  const user = await this.model.findOne(userQuery);
  if (user) {
    await Thought.deleteMany({ userId: user._id });
  }
  next();
});

const User = model("User", userSchema);

module.exports = User;