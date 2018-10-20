const Router = require('express').Router,
  router = new Router();

const board = require('./model/board/router');

router.route('/').get((req, res) => {
  res.json({ message: 'Welcome to minesweeper-api API!' });
});

router.use('/boards', board);

module.exports = router;
