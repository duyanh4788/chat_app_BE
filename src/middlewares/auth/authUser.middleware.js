const checkEmpty = (req, res, next) => {
  const { account, passWord, fullName, email } = req.body;
  if (account !== "" && passWord !== "" && fullName !== "" && email !== "") {
    next();
  } else {
    res.status(400).send({
      code: 400,
      message: "Vui lòng nhập đầy đủ thông tin",
      success: false,
    });
  }
};

const checkAccount = (Model) => async (req, res, next) => {
  const { account } = req.body;
  const data = await Model.findOne({ account });
  if (!data) {
    next();
  } else {
    res.status(400).send({
      code: 400,
      message: "Tài khoản đã tồn tại",
      success: false,
    });
  }
};

const checkEmailPattern = (req, res, next) => {
  const { email } = req.body;
  const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email.match(pattern)) {
    next();
  } else {
    res.status(400).send({
      code: 400,
      message: "Vui lòng nhập đúng định dạng email",
      success: false,
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
      code: 400,
      message: "Email đã tồn tại",
      success: false,
    });
  }
};

const checkAccountSingin = (Model) => async (req, res, next) => {
  const { account } = req.body;
  const data = await Model.findOne({ account });
  if (data) {
    next();
  } else {
    res.status(400).send({
      code: 400,
      message: "Tài khoàn không tồn tại",
      success: false,
    });
  }
};

const checkNumber = (req, res, next) => {
  const { phone } = req.body;
  const pattern = /^[0-9]+$/;
  if (phone.match(pattern)) {
    next();
  } else {
    res.status(400).send({
      code: 400,
      message: "Vui lòng nhập số",
      success: false,
    });
  }
};

const checkReqLength = (req, res, next) => {
  const { account, passWord, fullName, email } = req.body;
  if (
    account.length > 4 &&
    account.length < 30 &&
    passWord.length > 4 &&
    passWord.length < 30 &&
    fullName.length > 5 &&
    fullName.length < 30 &&
    email.length > 5 &&
    email.length < 30
  ) {
    next();
  } else {
    res.status(400).send({
      code: 400,
      message: "Độ dài ký tự từ 6 => 20",
      success: false,
    });
  }
};

const checkFullName = (req, res, next) => {
  const { fullName } = req.body;
  if (fullName !== typeof "string") {
    next();
  } else {
    res.status(400).send({
      code: 400,
      message: "Họ tên sai định dạng",
      success: false,
    });
  }
};

module.exports = {
  checkAccount,
  checkEmailExits,
  checkEmpty,
  checkEmailPattern,
  checkNumber,
  checkReqLength,
  checkFullName,
};
