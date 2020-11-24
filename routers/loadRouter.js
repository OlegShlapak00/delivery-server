
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const  {addLoad, getLoad, getActiveLoad, getLoadById, changeState , deleteLoadById, postLoadById, updateLoadById} = require('../controllers/loadControler');

router.post('/loads', authMiddleware, addLoad);
router.get('/loads', authMiddleware, getLoad);
router.get('/loads/active', authMiddleware, getActiveLoad);
router.get('/loads/:id', authMiddleware, getLoadById);
router.patch('/loads/active/state', authMiddleware, changeState);
router.put('/loads/:id', authMiddleware, updateLoadById);
router.delete('/loads/:id', authMiddleware, deleteLoadById);
router.post('/loads/:id/post', authMiddleware, postLoadById);

module.exports = router;
