const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const  {addTruck, getTrucks, getTrucksById, updateTruck, deleteTruck, assignTo} = require('../controllers/truckControler');

router.post('/trucks', authMiddleware, addTruck);
router.get('/trucks', authMiddleware, getTrucks);
router.get('/trucks/:id', authMiddleware, getTrucksById);
router.put('/trucks/:id', authMiddleware, updateTruck);
router.delete('/trucks/:id', authMiddleware, deleteTruck);
router.post('/trucks/:id/assign', authMiddleware, assignTo);


module.exports = router;
