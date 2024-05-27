const connection = require("../config/connection");
const { User, Thought } = require("../models");

const userData = [
  {
    username: "JohnDoe",
    email: "johndoe@example.com",
    thoughts: [],
    friends: [],
  },
  {
    username: "JaneSmith",
    email: "janesmith@example.com",
    thoughts: [],
    friends: [],
  },
  {
    username: "AliceWonder",
    email: "alicewonder@example.com",
    thoughts: [],
    friends: [],
  },
  {
    username: "BobJohnson",
    email: "bobjohnson@example.com",
    thoughts: [],
    friends: [],
  },
  {
    username: "EmilyDavis",
    email: "emilydavis@example.com",
    thoughts: [],
    friends: [],
  },
];

const thoughtData = [
  {
    thoughtText: "Just finished a great workout!", 
    username: "JohnDoe",
    reactions: [],
  },
  {
    thoughtText: "Excited about the new project!", 
    username: "JaneSmith",
    reactions: [],
  },
  {
    thoughtText: "Love this sunny weather!", 
    username: "AliceWonder",
    reactions: [],
  },
  {
    thoughtText: "Can't wait for the weekend!", 
    username: "BobJohnson",
    reactions: [],
  },
  {
    thoughtText: "What a beautiful day!", 
    username: "EmilyDavis",
    reactions: [],
  },
];

const reactionData = [
  {
    reactionBody: "Great job!",
    username: "JaneSmith",
  },
  {
    reactionBody: "That's awesome!",
    username: "AliceWonder",
  },
  {
    reactionBody: "Congratulations!",
    username: "BobJohnson",
  },
  {
    reactionBody: "Me too!",
    username: "EmilyDavis",
  },
  {
    reactionBody: "Love it!",
    username: "JohnDoe",
  },
];

connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("connected");

  await Thought.deleteMany({});
  await User.deleteMany({});

  const users = await User.insertMany(userData);

  // Associate thoughts with users and reactions with thoughts
  for (let i = 0; i < thoughtData.length; i++) {
    const thought = await Thought.create(thoughtData[i]);
    const user = users.find((user) => user.username === thought.username);

    await User.findOneAndUpdate(
      { _id: user._id },
      { $push: { thoughts: thought._id } },
      { new: true }
    );

    await Thought.findByIdAndUpdate(thought._id, {
      $push: { reactions: reactionData[i] },
    });
  }

  // Create some friendships
  await User.findOneAndUpdate(
    { username: "JohnDoe" },
    { $addToSet: { friends: users[1]._id } }
  );

  await User.findOneAndUpdate(
    { username: "JaneSmith" },
    { $addToSet: { friends: users[0]._id, friends: users[2]._id } }
  );

  console.table(users);
  console.info("Users seeded");
  console.table(thoughtData);
  console.info("Thoughts seeded");

  process.exit(0);
});