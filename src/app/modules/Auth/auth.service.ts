import { UserStatus } from "@prisma/client";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import config from "../../../config";
import { Secret } from "jsonwebtoken";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE, // user jodi deleted/blocked na hoy. delete/blocked hoa user ke login korte dibo na
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
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
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
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
  } catch (error) {
    throw new Error("You are not authorized");
  }
  // checking the decoded user email from token is exists or not. If not then it will throw an
  //error from here
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
      status: UserStatus.ACTIVE, // user jodi deleted/blocked na hoy. delete/blocked hoa user ke token dibo na
    },
  });

  //generating the new accessToken
  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return accessToken;
};

const changePasswordIntoDB = async (user: any, payload: any) => {
 
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: user?.email,
      status:UserStatus.ACTIVE
    },
  });


  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
    );
    

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }

  const hashedPassword: string = await bcrypt.hash(payload?.newPassword, 12);

 const result =  await prisma.user.update({
    where: {
      email: userData?.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });
console.log(result);
  return {
    message:'Password change successfully'
  }
};

export const authServices = {
  loginUserIntoDB,
  generatingAccessTokenFromRefreshTokenIntoDB,
  changePasswordIntoDB,
};
