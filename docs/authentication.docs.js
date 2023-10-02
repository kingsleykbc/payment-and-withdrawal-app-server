// ==================================================================================================================
//  SCHEMAS (VALUES)
// ==================================================================================================================
/**
 * @swagger
 * components:
 *  schemas:
 *    CustomerLogin:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          description: The access Token
 *        password:
 *          type: string
 *          description: The refresh Token
 *      example:
 *        email: "John@yahoo.com"
 *        password: kevin@gmail.com
 *      
 *    UserTokens:
 *      type: object
 *      required:
 *        - accessToken
 *        - refreshToken
 *      properties:
 *        accessToken:
 *          type: string
 *          description: The access Token
 *        refreshToken:
 *          type: string
 *          description: The refresh Token
 *      example:
 *          accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjM0NTAzODgsImV4cCI6MTYyMzQ1MjE4OCwiYXVkIjoiNjBiYTZmMmZmMWU5NjkyOGI4OTI2M2I0In0.CIv49g0ep142mNxm0XFNXzYildZgVw1p_pGtsRN9tQw"
 *          refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjM0NTAzODgsImV4cCI6MTYyMzQ1MjE4OCwiYXVkIjoiNjBiYTZmMmZmMWU5NjkyOGI4OTI2M2I0In0.CIv49g0ep142mNxm0XFNXzYildZgVw1p_pGtsRN9tQw"
 * 
 * 
 */


// ==================================================================================================================
//  REQUEST BODIES
// ==================================================================================================================
/**
 * @swagger
 * components:
 *  requestBodies:
 *    CustomerSignUp:
 *      description: The customer signup details (this is also used for the login)
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CustomerLogin'
 * 
 */


// ==================================================================================================================
//  RESPONSES
// ==================================================================================================================
/**
 * @swagger
 * components:
 *  responses:
 *    UserTokens:
 *      description: The access and refresh tokens returned from the request
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UserTokens'
 * 
 *    CustomerSignUpError:
 *      description: A registration error. This can also be 409, to represent duplicate errors.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorObject'
 *
 */