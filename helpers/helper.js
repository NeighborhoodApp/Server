const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class Helper {
  static hashPassword(password) {
    const salt = bcrypt.genSaltSync(+process.env.SALT);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  static comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }

  static signToken(payload) {
    const token = jwt.sign(payload, process.env.SECRET);
    return token;
  }

  static verifyToken(token) {
    const decoded = jwt.verify(token, process.env.SECRET);
    return decoded;
  }

  static calculateDistance(userCoordinat, timeline) {
    const result = []
    timeline.forEach(el => {
      if (el.privacy === 'member') {
        result.push(el)
      }
      const estateCoordinat = el.User.RealEstate.coordinate.replace(/\s/g, "").split(',')
      let R = 6371; // km
      let dLat = toRad(estateCoordinat[0] - userCoordinat[0]);
      let dLon = toRad(estateCoordinat[1] - userCoordinat[1]);
      let lat1 = toRad(userCoordinat[0]);//user0
      let lat2 = toRad(estateCoordinat[0]);

      let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      let d = R * c;

      if (d <= 1) {
        result.push(el)
      }
    })
    // Converts numeric degrees to radians
    function toRad(value) {
      return value * (Math.PI / 180);
    }

    return result
  }
}

module.exports = Helper;
