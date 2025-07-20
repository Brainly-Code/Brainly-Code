import { createContext } from "react";

const UserRole = "admin" | "teacher" | "student";
export const UserRoleContext = createContext<UserRole>("student"); 