
const queryHandler = require('../../handler/database/queryHandler');

let searchMedicine = (req, res) => {
  try {
    console.log("Inside search Medicine ");
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log("REQ URL: ", fullUrl);
    let searchKey;
    if (req.query?.key) {
      searchKey = req.query.key;
    }
    else {
      console.log("BAD REQUEST, Missing Query Param");
      res.status(400).json({ "message": "Bad Request" });
      return;
    }

    let query = `SELECT c_name FROM product_details WHERE 
    c_name LIKE '%${searchKey}%'`;
    queryHandler(req.app.get('dbRead'), query, [])
      .then(response => {
        response = response.map(item => item.c_name);
        res.status(200).json({ response });
      })
      .catch((error) => {
        console.log('Error from database', error)
        res.status(500).json({ error });
        return;
      });
  } catch (error) {
    console.log("error in searchMedicine", error);
    res.status(500).json({ error });
  }
}

let getMedicineDetails = async (req, res) => {
  try {
    console.log("Inside search Medicine ");
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log("REQ URL: ", fullUrl);
    let searchKey;
    if (req.params?.id) {
      searchKey = req.params.id;
    }
    else {
      console.log("BAD REQUEST, Missing Id");
      res.status(400).json({ "message": "Bad Request" });
      return;
    }
    let query = `SELECT c_unique_code as uniqueCode, 
    c_name as name, c_manufacturer as manufacturer,
    c_packaging as packaging, hsn_code as hsnNo, n_mrp as mrp,
    n_balance_qty as quantity, c_batch_no as batchNo,
    DATE_FORMAT(d_expiry_date, "%d/%m/%Y") as expiryDate, c_schemes as schemes
    FROM product_details WHERE c_unique_code = ?`;
    let params = [searchKey];

    let response = await queryHandler(req.app.get('dbRead'), query, params);
    if (response) {
      res.status(200).json({ response });
      return;
    } else {
      console.log('Error from database', error)
      res.status(500).json({ error });
      return;
    }
  } catch (error) {
    console.log("error in search Medicine", error);
    res.status(500).json({ error });
  }
}

module.exports.searchMedicine = searchMedicine;
module.exports.getMedicineDetails = getMedicineDetails;