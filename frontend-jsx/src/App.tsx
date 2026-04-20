import { useEffect } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { useAuthStore } from './store/backend.response';

export default function App() {
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">Cargando sistema...</p>
      </div>
    );
  }

  return (
    <div className="antialiased text-gray-900 selection:bg-blue-100">
      {isAuthenticated ? <Dashboard /> : <Login />}
    </div>
  );
}