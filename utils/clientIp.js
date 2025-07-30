// utils/getClientIp.js
const getClientIp = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",").shift() || // Behind proxies/load balancers
    req.socket?.remoteAddress ||
    req.ip
  );
};

module.exports = getClientIp;
