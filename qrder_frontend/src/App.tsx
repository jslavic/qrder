import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Cookie from "js-cookie";
import Footer from "./components/Layouts/Home/HomeFooter/HomeFooter";
import Navbar from "./components/Layouts/Home/HomeNavbar/HomeNavbar";
import IndexPage from "./pages";
import DashboardOrders from "./pages/dashboard/orders";
import DashboardProducts from "./pages/dashboard/products";
import DashbaordQRCodes from "./pages/dashboard/qr-codes";
import PartnerLoginPage from "./pages/partner/login";
import UserOrders from "./pages/orders/[qrData]";
import PartnerRegisterPage from "./pages/partner/register";
import PaymentsPage from "./pages/partner/register/payments";
import { RootState } from "./store";
import UserRegisterPage from "./pages/user/register";
import { setAuthUser } from "./helpers/auth/setAuthUser";
import { setAuthCompany } from "./helpers/auth/setAuthCompany";
import NoAuthGuard from "./components/Guards/NoAuthGuard";
import CompanyAuthGuard from "./components/Guards/CompanyAuthGuard";
import DashboardHistory from "./pages/dashboard/history";
import DashboardAnalytics from "./pages/dashboard/analytics";
import DashboardSettings from "./pages/dashboard/settings";
import DashboardWithdraw from "./pages/dashboard/withdraw";
import DashboardAnalyticsProductItem from "./pages/dashboard/analytics/item";
import { authActions } from "./store/slices/auth.slice";

type Props = {};

const App = (props: Props) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { user, company, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const login = async () => {
      if (user || company) return;
      const authType = Cookie.get("AuthType");
      if (authType === "User") await setAuthUser(dispatch);
      if (authType === "Company") await setAuthCompany(dispatch);
      dispatch(authActions.stopLoading());
    };
    login();
  }, [dispatch, company, user]);

  if (isLoading) return <></>;

  return (
    <>
      {!pathname.startsWith("/dashboard") ? (
        <>
          <Navbar />
        </>
      ) : (
        <></>
      )}
      <Routes>
        <Route
          path="/"
          element={
            company ? (
              <Navigate to={"/dashboard/orders"} replace />
            ) : (
              <IndexPage />
            )
          }
        />

        <Route element={<NoAuthGuard company={company} user={user} />}>
          <Route path="/partner/register" element={<PartnerRegisterPage />} />
          <Route path="/partner/register/payment" element={<PaymentsPage />} />
          <Route path="/partner/login" element={<PartnerLoginPage />} />

          <Route path="/user/register" element={<UserRegisterPage />} />
        </Route>

        <Route element={<CompanyAuthGuard company={company} />}>
          <Route path="/dashboard/orders" element={<DashboardOrders />} />
          <Route path="/dashboard/history" element={<DashboardHistory />} />
          <Route
            path="/dashboard/analytics/product"
            element={<DashboardAnalyticsProductItem />}
          />
          <Route path="/dashboard/analytics" element={<DashboardAnalytics />} />
          <Route path="/dashboard/products" element={<DashboardProducts />} />
          <Route path="/dashboard/qr-codes" element={<DashbaordQRCodes />} />
          <Route path="/dashboard/settings" element={<DashboardSettings />} />
          <Route path="/dashboard/withdraw" element={<DashboardWithdraw />} />
        </Route>

        <Route path="/orders/:qrData" element={<UserOrders />} />
      </Routes>
      {!pathname.startsWith("/dashboard") ? <Footer /> : <></>}
    </>
  );
};

export default App;
