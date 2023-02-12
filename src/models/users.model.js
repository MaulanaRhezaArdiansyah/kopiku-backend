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
      db.query(`SELECT * FROM users WHERE id = '${id}'`, (error, result) => {
        if (error) {
          return reject(error.message);
          // return reject("aaa");
        } else {
          return resolve(result.rows[0]);
        }
      });
    });
  },
  // before
  // add: ({
  //   email,
  //   password,
  //   phone,
  //   displayname,
  //   firstname,
  //   lastname,
  //   image,
  //   gender,
  //   birthdate,
  //   delivery_address,
  // }) => {
  //   // ('${uuidv4()}', '${displayname}', '${firstname}','${lastname}', '${birthdate}', '${gender}', '${delivery_address}', '${image}',  )
  //   return new Promise((resolve, reject) => {
  //     db.query(
  //       `INSERT INTO users (user_id, email, password, phone, displayname, firstname, lastname, image, gender, birthdate, delivery_address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  //       `,
  //       [
  //         uuidv4(),
  //         email,
  //         password,
  //         phone,
  //         displayname,
  //         firstname,
  //         lastname,
  //         image,
  //         gender,
  //         birthdate,
  //         delivery_address,
  //       ],
  //       (error) => {
  //         if (error) {
  //           return reject(error.message);
  //         } else {
  //           return resolve({
  //             email,
  //             password,
  //             phone,
  //             displayname,
  //             firstname,
  //             lastname,
  //             image,
  //             gender,
  //             birthdate,
  //             delivery_address,
  //           });
  //         }
  //       }
  //     );
  //   });
  // },
  //after
  add: ({
    email,
    password,
    phone,
    username,
    firstname,
    lastname,
    gender,
    birthday,
    delivery_address,
    file,
  }) => {
    // ('${uuidv4()}', '${displayname}', '${firstname}','${lastname}', '${birthday}', '${gender}', '${delivery_address}', '${image}',  )
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO users (id, email, password, phone, username, firstname, lastname, gender, birthday, delivery_address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id
        `,
        [
          uuidv4(),
          email,
          password,
          phone,
          username,
          firstname,
          lastname,
          gender,
          birthday,
          delivery_address,
        ],
        (error, result) => {
          if (error) {
            return reject(error.message);
          } else {
            // console.log(result.rows);
            // console.log(file);
            db.query(
              `INSERT INTO user_avatars (avatar_id, user_id, name, filename) VALUES ('${uuidv4()}', '${
                result.rows[0].id
              }'
              , '${username}', '${file.filename}') `
            );
            return resolve({
              email,
              password,
              phone,
              username,
              firstname,
              lastname,
              gender,
              birthday,
              delivery_address,
              avatar: file,
            });
          }
        }
      );
    });
  },

  updateByPatch: ({
    id,
    username,
    firstname,
    lastname,
    email,
    image,
    gender,
    phone,
    birthday,
    delivery_address,
    file,
    // password,
  }) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM users WHERE id = '${id}'`, (error, result) => {
        if (error) {
          return reject(error.message);
        } else {
          // if (result.rows[0].user_id != id) {
          // return reject("id not found");
          // } else {
          // console.log(result.rows[0]);
          db.query(
            `UPDATE users SET username='${
              username || result.rows[0].username
            }', 
                firstname='${firstname || result.rows[0].firstname}',
                lastname='${lastname || result.rows[0].lastname}', 
                email='${email || result.rows[0].email}',
                image = '${image || result.rows[0].image}' ,
                gender = '${gender || "Male"}',
                birthday = '${birthday || result.rows[0].birthday}',
                phone = '${phone || result.rows[0].phone}',
                delivery_address = '${
                  delivery_address || result.rows[0].delivery_address
                }'
                WHERE id = '${id}'`,
            (error) => {
              if (error) {
                return reject(error.message);
              } else {
                // if (file.length == 0) {
                if (file == undefined) {
                  return resolve({
                    id,
                    username,
                    firstname,
                    lastname,
                    email,
                    image,
                    gender,
                    phone,
                    birthday,
                    delivery_address,
                  });
                }
                db.query(
                  `SELECT avatar_id, filename, name FROM user_avatars WHERE user_id = '${id}'`,
                  (errorAvatar, userAvatar) => {
                    if (errorAvatar) {
                      return reject({ message: errorAvatar.message });
                    }
                    db.query(
                      `UPDATE user_avatars SET filename = $1, name = $2, WHERE avatar_id = $3`,
                      [file.filename, username, userAvatar.rows.avatar_id],
                      (error, result) => {
                        if (error) {
                          return reject({
                            message: "Failed to update user profile!",
                          });
                        }
                        return resolve({
                          id,
                          username,
                          firstname,
                          lastname,
                          email,
                          image,
                          gender,
                          phone,
                          birthday,
                          delivery_address,
                          oldAvatar: userAvatar.rows,
                          avatar: file,
                          //password
                        });
                      }
                    );
                  }
                );
              }
            }
          );
          // }
        }
      });
    });
  },

  remove: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`DELETE FROM users WHERE id = '${id}'`, (error, result) => {
        if (error) {
          return reject(error.message);
        } else {
          // return resolve(result.rows, "Deleting data successfully");
          // console.log(result);
          return resolve(result.rows);
        }
      });
    });
  },
};

module.exports = usersModel;
