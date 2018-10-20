const Router = require('express').Router,
  router = new Router(),
  boardController = require('./controller');

router
  .route('/')
  .get((...args) => boardController.find(...args))
  .post((...args) => boardController.create(...args));

router
  .route('/:id')
  .get((...args) => boardController.findById(...args));

router.param('id', (...args) => boardController.getBoardById(...args));

module.exports = router;