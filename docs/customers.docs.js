// ==================================================================================================================
//  SCHEMAS (ENTITIES)
// ==================================================================================================================
/**
 * @swagger
 * components:
 *  schemas:
 *    Customer:
 *      type: object
 *      description: Customer using the app
 *      required:
 *        - email
 *        - password
 *      properties:
 *        _id:
 *          $ref: '#/components/schemas/_id'
 *        email:
 *          type: email
 *          description: User email
 *        password:
 *          type: string
 *          description: User's password
 *      example:
 *        _id: "60ba0868a4b0ba1cf0189999"
 *        email: "james@yahoo.com"
 *        password: "password123"
 */