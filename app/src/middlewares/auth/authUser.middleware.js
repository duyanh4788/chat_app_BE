const checkAccount = (Model) => async (req, res, next) => {
  const { account } = req.body;
  const data = await Model.findOne({
    Where: {
      account,
    },
  });
  if (!data) {
    next();
  } else {
    res.status(400).send({
      message: "ACCOUNT ALREADY EXITS",
    });
  }
};

const checkEmailExits = (Model) => async (req, res, next) => {
  const { email } = req.body;
  const data = await Model.findOne({
    Where: {
      email,
    },
  });
  if (!data) {
    next();
  } else {
    res.status(400).send({
      message: "EMAIL ALREADY EXITS",
    });
  }
};

module.exports = {
  checkAccount,
  checkEmailExits,
};
