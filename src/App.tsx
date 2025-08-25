import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';
import IncomeExpense from './pages/PersonalFinanceTracker';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile';
import Header from './components/Header';
import ChatPage from './pages/Chat';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ForgotPasswordPage from './pages/ForgotPassword';
import BookletView from './pages/Booklet';
import BookletCreate from './components/BookletCreate';
import BookletListPage from './components/BookletListPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Footer from './components/Footer';

function App() {
  const location = useLocation();
  const noHeaderRoutes = ['/login', '/register', '/reset-password', '/forgot-password'];
  const showHeader = !noHeaderRoutes.includes(location.pathname);

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      {/* Fixed Header */}
      {showHeader && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
          <Header />
        </div>
      )}

      {/* Main Content */}
      <main
        className={
          showHeader
            ? "flex-1 overflow-y-auto pt-14" // adjust pt-16 to match Header height
            : "flex-1"
        }
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/pftracker" element={<IncomeExpense />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/credebt/:userA/:userB" element={<ChatPage />} />
            <Route path="/booklets/:id" element={<BookletView />} />
            <Route path="/booklets/create" element={<BookletCreate />} />
            <Route path="/booklets" element={<BookletListPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Route>
        </Routes>
      {/* <Footer /> */}

      </main>
      <Footer />
    </div>
  );
}


export default App;