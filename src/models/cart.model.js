const db = require("../helpers/db-connection");
const { v4: uudiv4 } = require("uuid");

const cartModel = {
  get: () => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM cart`, (error, result) => {
        if (error) {
          return reject(error.message);
        } else {
          return resolve(result.rows);
        }
      });
    });
  },
  // get: () => {
  //     return new Promise((resolve, reject)=> {
  //         db.query(`
  //         SELECT crt.id, crt.quantity, crt.size
  //         json_agg(row_to_json())
  //         `)
  //     })
  // }
  add: ({ quantity, size }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO cart (id, quantity, size) VALUES ($1, $2, $3)`,
        [uudiv4(), quantity, size],
        (error) => {
          if (error) {
            return reject(error.message);
          } else {
            return resolve({ quantity, size });
          }
        }
      );
    });
  },
};

module.exports = cartModel;
