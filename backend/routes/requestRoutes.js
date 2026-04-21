// backend/routes/requestRoutes.js
const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/requestController');
router.post('/', protect, ctrl.create);
router.get('/my', protect, ctrl.getMyRequests);
router.get('/mechanic', protect, ctrl.getMechanicRequests);
router.put('/:id/status', protect, ctrl.updateStatus);
module.exports = router;