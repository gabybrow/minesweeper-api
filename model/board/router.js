const Router = require('express').Router,
  router = new Router(),
  boardController = require('./controller');

/**
 * @swagger
 * definitions:
 *   Board:
 *     properties:
 *       rows:
 *         type: integer
 *       cols:
 *         type: integer
 *       mines:
 *         type: integer
 *       status:
 *         type: enum
 */

/**
 * @swagger
 * /api/boards:
 *   get:
 *     tags:
 *       - Boards
 *     description: Returns all boards
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of boards
 *         schema:
 *           $ref: '#/definitions/Board'
 */

/**
 * @swagger
 * /api/boards:
 *   post:
 *     tags:
 *       - Boards
 *     description: Creates a new board
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         description: The Board to create.
 *         schema:
 *           type: object
 *           properties:
 *             rows:
 *               type: integer
 *               example: 8
 *             cols:
 *               type: integer
 *               example: 8
 *             mines:
 *               type: integer
 *               example: 10
 *     responses:
 *       201:
 *         description: Successfully created
 */

router
  .route('/')
  .get((...args) => boardController.find(...args))
  .post((...args) => boardController.create(...args));

/**
 * @swagger
 * /api/boards/{id}:
 *   get:
 *     tags:
 *       - Boards
 *     description: Returns a single board with an array of its cells
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Board's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single board
 *         schema:
 *           $ref: '#/definitions/Board'
 */

router
  .route('/:id')
  .get((...args) => boardController.findById(...args));

/**
 * @swagger
 * /api/boards/{id}/row/{row}/col/{col}/reveal:
 *   post:
 *     tags:
 *       - Boards
 *     description: Reveals a cell
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Board's id
 *         in: path
 *         required: true
 *         type: integer
 *         example: 8
 *       - name: row
 *         description: Cell's row
 *         in: path
 *         required: true
 *         type: integer
 *         example: 4
 *       - name: col
 *         description: Cell's column
 *         in: path
 *         required: true
 *         type: integer
 *         example: 4
 *     responses:
 *       200:
 *         description: Successfully revealed
 */

router
  .route('/:id/row/:row/col/:col/reveal')
  .post((...args) => boardController.revealCell(...args));


/**
 * @swagger
 * /api/boards/{id}/row/{row}/col/{col}/flag:
 *   post:
 *     tags:
 *       - Boards
 *     description: Flags a cell
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Board's id
 *         in: path
 *         required: true
 *         type: integer
 *         example: 8
 *       - name: row
 *         description: Cell's row
 *         in: path
 *         required: true
 *         type: integer
 *         example: 4
 *       - name: col
 *         description: Cell's column
 *         in: path
 *         required: true
 *         type: integer
 *         example: 4
 *     responses:
 *       200:
 *         description: Successfully flagged
 */

router
  .route('/:id/row/:row/col/:col/flag')
  .post((...args) => boardController.flagCell(...args));

/**
 * @swagger
 * /api/boards/{id}/row/{row}/col/{col}/unflag:
 *   post:
 *     tags:
 *       - Boards
 *     description: Unflags a cell
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Board's id
 *         in: path
 *         required: true
 *         type: integer
 *         example: 8
 *       - name: row
 *         description: Cell's row
 *         in: path
 *         required: true
 *         type: integer
 *         example: 4
 *       - name: col
 *         description: Cell's column
 *         in: path
 *         required: true
 *         type: integer
 *         example: 4
 *     responses:
 *       200:
 *         description: Successfully unflagged
 */

router
  .route('/:id/row/:row/col/:col/unflag')
  .post((...args) => boardController.unflagCell(...args));

router.param('id', (...args) => boardController.getBoardById(...args));

module.exports = router;