const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const isDriver = require("../middleware/isDriverMiddleware");

const {
    addTruck,
    getTrucks,
    getTrucksById,
    updateTruck,
    deleteTruck,
    assignTo,
    unAssign
} = require('../controllers/truckControler');

router.post('/trucks', authMiddleware, isDriver, addTruck);
router.get('/trucks', authMiddleware, isDriver, getTrucks);
router.get('/trucks/:id', authMiddleware, isDriver, getTrucksById);
router.put('/trucks/:id', authMiddleware, isDriver, updateTruck);
router.delete('/trucks/:id', authMiddleware, isDriver, deleteTruck);
router.post('/trucks/:id/assign', authMiddleware, isDriver, assignTo);
router.post('/trucks/:id/unAssign', authMiddleware, isDriver, unAssign);


module.exports = router;
