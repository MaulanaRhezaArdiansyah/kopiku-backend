const db = require("../helpers/db-connection");
const { v4: uuidv4 } = require("uuid");

const productModel = {
  // query: (queryParams, sortType = "ASC", limit = 10, page = 1) => {
  //   const { title, cat } = queryParams;
  //   if (title && cat) {
  //     return `WHERE title ILIKE '%${title}%' AND category ILIKE '%${cat}%' ORDER BY title ${sortType} LIMIT ${limit}`;
  //   } else if (title || cat) {
  //     return `WHERE title ILIKE '%${title}%' OR category ILIKE '%${cat}%' ORDER BY title ${sortType} LIMIT ${limit} `;
  //   } else {
  //     // return `ORDER BY CAST (price AS FLOAT) ${sortType} LIMIT ${limit} OFFSET ${
  //     //   (page - 1) * limit
  //     // }`;
  //     return `ORDER BY title ${sortType} LIMIT ${limit} OFFSET ${
  //       (page - 1) * limit
  //     }`;
  //   }
  // },
  query: (queryParamss, sortType = "ASC") => {
    const { title, cat } = queryParamss;
    if (title && cat) {
      return `WHERE title ILIKE '%${title}%' AND category ILIKE '%${cat}%' ORDER BY title ${sortType} `;
    } else if (title || cat) {
      return `WHERE title ILIKE '%${title}%' OR category ILIKE '%${cat}%' ORDER BY title ${sortType}  `;
    }
  },

  get: (queryParams) => {
    // array / multiple image upload
    const {
      page = 1,
      limit = 1000,
      sortType = "asc",
      search = "",
      cat = "",
    } = queryParams;
    // console.log(queryParams);
    return new Promise((resolve, reject) => {
      db.query(
        // `SELECT products.id, products.title, products.price, products.image, products.category, products.description, product_images.product_id, product_images.name, product_images.filename FROM products INNER JOIN product_images ON products.id = product_images.product_id
        // not using aliases
        // `SELECT
        //   products.id, products.title, products.price, products.category, products.description,
        //   json_agg(row_to_json(product_images)) images
        //  FROM products
        //  LEFT JOIN product_images ON products.id = product_images.product_id
        //  GROUP BY products.id
        // ${productModel.query(
        //   // `SELECT * FROM products ${this.query(
        //   queryParams,
        //   queryParams.sortBy,
        //   queryParams.limit,
        //   queryParams.page
        // )}`,
        // using aliases and not all the data in product_images will display
        `SELECT
        pr.id, pr.title, pr.price, pr.image, pr.category, pr.description,
        json_agg(row_to_json(prim)) images
        FROM products AS pr
        INNER JOIN (SELECT product_id, name, filename FROM product_images) AS prim 
        ON pr.id = prim.product_id
        ${search ? `AND title ILIKE '%${search}%'` : ""}
        ${cat ? `AND category ILIKE '%${cat}%' ` : ""}
         GROUP BY pr.id 
         ORDER BY title ASC
        LIMIT ${limit} OFFSET ${(page - 1) * limit}
         `,
        //  ${productModel.query(
        //    queryParams,
        //    queryParams.sortBy,
        //    queryParams.limit,
        //    queryParams.page
        //  )}
        // `SELECT * FROM products`,
        (error, result) => {
          // console.log(result.rows);
          if (error) {
            return reject(error.message);
          } else {
            // console.log(result);
            // for (let i = 0; i < result.rowCount; i++) {
            //   db.query(
            //     `SELECT image_id, name, filename FROM product_images WHERE product_id = $1`,
            //     [result.rows[i].id]
            //   ).then((resultImage) => {
            //     return resolve({
            //       ...result.rows[i],
            //       images: resultImage.rows,
            //     });
            //   });
            // }

            // result.rows.map((item, index) => {
            //   db.query(
            //     `SELECT image_id, name, filename FROM product_images WHERE product_id = $1`,
            //     [item.id]
            //   ).then((resultImage) => {
            //     return resolve({
            //       ...item,
            //       images: resultImage.rows,
            //     });
            //   });
            // });
            return resolve(result.rows);
          }
        }
      );
    });

    // single image upload
    // return new Promise((resolve, reject) => {
    //   db.query(
    //     `SELECT * FROM products ${productModel.query(
    //       queryParams,
    //       queryParams.sortBy,
    //       queryParams.limit,
    //       queryParams.page
    //     )}`,
    //     (error, result) => {
    //       if (error) {
    //         return reject(error.message);
    //       } else {
    //         return resolve(result.rows);
    //       }
    //     }
    //   );
    // });
  },

  // getDetail: (id) => {
  //   return new Promise((resolve, reject) => {
  //     db.query(
  //       `SELECT
  //     pr.image,
  //     json_agg(row_to_json(prim)) images
  //    FROM products AS pr
  //    INNER JOIN (SELECT filename FROM product_images) AS prim
  //    ON pr.id = prim.product_id
  //    GROUP BY pr.id`,
  //       (error, result) => {
  //         if (error) {
  //           return reject(error.message);
  //         } else {
  //           // console.log(result.rows);
  //           return resolve(result.rows);
  //         }
  //       }
  //     );
  //   });
  // },
  // getDetail: (id) => {
  //   return new Promise((resolve, reject) => {
  //     db.query(
  //       `SELECT * FROM products WHERE id = '${id}' UNION SELECT * FROM product_images WHERE product_id = '${id}'`,
  //       (error, result) => {
  //         if (error) {
  //           return reject(error.message);
  //         } else {
  //           return resolve(result.rows[0]);
  //         }
  //       }
  //     );
  //   });
  // },
  getDetail: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        `
      SELECT
      pr.id, pr.title, pr.price, pr.image, pr.category, pr.description,
      json_agg(row_to_json(prim)) images
      FROM products AS pr
      INNER JOIN (SELECT product_id, name, filename FROM product_images) AS prim 
      ON pr.id = prim.product_id
      WHERE pr.id = '${id}'
      GROUP BY pr.id 
     `,
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

  // getDetail: (id) => {
  //   return new Promise((resolve, reject) => {
  //     db.query(`SELECT * FROM products WHERE id = '${id}'`, (error, result) => {
  //       if (error) {
  //         return reject(error.message);
  //       } else {
  //         return resolve(result.rows[0]);
  //       }
  //     });
  //   });
  // },

  // CARA 1 for upload file and result.rows is undefined and more risk, tidak perlu dipake dulu
  // add: ({ title, image, price, category, description, file }) => {
  //   // console.log(file[0].filename);
  //   const uuidProduct = uuidv4();
  //   return new Promise((resolve, reject) => {
  //     db.query(
  //       `INSERT INTO products (id, title, image, price, category, description) VALUES ($1, $2, $3, $4, $5, $6)`,
  //       [uuidProduct, title, image, price, category, description],
  //       (error) => {
  //         // (error,result) => {
  //         // console.log(result);
  //         if (error) {
  //           return reject(error.message);
  //         } else {
  //           const uuidImage = uuidv4();
  //           db.query(
  //             `INSERT INTO product_images (image_id, product_id, name, filename) VALUES ('${uuidImage}', '${uuidProduct}', '${title}', '${file[0].filename}')`
  //           );
  //           //   `INSERT INTO product_images (image_id, product_id, name, filename) VALUES ($1, $2, $3, $4)`
  //           // ),
  //           // [uuidImage, uuidProduct, title, file[0].filename];
  //           return resolve({
  //             title,
  //             image,
  //             price,
  //             category,
  //             description,
  //             files: file,
  //           });
  //         }
  //       }
  //     );
  //   });
  // },

  // CARA 2 for uplaod file using RETURNING product_id then the result.rows will display product_id
  // if array / multiple
  add: ({ title, price, category, description, file }) => {
    // console.log(file[0].filename);
    // const uuidProduct = uuidv4();
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO products (id, title, price, category, description) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [uuidv4(), title, price, category, description],
        // `INSERT INTO products (id, title, image, price, category, description) VALUES ('${uuidv4()}', '${title}', '${image}', '${price}', '${category}', '${description}') RETURNING id`,
        (error, result) => {
          // console.log(image.file);
          // console.log(result.rows[0]);
          if (error) {
            return reject(error.message);
          } else {
            // const uuidImage = uuidv4();
            // if array / multiple
            for (let i = 0; i < file.length; i++) {
              db.query(
                `INSERT INTO product_images (image_id, product_id, name, filename) VALUES ('${uuidv4()}', '${
                  result.rows[0].id
                }', '${title}', '${file[i].filename}')`
              );
            }
            // if single
            // db.query(
            //   `INSERT INTO product_images (image_id, product_id, name, filename) VALUES ('${uuidv4()}', '${
            //     result.rows[0].id
            //   }', '${title}', '${file.filename}')`
            // );

            //   `INSERT INTO product_images (image_id, product_id, name, filename) VALUES ($1, $2, $3, $4)`
            // ),
            // [uuidImage, uuidProduct, title, file[0].filename];
            return resolve({
              title,
              price,
              category,
              description,
              images: file,
            });
          }
        }
      );
    });
  },

  //if single
  // add: ({ title, image, price, category, description }) => {
  //   // console.log(file[0].filename);
  //   // const uuidProduct = uuidv4();
  //   return new Promise((resolve, reject) => {
  //     db.query(
  //       `INSERT INTO products (id, title, image, price, category, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
  //       [uuidv4(), title, image, price, category, description],
  //       // `INSERT INTO products (id, title, image, price, category, description) VALUES ('${uuidv4()}', '${title}', '${image}', '${price}', '${category}', '${description}') RETURNING id`,
  //       (error, result) => {
  //         // console.log(image.file);
  //         // console.log(result.rows[0]);
  //         if (error) {
  //           return reject(error.message);
  //         } else {
  //           // const uuidImage = uuidv4();
  //           return resolve({
  //             title,
  //             image,
  //             price,
  //             category,
  //             description,
  //           });
  //         }
  //       }
  //     );
  //   });
  // },

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

  updateByPatch: ({ id, title, image, price, category, description, file }) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM products WHERE id = '${id}'`, (error, result) => {
        if (error) {
          return reject(error.message);
        } else {
          db.query(
            `UPDATE products 
             SET title='${title || result.rows[0].title}', 
             image='${image || result.rows[0].image}',
             price='${price || result.rows[0].price}', 
             category='${category || result.rows[0].category}',
             description = '${description || result.rows[0].description}'
             WHERE id='${id}'`,
            (error) => {
              if (error) {
                return reject(error.message);
              } else {
                if (file.length == 0) {
                  return resolve({ id, title, price, category, description });
                }
                db.query(
                  `SELECT image_id, filename, name FROM product_images WHERE product_id = '${id}'`,
                  (errorProductImages, productImages) => {
                    if (errorProductImages) {
                      return reject({ message: errorProductImages.message });
                    }
                    for (let iNew = 0; iNew < file.length; iNew++) {
                      db.query(
                        `UPDATE product_images SET filename = $1, name = $2 WHERE image_id = $3`,
                        [
                          file[iNew].filename,
                          title,
                          productImages.rows[iNew].image_id,
                        ],
                        (error, result) => {
                          if (error) {
                            return reject({
                              message: "Failed to update product",
                            });
                          }
                          return resolve({
                            id,
                            title,
                            price,
                            category,
                            description,
                            oldImages: productImages.rows,
                            images: file,
                          });
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      });
    });
  },

  remove: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`DELETE FROM products WHERE id = '${id}'`, (error) => {
        if (error) {
          return reject(error.message);
        } else {
          db.query(
            `DELETE FROM product_images WHERE product_id = '${id}' RETURNING filename`,
            (error, result) => {
              if (error) {
                // console.log(result);
                return reject({ message: "Failed to deleting data product!" });
              } else {
                return resolve(result.rows);
              }
            }
          );
          // return resolve("Deleting data successfully");
        }
      });
    });
  },
};

module.exports = productModel;
