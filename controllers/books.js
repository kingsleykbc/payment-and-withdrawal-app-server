/**
 * GET BOOKS
 */
module.exports.getBooks = async (req, res, next) => {
  try {
    res.json([
      { _id: "1", title: "The lion king", author: "Ben carson" },
      { _id: "2", title: "Jungle book", author: "Peter parker" },
      { _id: "3", title: "Mulan", author: "Fred thompson" },
    ]);
  }
  catch (e) {
    next(e);
  }
}