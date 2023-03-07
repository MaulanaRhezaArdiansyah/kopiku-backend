const db = require("../helpers/db-connection");
const { v4: uuidv4 } = require("uuid");

const historyModel = {
  getDetail: (userID) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT his.history_id, his.user_id, his.order_item, his.product_title, his.product_price, his.product_id,
        json_agg(row_to_json(prim)) images
        FROM history AS his
        INNER JOIN (SELECT product_id, filename FROM product_images) AS prim
        ON his.product_id = prim.product_id
        WHERE his.user_id = '${userID}'
        GROUP BY his.history_id
        `,
        (error, result) => {
          if (error) return reject(error.message);
          // console.log(result);
          return resolve(result.rows);
        }
      );
    });
  },

  // addHistory: ({ userID, order_item, product_title, product_price, file }) => {
  //   return new Promise((resolve, reject) => {
  //     db.query(
  //       `SELECT id FROM users WHERE id = '${userID}'`,
  //       (error, result) => {
  //         const userIDNew = result.rows[0].id;
  //         if (error) return reject(error.message);
  //         db.query(
  //           `INSERT INTO history (history_id, user_id, order_item, product_title, product_price, product_image) VALUES ('${uuidv4()}', '${userIDNew}','${order_item}', '${product_title}', '${product_price}', '${
  //             file.filename
  //           }')`,
  //           (errorAddHistory) => {
  //             if (errorAddHistory) return reject(errorAddHistory.message);
  //             return resolve({
  //               user_id: userIDNew,
  //               order_item,
  //               product_title,
  //               product_price,
  //               product_image: file.filename,
  //             });
  //           }
  //         );
  //       }
  //     );
  //   });
  // },

  addHistory: ({
    userID,
    order_item,
    product_title,
    product_price,
    product_id,
  }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT id FROM users WHERE id = '${userID}'`,
        (error, result) => {
          const userIDNew = result.rows[0].id;
          if (error) return reject(error.message);
          db.query(
            `INSERT INTO history (history_id, user_id, order_item, product_title, product_price, product_id) VALUES ('${uuidv4()}', '${userIDNew}','${order_item}', '${product_title}', '${product_price}', '${product_id}')`,
            (errorAddHistory) => {
              if (errorAddHistory) return reject(errorAddHistory.message);
              return resolve({
                user_id: userIDNew,
                order_item,
                product_title,
                product_price,
                product_id,
              });
            }
          );
        }
      );
    });
  },

  removeHistoryByIdHistory: ({ userID, historyID }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT id FROM users WHERE id = '${userID}'`,
        (errorID, resultID) => {
          if (errorID) return reject(errorID.message);
          const resultGetUserID = resultID.rows[0].id;
          db.query(
            `SELECT * FROM history WHERE history_id = '${historyID}'`,
            (errorGetHistory, resultGetHistory) => {
              if (errorGetHistory) return reject(errorGetHistory.message);
              const resultGetHistoryID = resultGetHistory.rows[0].history_id;
              db.query(
                `DELETE FROM history WHERE user_id = '${resultGetUserID}' AND history_ID = '${resultGetHistoryID}'`,
                (errorDeleteHistory) => {
                  if (errorDeleteHistory) return reject(errorDeleteHistory);
                  return resolve({
                    userID: resultGetUserID,
                    historyID: resultGetHistoryID,
                    product_title: resultGetHistory.rows[0].product_title,
                  });
                }
              );
            }
          );
        }
      );
    });
  },
};
module.exports = historyModel;
