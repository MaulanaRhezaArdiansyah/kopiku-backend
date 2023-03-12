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
        if (error) return reject(error.message);
        const dataUser = result.rows[0];
        const userID = result?.rows[0]?.id;
        db.query(
          `SELECT * FROM history WHERE user_id = '${userID}'`,
          (errorHistory, resultHistory) => {
            if (errorHistory) return reject(errorHistory.message);
            const history = resultHistory.rows;
            return resolve({ ...dataUser, history });
          }
        );
        // return resolve(dataUser, );
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
    // firstname,
    // lastname,
    // gender,
    email,
    image,
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
          const dataUser = result.rows[0];
          // gender = '${gender || "Male"}',
          db.query(
            `UPDATE users SET 
                username='${username || dataUser.username}', 
                email='${email || dataUser.email}',
                phone = '${phone || dataUser.phone}',
                birthday = '${birthday || dataUser.birthday}',
                delivery_address = '${
                  delivery_address || dataUser.delivery_address
                }'
                WHERE id = '${id}'`,
            (errorUpdate) => {
              if (errorUpdate) {
                return reject(errorUpdate.message);
              } else {
                if (file == undefined) {
                  return resolve({
                    id,
                    username,
                    email,
                    // gender,
                    image,
                    phone,
                    birthday,
                    delivery_address,
                  });
                }
                db.query(
                  `SELECT image FROM users WHERE id = '${id}'`,
                  (errorAvatar, userAvatar) => {
                    const resultImageUser = userAvatar.rows[0];
                    if (errorAvatar) {
                      return reject({ message: errorAvatar.message });
                    }
                    db.query(
                      `UPDATE users SET image = $1 WHERE id = '${id}'`,
                      [file.filename],
                      (errorUpdateAvatar) => {
                        if (errorUpdateAvatar) {
                          return reject(errorUpdateAvatar.message);
                        }
                        return resolve({
                          id,
                          username,
                          email,
                          // gender,
                          phone,
                          birthday,
                          delivery_address,
                          oldAvatar: resultImageUser.image,
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
