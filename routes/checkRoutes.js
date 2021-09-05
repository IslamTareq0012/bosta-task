const express = require('express');
const router = express.Router();
const checkController = require('../controllers/checkController');
const authController = require('./../controllers/authController');


router.use(authController.protect);

router.get('/',checkController.getAllChecks);
router.post('/createCheck',checkController.createCheck);
router.put('/updatecheck',checkController.updateCheck);
router.get('/test',checkController.testPool);
router.post('/report',checkController.checksReport);

module.exports = router;