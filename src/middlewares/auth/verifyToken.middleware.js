const jwt = require('jsonwebtoken');
const { USER_TYPE_CODE, SECRETKEY } = require('../../common/common.constants');
const authenTicate = (req, res, next) => {
  try {
    const token = req.header('Authorization');
    const deCode = jwt.verify(token, SECRETKEY);
    req.account = deCode;
    next();
  } catch (error) {
    res.status(400).send({
      code: 400,
      message: 'Your are not sign in',
      success: false,
    });
  }
};

const permissions = (req, res, next) => {
  try {
    const { account } = req;
    if (
      USER_TYPE_CODE.includes(account.userTypeCode) &&
      account !== parseInt(req.params.account)
    ) {
      next();
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(400).send({
      code: 400,
      message: 'Your Are note permissions remove account',
      success: false,
    });
  }
};

module.exports = {
  authenTicate,
  permissions,
};
