import { useState } from 'react';
import { authService } from '@/services/auth.service'; // Ajusta la ruta a tu archivo

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await authService.login({ email, password });
      authService.saveToken(data.token);
      // Redirigir o actualizar estado global aquí
      console.log('Login exitoso', data);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      {/* Contenedor tipo Card manual */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        
        {/* Header del Card */}
        <div className="p-8 pb-4 text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
            {/* Font Awesome: Server */}
            <i className="fas fa-server text-white text-2xl"></i>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">TechServices Hub</h2>
            <p className="mt-2 text-gray-500">Sistema de Gestión de Servicios</p>
          </div>
        </div>

        {/* Contenido del Card */}
        <div className="p-8 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Campo Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {/* Font Awesome: Mail */}
                  <i className="fas fa-envelope text-sm"></i>
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Campo Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {/* Font Awesome: Lock */}
                  <i className="fas fa-lock text-sm"></i>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md flex items-center">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-md shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span>
                  <i className="fas fa-circle-notch fa-spin mr-2"></i>
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;