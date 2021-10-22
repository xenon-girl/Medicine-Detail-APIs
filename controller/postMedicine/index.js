const queryHandler = require('../../handler/database/queryHandler');
const { v4: uuidv4 } = require('uuid');
const requestValidator = require('../../utils/requestValidator');
const placeOrderSchema = require('../../schema/placeOrderSchema');

let uploadCsv = async (req, res) => {
  try {
    console.log("Inside upload Csv");
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log("REQ URL: ", fullUrl);

    if (!req.body?.filePath) {
      console.log("BAD REQUEST, Missing File path");
      res.status(400).json({ "message": "Bad Request, Missing filePath" });
      return;
    }
    let filePath = req.body.filePath;

    let uploadCsvQuery = `LOAD DATA LOCAL INFILE '${filePath}'
      INTO TABLE product_details
      FIELDS TERMINATED BY ','
      ENCLOSED BY '"'
      LINES TERMINATED BY '\\n'
      IGNORE 1 ROWS
      (@col1, @col2, @col3, @col4, @col5, @col6, @col7, @col8, @col9, @col10)
      set
      c_name=@col1,
      c_batch_no= @col2,
      d_expiry_date=STR_TO_DATE(@col3, '%m/%d/%Y'),
      n_balance_qty=@col4,
      c_packaging=@col5,
      c_unique_code=@col6,
      c_schemes=@col7,
      n_mrp=@col8,
      c_manufacturer=@col9,
      hsn_code=@col10`;

    let response = await queryHandler(req.app.get('dbWrite'), uploadCsvQuery, [])
    if (response) {
      res.status(200).json({ "message": "Data Uploaded Successfully" });
      return;
    }
  } catch (error) {
    console.log("Error in upload CSV", error);
    res.status(500).json({ error });
  }
}

let placeOrder = async (req, res) => {
  try {
    console.log("Inside Place Order");
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log("REQ URL: ", fullUrl);

    let reqBody = req.body;
    const isRequestValid = requestValidator.jsonValidate(
      reqBody, placeOrderSchema.schema);

    if (!isRequestValid.valid) {
      console.error(isRequestValid);
      let error = isRequestValid.errors.map((validation, i) =>
        (i + 1) + ". "
        + validation.property + ": "
        + validation.message
      ).join("; ");
      res.status(400).json({ "message": "Bad Request", error });
      return;
    }

    let data = reqBody.data;

    let query = `SELECT c_unique_code, SUM(n_balance_qty) as balance,
      COUNT(*) as count FROM product_details GROUP BY c_unique_code
      HAVING c_unique_code IN (${data.map(item => item.c_unique_id)})`;

    let productCount = await queryHandler(req.app.get('dbRead'), query, []);

    if (productCount?.length > 0) {
      data.map(item => {
        productCount.map(count => {
          if (count.c_unique_code == item.c_unique_id) {
            item.availability = count.balance;
          }
        })
      });

      let values = [];
      let params = [];
      data.map(item => {
        if (item.hasOwnProperty('availability')) {
          if (item.availability >= item.quantity) {
            item.orderId = uuidv4();
            item.status = 'Order Placed.'
            values.push(`(?, ?, ?, ?)`);
            params.push(
              item.c_unique_id, item.quantity,
              JSON.stringify(item.c_name), item.orderId
            );
          } else {
            item.status = "Item not available.";
          }
        } else {
          item.status = "Item not available.";
        }

      });

      if (values.length > 0) {
        let orderQuery = `INSERT INTO order_details(c_unique_id,
          n_qty, c_name, unique_order_id) VALUES `;
        orderQuery += values.join(',');
        let response = await
          queryHandler(req.app.get('dbWrite'), orderQuery, params);
        if (response) {
          response = data.map(item =>
            (({ c_name, orderId, status }) =>
              ({ c_name, orderId, status }))(item));
          res.status(200).json({ response });
          return;
        }
      } else {
        res.status(200).json({ message: "Item not available." });
      }
    } else {
      res.status(200).json({ message: "Item not available."});
    }

  } catch (error) {
    console.log("error in searchMedicine", error);
    res.status(500).json({ error });
  }
}

module.exports.uploadCsv = uploadCsv;
module.exports.placeOrder = placeOrder;