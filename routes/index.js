const express = require('express');
const getCtrl = require('../controller/getMedicine');
const postCtrl = require('../controller/postMedicine');
const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).json({"message": "OK"})
})

router.post('/uploadCSV', postCtrl.uploadCsv)

router.get('/searchMedicine', getCtrl.searchMedicine)

router.get('/getMedicineDetails/:id', getCtrl.getMedicineDetails)

router.post('/placeorder', postCtrl.placeOrder)

module.exports = router;