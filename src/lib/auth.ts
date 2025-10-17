import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const getCurrentUserSession = () => {
  return getServerSession(authOptions);
};