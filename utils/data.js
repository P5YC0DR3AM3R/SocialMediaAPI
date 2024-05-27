const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const reactionDescriptions = [
  'I am a very simple card.',
  'I am a simple card.',
  'I am a simple card with some text.',
  'I am a simple card with some text and a button.',
  'I am a simple card with some text, a button, and an image.'
];

const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomUserName = () => `${getRandomArrItem(usernames)}`;

const getRandomReactions = (int) => {
  const results = [];

  for (let i = 0; i < int; i++) {
    results.push({
      reactionId: new mongoose.Types.ObjectId(),
      reactionText: getRandomArrItem(reactionDescriptions),
      username: getRandomUserName(),
      createdAt: new Date().toISOString(),
    });
  }
  return results;
};

module.exports = { getRandomUserName, getRandomReactions };
