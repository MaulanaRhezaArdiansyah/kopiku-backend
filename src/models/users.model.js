const db = require("../helpers/db-connection");
const { v4: uuidv4 } = require("uuid");

const usersModel = {
  query: (queryParams, sortType = "ASC", limit = 10, page = 1) => {
    const { firstname, gender } = queryParams;
    if (firstname && gender) {
      return `WHERE firstname ILIKE '%${firstname}%' AND gender ILIKE '%${gender}%' ORDER BY firstname ${sortType} LIMIT ${limit} OFFSET ${
        (page - 1) * limit
      }`;
    } else if (firstname || gender) {
      return `WHERE first_name ILIKE '%${firstname}%' OR gender ILIKE '%${gender}%' ORDER BY firstname ${sortType} LIMIT ${limit} OFFSET ${
        (page - 1) * limit
      }`;
    } else {
      return `ORDER BY firstname ${sortType} LIMIT ${limit} OFFSET ${
        (page - 1) * limit
      }`;
    }
  },
  // get: function (queryParams) {
  get: (queryParams) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM users ${usersModel.query(
          // `SELECT * FROM products ${this.query(
          queryParams,
          queryParams.sortBy,
          queryParams.limit,
          queryParams.page
        )}`,
        (error, result) => {
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
        `SELECT * FROM users WHERE user_id = '${id}'`,
        (error, result) => {
          if (error) {
            return reject(error.message);
            // return reject("aaa");
          } else {
            return resolve(result.rows[0]);
          }
        }
      );
    });
  },

  add: ({
    email,
    password,
    phone,
    displayname,
    firstname,
    lastname,
    image,
    gender,
    birthdate,
    delivery_address,
  }) => {
    // ('${uuidv4()}', '${displayname}', '${firstname}','${lastname}', '${birthdate}', '${gender}', '${delivery_address}', '${image}',  )
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO users (user_id, email, password, phone, displayname, firstname, lastname, image, gender, birthdate, delivery_address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `,
        [
          uuidv4(),
          email,
          password,
          phone,
          displayname,
          firstname,
          lastname,
          image,
          gender,
          birthdate,
          delivery_address,
        ],
        (error) => {
          if (error) {
            return reject(error.message);
          } else {
            return resolve({
              email,
              password,
              phone,
              displayname,
              firstname,
              lastname,
              image,
              gender,
              birthdate,
              delivery_address,
            });
          }
        }
      );
    });
  },

  updateByPatch: ({
    id,
    displayname,
    firstname,
    lastname,
    email,
    image,
    gender,
    phone,
    birthdate,
    delivery_address,
    // password,
  }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM users WHERE user_id = '${id}'`,
        (error, result) => {
          if (error) {
            return reject(error.message);
          } else {
            // if (result.rows[0].user_id != id) {
            // return reject("id not found");
            // } else {
            // console.log(result.rows[0]);
            db.query(
              `UPDATE users SET displayname='${
                displayname || result.rows[0].displayname
              }', 
                firstname='${firstname || result.rows[0].firstname}',
                lastname='${lastname || result.rows[0].lastname}', 
                email='${email || result.rows[0].email}',
                image = '${image || result.rows[0].image}' ,
                gender = '${gender || "Male"}',
                birthdate = '${birthdate || result.rows[0].birthdate}',
                phone = '${phone || result.rows[0].phone}',
                delivery_address = '${
                  delivery_address || result.rows[0].delivery_address
                }'
                WHERE user_id = '${id}'`,
              (error) => {
                if (error) {
                  return reject(error.message);
                } else {
                  return resolve({
                    id,
                    displayname,
                    firstname,
                    lastname,
                    email,
                    image,
                    gender,
                    phone,
                    birthdate,
                    delivery_address,
                    // password,
                  });
                }
              }
            );
            // }
          }
        }
      );
    });
  },

  remove: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`DELETE FROM users WHERE user_id = '${id}'`, (error) => {
        if (error) {
          return reject(error.message);
        } else {
          return resolve("Deleting data successfully");
        }
      });
    });
  },
};

module.exports = usersModel;
