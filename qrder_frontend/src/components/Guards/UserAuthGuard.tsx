import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { User } from "../../store/slices/auth.slice";

type Props = {
  user?: User;
  pathname?: string;
};

const UserAuthGuard = ({ user, pathname = "/" }: Props) => {
  if (!user) return <Navigate to={pathname} replace />;
  return <Outlet />;
};

export default UserAuthGuard;
