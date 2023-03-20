var router = require('express').Router();
var controller = require('./controllers/index.js');
router.get('/reviews', controller.reviews.get);

router.get('/reviews/meta', controller.meta.get);

router.post('/reviews', controller.reviews.post);

router.put('/reviews/:review_id/helpful', controller.reviews.updateHelpful);

router.put('/reviews/:review_id/report', controller.reviews.report);

module.exports = router;