const Router = require('express').Router,
  router = new Router();

router.route('/').get((req, res) => {
  res.json({ message: 'Welcome to minesweeper-api API!' });
});

module.exports = router;
