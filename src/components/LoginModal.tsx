import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User as UserIcon, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginModal() {
  const { isLoginModalOpen, setIsLoginModalOpen, login, register, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  
  // States para los formularios
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (user?.isAdmin) {
      setIsLoginModalOpen(false);
      navigate('/admin');
    }
  }, [user, navigate, setIsLoginModalOpen]);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      login(email, password);
    } else {
      register(name, email, password, address);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setIsLoginModalOpen(false)}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[32px] shadow-2xl z-50 p-8 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <X size={20} className="text-slate-500" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserIcon size={32} className="text-brand-primary" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">
            {isLogin ? 'Bienvenido de nuevo' : 'Crear cuenta'}
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            {isLogin ? 'Ingresa tus datos para continuar con tu compra' : 'Regístrate para poder enviar tu pedido'}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nombre completo</label>
                <div className="relative">
                  <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Dirección de envío</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Calle 123 # 45 - 67, Ciudad"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
                    required
                  />
                </div>
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Correo electrónico</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="email" 
                placeholder="juan@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contraseña</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
                required
              />
            </div>
          </div>

          {isLogin && (
            <div className="flex justify-end">
              <button type="button" className="text-sm font-medium text-brand-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 transition-all mt-6"
          >
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-brand-primary font-bold hover:underline"
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
