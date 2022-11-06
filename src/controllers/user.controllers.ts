import { Request, response, Response } from "express";
import { HydratedDocument } from "mongoose";
import { User } from "../models/user.model";
import { IUser } from "../utils/typings";
import { passHash } from "../utils/passHashing";
import { generateToken } from "../utils/token";
import { upload } from "../utils/multerConfig";

export const getUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const users: Array<IUser> | null = await User.find(
      {},
      "name username country"
    ).populate("blogs", "-author");
    if (users === null) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Success!" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserByUsername = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { username } = req.params;

    const user: IUser | null = await User.findOne(
      { username },
      "name username country"
    ).populate("blogs", "-author-password");
    if (user === null) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      name: user?.name,
      username: user?.username,
      country: user?.country,
      blogs: user?.blogs,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const postUser = async (req: Request, res: Response): Promise<any> => {
  try {
    let { name, username, password, email, address, pincode, country } =
      req.body;

    const foundUser: IUser | null = await User.findOne({ username });
    if (foundUser !== null) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const hashedPass = await passHash(password);

    const user: HydratedDocument<IUser> = new User({
      name,
      username,
      password: hashedPass,
      email,
      address,
      pincode,
      country,
    });
    const token = generateToken(user);
    await user.save();
    res
      .cookie("userToken", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      })
      .status(201)
      .json({
        message: "User created successfully",
      });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
    console.log(error.message);
  }
};
