const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const auth = require('../middleware/auth');

router.post('/', auth, ratingController.createRating);
router.get('/resource/:id', ratingController.getResourceRatings);

module.exports = router;
