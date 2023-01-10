const db = require("../helpers/db-connection");
const { v4: uuidv4 } = require("uuid");

const productModel = {
  query: (queryParams, sortType = "ASC", limit = 5, page = 1) => {
    const { title, cat } = queryParams;
    if (title && cat) {
      return `WHERE title ILIKE '%${title}%' AND category ILIKE '%${cat}%' ORDER BY title ${sortType} LIMIT ${limit}`;
    } else if (title || cat) {
      return `WHERE title ILIKE '%${title}%' OR category ILIKE '%${cat}%' ORDER BY title ${sortType} LIMIT ${limit} `;
    } else {
      // return `ORDER BY CAST (price AS FLOAT) ${sortType} LIMIT ${limit} OFFSET ${
      //   (page - 1) * limit
      // }`;
      return `ORDER BY title ${sortType} LIMIT ${limit} OFFSET ${
        (page - 1) * limit
      }`;
    }
  },
  // get: function (queryParams) {
  get: (queryParams) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM products ${productModel.query(
          // `SELECT * FROM products ${this.query(
          queryParams,
          queryParams.sortBy,
          queryParams.limit,
          queryParams.page
        )}`,
        (error, result) => {
          // console.log(result.rows.length);
          if (error) {
            return reject(error.message);
          } else {
            return resolve(result.rows);
          }
        }
      );
    });
  },

  getDetail: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM products WHERE product_id = '${id}'`,
        (error, result) => {
          if (error) {
            return reject(error.message);
          } else {
            return resolve(result.rows[0]);
          }
        }
      );
    });
  },

  add: ({ title, image, price, category, description }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO products (product_id, title, image, price, category, description) VALUES ($1, $2, $3, $4, $5, $6)`,
        [uuidv4(), title, image, price, category, description],
        (error) => {
          if (error) {
            return reject(error.message);
          } else {
            // if()
            return resolve({ title, image, price, category, description });
          }
        }
      );
    });
  },

  // updateByPut: ({ id, title, img, price, category }) => {
  //   return new Promise((resolve, reject) => {
  //     db.query(
  //       `UPDATE products SET title = '${title}', img = '${img}', price = '${price}', category = '${category}' WHERE id = '${id}'`,
  //       (error) => {
  //         if (error) {
  //           return reject(error.message);
  //         } else {
  //           return resolve({ id, title, img, price, category });
  //         }
  //       }
  //     );
  //   });
  // },

  updateByPatch: ({ id, title, image, price, category, description }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM products WHERE product_id = '${id}'`,
        (error, result) => {
          if (error) {
            return reject(error.message);
          } else {
            db.query(
              `UPDATE products SET title='${
                title || result.rows[0].title
              }', image='${image || result.rows[0].image}',price='${
                price || result.rows[0].price
              }', category='${
                category || result.rows[0].category
              }', description = '${
                description || result.rows[0].description
              }' WHERE product_id='${id}'`,
              (error) => {
                if (error) {
                  return reject(error.message);
                } else {
                  return resolve({
                    id,
                    title,
                    image,
                    price,
                    category,
                    description,
                  });
                }
              }
            );
          }
        }
      );
    });
  },

  remove: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`DELETE FROM products WHERE product_id = '${id}'`, (error) => {
        if (error) {
          return reject(error.message);
        } else {
          return resolve("Deleting data successfully");
        }
      });
    });
  },
};

module.exports = productModel;
