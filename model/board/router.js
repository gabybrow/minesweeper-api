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

router
  .route('/:id/row/:row/col/:col/reveal')
  .post((...args) => boardController.revealCell(...args));

// router
//   .route('/:id/row/:row/col/:col/flag')
//   .post((...args) => boardController.flagCell(...args));

router.param('id', (...args) => boardController.getBoardById(...args));

module.exports = router;