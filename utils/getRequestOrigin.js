// utils/getRequestOrigin.js
const getRequestOrigin = (req) => {
  const protocol = req.protocol.toUpperCase(); // HTTP or HTTPS
  const host = req.get("host"); // domain or IP + port
  return `${protocol}:${host}`;
};

module.exports = getRequestOrigin;
