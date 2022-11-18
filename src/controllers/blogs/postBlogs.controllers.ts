import { Request, Response } from "express";
import { HydratedDocument } from "mongoose";
import { verifyUserToken } from "../../middleware/token";
import { Blog } from "../../models/blog.model";
import { User } from "../../models/user.model";
import { IBlog, IUser } from "../../utils/typings";

export const postBlog = async (req: Request, res: Response): Promise<any> => {
  try {
    // const sessionId = req.headers.cookie;
    // if (!sessionId) {
    //   return res.status(302).json({ message: "Please Log In" });
    // }
    // const verifiedToken = await verifyUserToken(sessionId);
    // if (!verifiedToken) {
    //   return res.status(403).json({ message: "Bad Credentials" });
    // }
    // console.log(verifiedToken)
    // console.log(sessionId);
    // const getAuthor: IUser | null = await User.findOne({
    //   sessionId: sessionId,
    // });
    // if (getAuthor === null) {
    //   return res.status(404).json({ message: "User Not Found" });
    // }
    const {
      title,
      author,
      description,
      content,
      categories,
      images,
      urls,
      shareLink,
    } = req.body;

    const blog: HydratedDocument<IBlog> = new Blog({
      title,
      description,
      content,
      categories,
      images,
      urls,
      shareLink,
      author,
      created_At: Date.now(),
      updated_At: Date.now(),
    });
    await blog.save();
    res.status(201).json({ message: "Blog Added Successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; // Need to get session id back from token
