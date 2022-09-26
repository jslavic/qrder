import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Company } from "../../store/slices/auth.slice";

type Props = {
  company?: Company;
  pathname?: string;
};

const CompanyAuthGuard = ({ company, pathname = "/" }: Props) => {
  if (!company) return <Navigate to={pathname} replace />;
  return <Outlet />;
};

export default CompanyAuthGuard;
