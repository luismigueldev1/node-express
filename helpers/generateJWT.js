const jwt = require("jsonwebtoken");

const generateJWT = (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };
    const jwtSecret = process.env.JWT_SECRET;
    const options = { expiresIn: "4h" };

    jwt.sign(
      payload,
      jwtSecret,
      options,

      (err, token) => {
        if (err) {
          console.log(err);
          reject("Error Creating JWT");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generateJWT,
};
