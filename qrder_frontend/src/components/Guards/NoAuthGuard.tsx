import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Company, User } from "../../store/slices/auth.slice";

type Props = {
  user?: User;
  company?: Company;
};

/**
 * This guard requires the visitor to not be already authenticated as a user or a company
 */
const NoAuthGuard = ({ user, company }: Props) => {
  if (user) return <Navigate to={"/"} replace />;
  if (company) return <Navigate to={"/dashboard/orders"} replace />;
  return <Outlet />;
};

export default NoAuthGuard;
