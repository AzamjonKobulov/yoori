import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/layouts/AppLayout";
import { ToastProvider } from "./components";
import CommercialOfferDetails from "./pages/CommercialOfferDetails";
import CommercialOffers from "./pages/CommercialOffers";
import WebPreview from "./pages/WebPreview";
import Products from "./pages/Products";
import Clients from "./pages/Clients";
import Templates from "./pages/Templates";
import Users from "./pages/Users";
import Currencies from "./pages/Currencies";
import Integrations from "./pages/Integrations";
import SignIn from "./pages/auth/SignIn";
import RecoveryPassword from "./pages/auth/RecoveryPassword";
import PasRecMsgSentToEmail from "./pages/auth/PasRecMsgSentToEmail";
import EmailConfirmation from "./pages/auth/EmailConfirmation";
import SignUp from "./pages/auth/SignUp";
import Scenarios from "./pages/Scenarios";
import Plans from "./pages/Plans";
import Graphics from "./pages/Graphics";
import NotFound from "./pages/404";
import SubscriptionExpired from "./pages/SubscriptionExpired";
import SubscriptionExpiredUser from "./pages/SubscriptionExpiredUser";

function App() {
  return (
    <ToastProvider>
      <Routes>
        {/* Routes with AppLayout (main app) */}
        <Route
          path="/"
          element={
            <AppLayout>
              <CommercialOffers />
            </AppLayout>
          }
        />
        <Route
          path="/details"
          element={
            <AppLayout>
              <CommercialOfferDetails />
            </AppLayout>
          }
        />
        <Route
          path="/products"
          element={
            <AppLayout>
              <Products />
            </AppLayout>
          }
        />
        <Route
          path="/clients"
          element={
            <AppLayout>
              <Clients />
            </AppLayout>
          }
        />
        <Route
          path="/templates"
          element={
            <AppLayout>
              <Templates />
            </AppLayout>
          }
        />
        <Route
          path="/users"
          element={
            <AppLayout>
              <Users />
            </AppLayout>
          }
        />
        <Route
          path="/currencies"
          element={
            <AppLayout>
              <Currencies />
            </AppLayout>
          }
        />
        <Route
          path="/integrations"
          element={
            <AppLayout>
              <Integrations />
            </AppLayout>
          }
        />
        <Route
          path="/scenarios"
          element={
            <AppLayout>
              <Scenarios />
            </AppLayout>
          }
        />
        <Route
          path="/plans"
          element={
            <AppLayout>
              <Plans />
            </AppLayout>
          }
        />
        <Route
          path="/graphics"
          element={
            <AppLayout>
              <Graphics />
            </AppLayout>
          }
        />
        <Route
          path="/subscription-expired"
          element={
            <AppLayout>
              <SubscriptionExpired />
            </AppLayout>
          }
        />
        <Route
          path="/subscription-expired-user"
          element={
            <AppLayout>
              <SubscriptionExpiredUser />
            </AppLayout>
          }
        />

        {/* Routes without AppLayout (standalone pages) */}
        <Route path="/preview" element={<WebPreview />} />
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/auth/recovery-password" element={<RecoveryPassword />} />
        <Route
          path="/auth/pas-rec-msg-sent-to-email"
          element={<PasRecMsgSentToEmail />}
        />
        <Route
          path="/auth/email-confirmation"
          element={<EmailConfirmation />}
        />
        <Route path="/auth/sign-up" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
