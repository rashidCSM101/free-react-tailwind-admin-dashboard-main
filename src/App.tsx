import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useEffect } from 'react';
import { useAppDispatch } from './store/hooks';
import { loadUserFromStorage } from './store/slices/authSlice';

// App initialization component
function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    // Load user from localStorage on app start
    console.log("🔄 Loading user from localStorage...");
    dispatch(loadUserFromStorage());
  }, [dispatch]);
  
  return <>{children}</>;
}
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Clients from "./pages/Clients";
import Bot from "./pages/Bot";
import Crypto from "./pages/Crypto";
import { ProtectedRoute, AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <Provider store={store}>
      <AppInitializer>
        <AuthProvider>
          <Router>
          <ScrollToTop />
          <Routes>
          {/* Dashboard Layout (Protected) */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/bot" element={<Bot />} />
            <Route path="/crypto" element={<Crypto />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="/error-404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
          </Router>
        </AuthProvider>
      </AppInitializer>
    </Provider>
  );
}
