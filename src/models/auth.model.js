const db = require("../helpers/db-connection");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const authModel = {
  login: ({ email, password }) => {
    // const queryText = `SELECT * FROM users WHERE email = $1 AND password = $2 `;
    // const queryValue = [email, password];
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM users WHERE email = $1`,
        [email],
        (err, result) => {
          if (err) {
            // error handling ketika ada query yang salah
            return reject(err.message);
            // return reject("error woy");
          } else {
            // cek kevalidan inputan user dengan isi database
            // console.log(result.rows);
            if (result.rows.length == 0) {
              return reject("Wrong email/password");
            } else {
              // console.log(result.rows[0].role);
              // jika email tidak kosong, maka cek password
              // 3 param dengan menggunakan bcrypt.compare()
              // 1. password inputan user, 2. hashing password yang tersimpan, 3. callback
              // OR
              // 1. password inputan user, 2. hashing password dari inputan yang akan dicocokkan dengan database, 3. callback
              bcrypt.compare(
                password,
                result.rows[0].password,
                (err, hashingResult) => {
                  if (err) return reject("Wrong email/password"); // jika ada kesalahan hashing / kesalahan server
                  if (!hashingResult) {
                    return reject("Wrong email/password");
                  } else {
                    return resolve(result.rows[0]);
                    // return resolve("uhuy");
                  }
                }
              );
            }
          }
        }
      );
    });
  },

  register: ({ email, username, password, phone }) => {
    return new Promise((resolve, reject) => {
      db.query(
        // `INSERT INTO users (user_id, email, password, phone, role) VALUES ($1, $2, $3, $4, $5)`,
        // [uuidv4(), email, password, phone, role],
        `INSERT INTO users (id, email, username, password, phone) VALUES ($1, $2, $3, $4, $5 )`,
        [uuidv4(), email, username, password, phone],
        // (error, result) => {
        (error) => {
          if (error) {
            return reject(error.message);
          } else {
            return resolve({
              email,
              username,
              password,
              phone,
            });
          }
        }
      );
    });
  },
};

module.exports = authModel;
