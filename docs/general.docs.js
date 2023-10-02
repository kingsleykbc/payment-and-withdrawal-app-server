// ==================================================================================================================
//  TAGS
// ==================================================================================================================
/**
 * @swagger
 * tags:
 *  - name: Auth
 *    description: The authentication controllers
 *
 *  - name: Books
 *    description: The books routes
 */

// ==================================================================================================================
//  SCHEMAS (VALUES)
// ==================================================================================================================
/**
 * @swagger
 * components:
 *  schemas:
 *    _id:
 *      type: string
 *      description: ID of an entity
 *      example: "60ba0868a4b0ba1cf018f041"
 *
 *    ErrorObject:
 *      type: object
 *      description: Error data returned from failed requests
 *      required:
 *        - message
 *        - code
 *        - type
 *      properties:
 *        message:
 *          type: string
 *          description: Error message returned from the server
 *        code:
 *          type: number
 *          description: The error code from the server
 *        type:
 *          type: string
 *          description: The type of error
 *        errors:
 *          type: object
 *          description: a list of errors based on the user's input
 *      example:
 *        message: User with this email exists
 *        code: 409
 *        type: form error
 *        errors: {"email": "Email already taken"}
 *
 */

// ==================================================================================================================
//  SECURITY SCHEMAS
// ==================================================================================================================
/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */



