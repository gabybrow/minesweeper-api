const Router = require('express').Router,
  router = new Router(),
  boardController = require('./controller');

router
  .route('/')
  .get((...args) => boardController.find(...args));

module.exports = router;