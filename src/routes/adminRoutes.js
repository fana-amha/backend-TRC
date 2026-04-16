const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Protected by Auth AND Admin middleware
router.get('/pending-resources', [auth, admin], adminController.getPendingResources);
router.get('/', (req, res) => {
    res.json({ message: "Auth route is working 🚀" });
});
router.put('/approve-resource/:id', [auth, admin], adminController.approveResource);
router.put('/reject-resource/:id', [auth, admin], adminController.rejectResource);

module.exports = router;
