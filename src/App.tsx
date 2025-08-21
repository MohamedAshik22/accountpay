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

  const showHeaderFooter = !noHeaderRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ✅ Static Header */}
      {showHeaderFooter && <Header />}

      {/* ✅ Scrollable Content */}
      <main className="flex-1 overflow-y-auto">
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
      </main>

      {/* ✅ Static Footer */}
      {showHeaderFooter && <Footer />}
    </div>
  );
}


export default App;