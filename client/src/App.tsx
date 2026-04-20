import { useState } from 'react'
import Login from '@/components/Login';
import { Dashboard } from '@/components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('token')
  );

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <>
      {isAuthenticated
        ? <Dashboard onLogout={handleLogout} />
        : <Login onLoginSuccess={handleLoginSuccess} />
      }
    </>
  );
}

export default App;
