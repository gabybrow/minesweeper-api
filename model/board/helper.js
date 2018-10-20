const _ = require('lodash'),
  errors = require('../../services/errors');

exports.prepareBoard = (rows, cols) => {
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

exports.insertMines = (board, rows, cols, mines) => {
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

exports.flattenBoard = board => {
  let cells = [];
  _.forEach(board, (value, key) => {
    cells = _.concat(cells, value);
  })
  return cells;
};


exports.countAdjacentMines = (board, rows, cols) => {
  let cells = exports.flattenBoard(board);
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


exports.reveal = (board, row, col, rows, cols) => {
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
          exports.reveal(board, adjacentCell.row, adjacentCell.col, rows, cols);
        }
      }
    }
  }
}

exports.checkCellAvailability = cell => {
  if (cell.revealed || cell.flag) {
    throw errors.badRequest;
  }
}
