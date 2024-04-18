const db = require("../mongodb");

const getHistory = async () => {
  try {
    const history = await db.collection("history").find().toArray();
    return history;
  } catch (error) {
    console.error("Error getting history:", error);
    return [];
  }
};

const updateHistory = async (song) => {
  try {
    await db.collection("history").insertOne(song);
    console.log("History updated successfully.");
  } catch (error) {
    console.error("Error updating history:", error);
  }
};

module.exports = {
  getHistory,
  updateHistory,
};
