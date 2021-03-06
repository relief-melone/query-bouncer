export default (req, res, next): void => {
  res.header('Access-Control-Allow-Origin', typeof(req.headers.origin) === 'string' ? req.headers.origin : '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, UPDATE');

  next();
};