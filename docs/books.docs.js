// ==================================================================================================================
//  SCHEMAS (ENTITIES)
// ==================================================================================================================
/**
 * @swagger
 * components:
 *  schemas:
 *    Book:
 *      type: object
 *      description: Customer using the app
 *      properties:
 *        _id:
 *          $ref: '#/components/schemas/_id'
 *          description: The overidden id description
 *        title:
 *          type: string
 *          description: The book title
 *        author:
 *          type: string
 *          description: The writer of the book
 *      example:
 *        _id: "60ba0868a4b0ba1cf0189999"
 *        email: "The awesome book title"
 *        author: "John Doe"
 *
 */


// ==================================================================================================================
//  RESPONSES
// ==================================================================================================================
/**
 * @swagger
 * components:
 *  responses:
 *    BookList:
 *      description: A list of the books
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Book'
 *
 */