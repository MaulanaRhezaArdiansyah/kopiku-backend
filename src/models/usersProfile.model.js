const db = require("../helpers/db-connection");
// const db = require("../index.js");
const { v4: uuidv4 } = require("uuid");

const usersProfileModel = {
  get: () => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM users_profile`, (error, result) => {
        if (error) {
          // return reject(error.message);
          return reject(error);
        } else {
          return resolve(result.rows);
        }
      });
    });
  },

  getDetail: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM users_profile WHERE id = '${id}'`,
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

  add: ({
    email,
    mobile_number,
    delivery_address,
    display_name,
    first_name,
    last_name,
    birth_date,
    gender,
  }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO users_profile (id, email, mobile_number, delivery_address, display_name, first_name, last_name, birth_date, gender) VALUES ('${uuidv4()}', '${email}', '${mobile_number}','${delivery_address}', '${display_name}', '${first_name}', '${last_name}','${birth_date}', '${gender}' )`,
        (error) => {
          if (error) {
            return reject(error.message);
          } else {
            return resolve({
              email,
              mobile_number,
              delivery_address,
              display_name,
              first_name,
              last_name,
              birth_date,
              gender,
            });
          }
        }
      );
    });
  },

  updateByPut: ({
    id,
    email,
    mobile_number,
    delivery_address,
    display_name,
    first_name,
    last_name,
    birth_date,
    gender,
  }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE users_profile SET email = '${email}', mobile_number = '${mobile_number}', delivery_address = '${delivery_address}', '${display_name}', '${first_name}', '${last_name}','${birth_date}', ${gender} WHERE id = '${id}'`,
        (error) => {
          if (error) {
            return reject(error.message);
          } else {
            return resolve({
              id,
              email,
              mobile_number,
              delivery_address,
              display_name,
              first_name,
              last_name,
              birth_date,
              gender,
            });
          }
        }
      );
    });
  },

  updateByPatch: ({
    id,
    email,
    mobile_number,
    delivery_address,
    display_name,
    first_name,
    last_name,
    birth_date,
    gender,
  }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM users_profile WHERE id = '${id}'`,
        (error, result) => {
          if (error) {
            return reject(error.message);
          } else {
            db.query(
              `UPDATE users_profile SET email='${
                email || result.rows[0].email
              }', mobile_number='${
                mobile_number || result.rows[0].mobile_number
              }',
            delivery_address='${
              delivery_address || result.rows[0].delivery_address
            }' 
            display_name='${display_name || result.rows[0].display_name}' 
            first_name='${first_name || result.rows[0].first_name}' 
            last_name='${last_name || result.rows[0].last_name}' 
            birth_date='${birth_date || result.rows[0].birth_date}' 
            gender='${gender || result.rows[0].gender}' 
            WHERE id='${id}'`,
              (error) => {
                if (error) {
                  return reject(error.message);
                } else {
                  return resolve({
                    id,
                    email,
                    mobile_number,
                    delivery_address,
                    display_name,
                    first_name,
                    last_name,
                    birth_date,
                    gender,
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
      db.query(`DELETE FROM users_profile WHERE id = '${id}'`, (error) => {
        if (error) {
          return reject(error.message);
        } else {
          return resolve(`Deleting data users profile ${id} successfully`);
        }
      });
    });
  },
};

module.exports = usersProfileModel;
