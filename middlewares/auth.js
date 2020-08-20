const jwt = require('jsonwebtoken');

const tempKey = '09a0fdc421445fae5719b27f4d280f760e9a457dffd627e617d4992e6e4aa05f';

/* Почему в теории курса приводятся образцы кода, не проходящие проверку линтера? */
// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, tempKey);
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
