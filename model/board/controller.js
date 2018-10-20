const Boards = require('../../model').board,
  Cells = require('../../model').cell,
  config = require('../../config'),
  errors = require('../../services/errors'),
  helper = require('./helper'),
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
      order: [['cells', 'row', 'ASC'], ['cells', 'col', 'ASC']]
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

exports.create = (req, res, next) => {
  const rows = req.body.rows || parseInt(config.common.board.defaultRows);
  const cols = req.body.cols || parseInt(config.common.board.defaultCols);
  const mines = req.body.mines || parseInt(config.common.board.defaultMines);
  if (mines >= rows * cols) throw errors.badRequest;
  const minedBoard = helper.insertMines(helper.prepareBoard(rows, cols), rows, cols, mines);
  const cells = helper.countAdjacentMines(minedBoard, rows, cols);
  return Boards
    .create(
      {
        rows,
        cols,
        mines,
        cells
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

exports.revealCell = (req, res, next) => {
  const row = req.params.row;
  const col = req.params.col;
  const board = _.groupBy(req.board.cells, cell => cell.row);
  helper.checkCellAvailability(board[row][col]);
  helper.reveal(board, row, col, req.board.rows, req.board.cols);
  const affectedCells = helper.flattenBoard(board).filter(cell => cell.revealed);
  if (affectedCells.length == 1 && affectedCells[0].mined) {
    return Boards
      .update({ status: 'lost' }, { where: { id: req.board.id } })
      .then(lostBoard => {
        res.status(200).json({
          message: 'Oh no! You lost!'
        });
      }).catch(next)
  } else {
    affectedCells.map(cell => {
      return Cells.update({ revealed: true }, {
        where: {
          boardId: req.board.id,
          row: cell.row,
          col: cell.col
        }
      });
    });
    if (affectedCells.length == (req.board.rows * req.board.cols) - req.board.mines) {
      affectedCells.push(
        Boards.update({ status: 'won' },
          { where: { id: req.board.id }, returning: true }));
    }
    Promise.all(affectedCells)
      .then(results => {
        if (results[results.length - 1][1] &&
          results[results.length - 1][1][0].status) {
          res.status(200).json({
            message: 'you won!'
          })
        } else {
          res.sendStatus(200);
        }
      }).catch(next)
  }
}

exports.flagCell = (req, res, next) => {
  const row = req.params.row;
  const col = req.params.col;
  const board = _.groupBy(req.board.cells, cell => cell.row);
  helper.checkCellAvailability(board[row][col]);
  return Cells.update({ flag: true }, {
    where: {
      boardId: req.board.id,
      row: cell.row,
      col: cell.col
    }
  })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(next);
}

exports.unflagCell = (req, res, next) => {
  const row = req.params.row;
  const col = req.params.col;
  const board = _.groupBy(req.board.cells, cell => cell.row);
  if (board[row][col].revealed || !board[row][col].flag) {
    throw errors.badRequest;
  }
  return Cells.update({ flag: false }, {
    where: {
      boardId: req.board.id,
      row: cell.row,
      col: cell.col
    }
  })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(next);
}