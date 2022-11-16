const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();


const saucesCtrl = require('../controllers/sauces');

router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.post('/', auth, multer, saucesCtrl.addOneSauce);
router.put('/:id', auth, multer, saucesCtrl.updateOneSauce);
router.delete('/:id', auth, saucesCtrl.deleteOneSauce);
router.post('/:id/like', auth, saucesCtrl.likeSauce);

module.exports = router;