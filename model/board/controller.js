const Boards = require('../../model').board,
  Cells = require('../../model').cell,
  config = require('../../config'),
  errors = require('../../services/errors'),
  _ = require('lodash');

exports.findById = (req, res, next) => {
  res.status(200).send(req.board);
}

exports.getBoardById = (req, res, next) => {
  return Boards
    .findById(req.params.id, {
      include: [
        {
          model: Cells,
          as: 'cells'
        }
      ],
      order: [ [ 'cells', 'row', 'ASC' ], [ 'cells', 'col', 'ASC' ] ]
    })
    .then(foundBoard => {
      if (!foundBoard) {
        throw errors.notFound;
      }
      req.board = foundBoard;
      next();
    })
    .catch(next);
}

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

const reveal = (board, row, col) => {
  board[row][col].revealed = true;
}

const checkCellAvailability = cell => {
  if (cell.revealed || cell.flag){
    throw errors.badRequest;
  } 
}

exports.revealCell = (req, res, next) => {
  const row = req.params.row;
  const col = req.params.col;
  const board = _.groupBy(req.board.cells, cell => cell.row);
  checkCellAvailability(board[row][col]);
  reveal(board, row, col)
  if (board[row][col].mined) {
    return Boards
      .update({ status: 'lost' }, { where: { id: req.board.id } })
      .then(lostBoard => {
        res.status(200).json({
          message: 'Oh no! You lost!'
        });
      }).catch(next)
  } else {
    return Cells.update({ revealed: true }, {
      where: {
        boardId: req.board.id,
        row,
        col
      }
    }).then(() => {
      res.sendStatus(200);
    }).catch(next)
  }
} 