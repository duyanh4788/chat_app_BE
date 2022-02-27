const checkEmpty = (req, res, next) => {
  const { account, passWord, fullName, email } = req.body;
  if (account !== "" && passWord !== "" && fullName !== "" && email !== "") {
    next();
  } else {
    res.status(400).send({ message: "Vui lòng nhập đầy đủ thông tin" });
  }
};

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

const checkEmailPattern = (req, res, next) => {
  const { email } = req.body;
  const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email.match(pattern)) {
    next();
  } else {
    res.status(400).send({
      message: "Vui lòng nhập đúng định dạng email",
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

const checkAccountSingin = (Model) => async (req, res, next) => {
  const { account } = req.body;
  const data = await Model.findOne({ account });
  if (data) {
    next();
  } else {
    res.status(400).send({
      message: "Tài khoàn không tồn tại",
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
      message: "PHONE ONLY NUMBER",
    });
  }
};

const checkReqLength = (req, res, next) => {
  const { account, passWord, fullName, email } = req.body;
  if (
    account.length > 5 &&
    account.length < 30 &&
    passWord.length > 5 &&
    passWord.length < 30 &&
    fullName.length > 5 &&
    fullName.length < 30 &&
    email.length > 5 &&
    email.length < 30
  ) {
    next();
  } else {
    res.status(400).send({
      message: "Độ dài ký tự từ 6 => 20",
    });
  }
};

const checkFullName = (req, res, next) => {
  const { fullName } = req.body;
  if (fullName !== typeof "string") {
    next();
  } else {
    res.status(400).send({
      message: "Họ tên sai định dạng",
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
