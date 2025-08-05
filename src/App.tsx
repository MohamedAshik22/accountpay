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

function App() {
  const location = useLocation();

  // Routes where header should not be shown
  const noHeaderRoutes = ['/login', '/register', '/reset-password', '/forgot-password'];

  return (
    <div className="flex flex-col min-h-screen">
      {!noHeaderRoutes.includes(location.pathname) && <Header />}
      <main className="flex-grow">
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

          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;