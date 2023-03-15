var router = require('express').Router();
var controller = require('./controllers/index.js');
router.get('/reviews', controller.reviews.get);

router.get('/reviews/meta', controller.reviews.getMeta);

// router.post('/reviews');

// router.put('/reviews/:review_id/helpful');

// router.put('/reviews/:review_id/report');

module.exports = router;