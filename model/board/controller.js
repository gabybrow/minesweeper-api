const Boards = require('../../model').board,
  Cells = require('../../model').cell,
  config = require('../../config'),
  _ = require('lodash');

exports.find = (req, res, next) => {
  return Boards
    .findAll()
    .then(boards => {
      res.status(200).json(boards);
    })
    .catch(next);
}

const prepareBoard = (rows, cols) => {
  const board = {};
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      board[i][j] = {
        row: i,
        col: j,
        mine: false
      };
    }
  }
  return board;
}

const flattenBoard = board => {
  let cells = [];
  _.forEach(board, (value, key) => {
    cells = _.concat(cells, value);
  })
  return cells;
};

exports.create = (req, res, next) => {
  const rows = req.body.rows || parseInt(config.common.board.defaultRows);
  const cols = req.body.cols || parseInt(config.common.board.defaultCols);
  const mines = req.body.mines || parseInt(config.common.board.defaultMines);
  const basicBoard = prepareBoard(rows, cols);
  return Boards
    .create({
      rows,
      cols,
      mines,
      cells: flattenBoard(basicBoard)
    }, {
      include: [
        { model: Cells, as: 'cells' }
      ]
      })
    .then(createdBoard => {
      res.status(201).json(createdBoard);
    })
    .catch(next);
}