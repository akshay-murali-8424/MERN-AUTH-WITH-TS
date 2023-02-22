import UserInterface from "./UserInterface";

declare global {
  namespace Express {
    interface Request {
      userId?:string;
    }
  }
}