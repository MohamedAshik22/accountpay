import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';
import IncomeExpense from './pages/PersonalFinanceTracker';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';


function App() {
  return (
    <div>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pftracker" element={<IncomeExpense />} />
      </Routes>
    </div>
  );
}

export default App;
