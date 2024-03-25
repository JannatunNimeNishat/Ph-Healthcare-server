import { jwtHelpers } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "abcdefg",
    "5m"
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "abcdefgijkmnop",
    "30d"
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const generatingAccessTokenFromRefreshTokenIntoDB = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwt.verify(token, "abcdefgijkmnop");
    
  } catch (error) {
    throw new Error("You are not authorized");
  }
  // checking the decoded user email from token is exists or not. If not then it will throw an
  //error from here
  const userData = await prisma.user.findUniqueOrThrow({
    where:{
      email:decodedData?.email
    }
  });


  //generating the new accessToken
  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "abcdefg",
    "5m"
  );

  return accessToken;

};

export const authServices = {
  loginUserIntoDB,
  generatingAccessTokenFromRefreshTokenIntoDB,
};
