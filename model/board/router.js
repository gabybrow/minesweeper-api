const Router = require('express').Router,
  router = new Router(),
  boardController = require('./controller');

router
  .route('/')
  .get((...args) => boardController.find(...args))
  .post((...args) => boardController.create(...args));

module.exports = router;