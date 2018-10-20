const Boards = require('../../model').board;

exports.find = (req, res, next) => {
    return Boards
    .find()
    .then(boards => {
        res.status(200).json(boards);
    })
    .catch(next);
}