const express = require('express');
const router = express.Router();
const checkController = require('../controllers/checkController');
const authController = require('./../controllers/authController');


/**
 * @swagger
 * components:
 *   schemas:
 *     authentication:
 *       type:object
 *       required:        
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: unique Check auth username 
 *         password:
 *           type: string
 *           description: The check auth password         
 * 
 *     Check:
 *       type: object
 *       required:
 *         - Name
 *         - url
 *         - protocol
 *         - path
 *         - Port
 *         - webhook
 *         - timeout
 *         - interval
 *         - threshold
 *         - ignoreSSL
 *         - tags
 *         - assertCode
 *         - headers
 *         - authentication
 *       properties:
 *         Name:
 *           type: string
 *           description: unique Check name 
 *         url:
 *           type: string
 *           description: The check url
 *         protocol:
 *           type: string
 *           description: The check protocol
 *         path:
 *           type: string
 *           description: The check path
 *         Port:
 *           type: integer
 *           description: The check url port
 *         webhook:
 *           type: string
 *           description: The check notification webhook
 *         timeout:
 *           type: integer
 *           description: The check timeout
 *         interval:
 *           type: string
 *           description: The check interval
 *         threshold:
 *           type: string
 *           description: The check threshold
 *         authentication:
 *           $ref: '#/components/schemas/authentication'
 *         headers:
 *           type: string
 *           description: The check headers
 *         assertCode:
 *           type: integer
 *           description: The check assertcode
 *         tags:
 *           type: array
 *           description: The check tags
 *           items:
 *              type:string
 *              properties:
 *                  tag:
 *                   type:string
 *         ignoreSSL:
 *           type: boolean
 *           description: Flag if to ignore ssl
 *       example:
 *         "name": "islam-check",
 *         "url": "www.google.com",
 *         "protocol": "HTTPS",
 *         "path": "",
 *         "Port": "1000",
 *         "webhook": "",
 *         "timeout": 1000,
 *         "interval": 600000,
 *         "threshold": 1,
 *         "authentication": {
 *              "username": "islam",
 *              "password": "1234566"
 *          },
 *         "headers": [{"name":"header1","value":"value"},{"name":"header2","value":"value"}],
 *         "assertCode": "200",
 *         "tags": ["tag1"],
 *         "ignoreSSL": false
 */



router.use(authController.protect);



/**
 * @swagger
 * /:
 *   get:
 *     summary: api/v1/checks/
 *     tags: [Checks]
 *     responses:
 *       200:
 *         description: The list of the checks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Check'
 */
router.get('/',checkController.getAllChecks);

/**
 * @swagger
 * /:
 *   post:
 *     summary: api/v1/checks/createCheck
 *     tags: [Checks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Check'
 *     responses:
 *       200:
 *         description: Created check
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Check'
 */
router.post('/createCheck',checkController.createCheck);


/**
 * @swagger
 * /:
 *   put:
 *     summary: api/v1/checks/createCheck
 *     tags: [Checks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Check'
 *     responses:
 *       200:
 *         description: Edited Chcek
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Check'
 */
router.put('/updatecheck',checkController.updateCheck);

/**
 * @swagger
 * /:
 *   get:
 *     summary: api/v1/checks/test/{checkID}
 *     tags: [Checks]
 *     responses:
 *       200:
 *         description: start pool a check URL
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: pooling jsut started !....
 */
router.get('/test',checkController.testPool);
router.post('/report',checkController.checksReport);

module.exports = router;