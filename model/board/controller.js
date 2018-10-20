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
        mined: false
      };
    }
  }
  return board;
}

const insertMines = (board, rows, cols, mines) => {
  const options = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      options.push([i, j]);
    }
  }
  for (let n = 0; n < mines; n++) {
    const index = Math.floor(Math.random(rows) * options.length);
    const choice = options[index];
    const i = choice[0];
    const j = choice[1];
    // Deletes that spot so it's no longer an option
    options.splice(index, 1);
    board[i][j].mined = true;
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
  const minedBoard = insertMines(prepareBoard(rows, cols), rows, cols, mines);
  return Boards
    .create(
      {
        rows,
        cols,
        mines,
        cells: flattenBoard(minedBoard)
      },
      {
        include: [{ model: Cells, as: 'cells' }]
      }
    )
    .then(createdBoard => {
      res.status(201).json(createdBoard);
    })
    .catch(next);
}