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

const prepareBoard = (rows, cols) => {
  const board = {};
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      board[i][j] = {
        row: i,
        col: j,
        mined: false,
        adjacentMines: 0
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


const countAdjacentMines = (board, rows, cols) => {
  let cells = flattenBoard(board);
  cells = cells.map(countAdjacents);
  function countAdjacents(cell) {
    if (cell.mined) {
      cell.adjacentMines = -1;
      return cell;
    }
    let total = 0;
    for (let xoff = -1; xoff <= 1; xoff++) {
      for (let yoff = -1; yoff <= 1; yoff++) {
        const i = cell.row + xoff;
        const j = cell.col + yoff;
        if (i > -1 && i < rows && j > -1 && j < cols) {
          const adjacentCell = board[i][j];
          if (adjacentCell.mined) {
            total++;
          }
        }
      }
    }
    cell.adjacentMines = total;
    return cell;
  }
  return cells;
}

exports.create = (req, res, next) => {
  const rows = req.body.rows || parseInt(config.common.board.defaultRows);
  const cols = req.body.cols || parseInt(config.common.board.defaultCols);
  const mines = req.body.mines || parseInt(config.common.board.defaultMines);
  if (mines >= rows * cols) throw errors.badRequest;
  const minedBoard = insertMines(prepareBoard(rows, cols), rows, cols, mines);
  const cells = countAdjacentMines(minedBoard, rows, cols);
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

const reveal = (board, row, col, rows, cols) => {
  board[row][col].revealed = true;
  if (board[row][col].adjacentMines == 0) {
    revealAdjacentCells(board, row, col, rows, cols);
  }
}

const revealAdjacentCells = (board, row, col, rows, cols) => {
  for (let xoff = -1; xoff <= 1; xoff++) {
    for (let yoff = -1; yoff <= 1; yoff++) {
      const i = parseInt(row) + xoff;
      const j = parseInt(col) + yoff;
      if (i > -1 && i < rows && j > -1 && j < cols) {
        const adjacentCell = board[i][j];
        if (!adjacentCell.mined && !adjacentCell.revealed) {
          reveal(board, adjacentCell.row, adjacentCell.col, rows, cols);
        }
      }
    }
  }
}

const checkCellAvailability = cell => {
  if (cell.revealed || cell.flag) {
    throw errors.badRequest;
  }
}

exports.revealCell = (req, res, next) => {
  const row = req.params.row;
  const col = req.params.col;
  const board = _.groupBy(req.board.cells, cell => cell.row);
  checkCellAvailability(board[row][col]);
  reveal(board, row, col, req.board.rows, req.board.cols);
  const affectedCells = flattenBoard(board).filter(cell => cell.revealed);
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
    Promise.all(affectedCells)
      .then(() => {
        res.sendStatus(200);
      }).catch(next)
  }
} 