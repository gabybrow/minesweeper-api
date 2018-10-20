const rp = require('request-promise');

exports.loadExistingBoards = () => {
  const options = {
    uri: `/api/boards`,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  };
  return rp(options)
    .then(boards => {
      return boards;
    })
    .catch(err => {
      console.err(err);
    });
}

exports.getBoardDetail = id => {
  const options = {
    uri: `/api/boards/${id}`,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  };
  return rp(options)
    .then(board => {
      return board;
    })
    .catch(err => {
      console.err(err);
      return err;
    });
}

exports.startNew = (rows, cols, mines) => {
  const options = {
    uri: `/api/boards`,
    method: 'POST',
    body: {
      rows,
      cols,
      mines
    },
    json: true,
    headers: {
      'User-Agent': 'Request-Promise'
    }
  };
  return rp(options)
    .then(createdBoard => {
      return createdBoard;
    })
    .catch(err => {
      console.err(err);
      return err;
    });
}

exports.revealCell = (boardId, row, col) => {
  const options = {
    method: 'POST',
    uri: `/api/boards/${boardId}/row/${row}/col/${col}/reveal`,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  };
  return rp(options)
    .then(result => {
      return result;
    })
    .catch(err => {
      console.err(err);
      return err;
    });
}

exports.flagCell = (boardId, row, col) => {
  const options = {
    method: 'POST',
    uri: `/api/boards/${boardId}/row/${row}/col/${col}/flag`,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  };
  return rp(options)
    .then(result => {
      return result;
    })
    .catch(err => {
      console.err(err);
      return err;
    });
}

exports.unflagCell = (boardId, row, col) => {
  const options = {
    method: 'POST',
    uri: `/api/boards/${boardId}/row/${row}/col/${col}/unflag`,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  };
  return rp(options)
    .then(result => {
      return result;
    })
    .catch(err => {
      console.err(err);
      return err;
    });
}