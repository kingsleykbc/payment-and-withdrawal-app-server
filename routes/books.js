const express = require('express');
const { getBooks } = require('../controllers/books');
const app = express.Router();

/**
 * @swagger
 * /books:
 *  get:
 *    summary: Get a list of books. (This is a protected route)
 *    tags: [Books]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        $ref: '#/components/responses/BookList'
 */
app.get("/books", getBooks);



module.exports = app;