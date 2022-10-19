const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');

router.get('/sauces', saucesCtrl.getAllSauces);
router.get('/sauces/:id', saucesCtrl.getOneSauce);
router.post('/sauces', saucesCtrl.addOneSauce);
router.post('/sauces/:id', saucesCtrl.updateOneSauce);
router.delete('/sauces/:id', saucesCtrl.deleteOneSauce);
router.post('sauces/:id/like', saucesCtrl.likeSauce);

module.exports = router;