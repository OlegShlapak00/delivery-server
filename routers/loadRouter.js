const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const isDriver = require('../middleware/isDriverMiddleware');
const isShipper = require('../middleware/isShipperMiddleware');
const {
    addLoad,
    getLoad,
    getActiveLoad,
    getLoadById,
    changeState,
    deleteLoadById,
    postLoadById,
    updateLoadById
} = require('../controllers/loadControler');

router.post('/loads', authMiddleware, isShipper, addLoad);
router.get('/loads', authMiddleware, getLoad);
router.get('/loads/active', authMiddleware, isDriver, getActiveLoad);
router.get('/loads/:id', authMiddleware, getLoadById);
router.patch('/loads/active/state', authMiddleware, isDriver, changeState);
router.put('/loads/:id', authMiddleware, isShipper, updateLoadById);
router.delete('/loads/:id', authMiddleware, isShipper, deleteLoadById);
router.post('/loads/:id/post', authMiddleware, isShipper, postLoadById);

module.exports = router;
