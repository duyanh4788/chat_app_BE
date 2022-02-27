const checkAccount = (Model) => async (req, res, next) => {
  const { account } = req.body;
  const data = await Model.findOne({ account });
  if (!data) {
    next();
  } else {
    res.status(400).send({
      message: "Tài khoản đã tồn tại",
    });
  }
};

const checkEmailExits = (Model) => async (req, res, next) => {
  const { email } = req.body;
  const data = await Model.findOne({ email });
  if (!data) {
    next();
  } else {
    res.status(400).send({
      message: "Email đã tồn tại",
    });
  }
};

module.exports = {
  checkAccount,
  checkEmailExits,
};
