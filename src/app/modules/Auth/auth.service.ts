const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  console.log(payload);
};

export const authServices = {
  loginUserIntoDB,
};
