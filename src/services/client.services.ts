class StyleResPonse {
  result?: {
    data?: any;
    errorCode?: number;
    errors?: string;
  };
  returnCode?: number;
  success?: boolean;
}

const configResPonse = (resPonse: StyleResPonse) => {
  const { result, returnCode, success } = resPonse;
  return {
    result: {
      data: result.data,
      errorCode: result.errorCode,
      errors: result.errors,
    },
    returnCode,
    success,
  };
};

module.exports = {
  configResPonse,
};
