// backend/routes/mechanicRoutes.js
const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/mechanicController');
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', protect, ctrl.create);
router.put('/:id', protect, ctrl.update);
router.post('/:id/reviews', protect, ctrl.addReview);
module.exports = router;