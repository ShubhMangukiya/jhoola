// const jwt = require("jsonwebtoken");

// module.exports = function (req, res, next) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Attach decoded user info
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };


// // const jwt = require("jsonwebtoken");

// // /**
// //  * Middleware to authenticate and optionally authorize user roles
// //  * @param {string[]} roles - Optional array of roles that are allowed
// //  */
// // function auth(roles = []) {
// //   return (req, res, next) => {
// //     const authHeader = req.headers.authorization;

// //     if (!authHeader || !authHeader.startsWith("Bearer ")) {
// //       return res.status(401).json({ message: "No token provided" });
// //     }

// //     const token = authHeader.split(" ")[1];

// //     try {
// //       const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //       req.user = decoded;

// //       // If roles are provided, check for authorization
// //       if (roles.length > 0 && !roles.includes(decoded.role)) {
// //         return res.status(403).json({ message: "Access denied: insufficient permissions" });
// //       }

// //       next();
// //     } catch (error) {
// //       return res.status(401).json({ message: "Invalid token" });
// //     }
// //   };
// // }

// // module.exports = auth;

const jwt = require("jsonwebtoken");

function authorize(allowedRoles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Role check
      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: insufficient role" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}

module.exports = authorize;

