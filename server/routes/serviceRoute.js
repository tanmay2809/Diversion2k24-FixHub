const express = require('express');
const {postServiceController,getServiceControllerUser,getServiceControllerHandymen} = require('../controllers/serviceController');
const router = express.Router();

router.post("/postService",postServiceController);
router.get("/getServiceDetailUser/:id",getServiceControllerUser);
router.get("/getServiceDetailHandymen/:id",getServiceControllerHandymen);

module.exports = router;