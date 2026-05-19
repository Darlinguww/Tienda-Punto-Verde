import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, Lock, User as UserIcon, MapPin, Phone, LogOut, Pencil, Check, Loader2, ChevronDown, Globe, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PHONE_CODES, DEPARTMENTS, CITIES_BY_DEPARTMENT } from '../lib/colombia';

type View = 'login' | 'register' | 'profile';

const inputClass = "w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none text-sm";
const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

// ── Combobox de ciudad ──────────────────────────────────────────────────────
function CityCombobox({ department, value, onChange, required }: {
  department: string; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const cities = CITIES_BY_DEPARTMENT[department] ?? [];
  const filtered = query
    ? cities.filter(c => c.toLowerCase().includes(query.toLowerCase()))
    : cities;

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={e => { setQuery(e.target.value); onChange(''); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={department ? 'Buscar ciudad...' : 'Selecciona un departamento primero'}
        disabled={!department}
        required={required}
        className={inputClass + ' disabled:opacity-50 disabled:cursor-not-allowed'}
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-20 w-full bg-white border border-slate-100 rounded-xl shadow-xl mt-1 max-h-44 overflow-y-auto">
          {filtered.map(city => (
            <button
              key={city}
              type="button"
              onMouseDown={() => { onChange(city); setQuery(city); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-brand-light hover:text-brand-primary transition-colors"
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Selector de prefijo telefónico ──────────────────────────────────────────
function PhoneCodeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = PHONE_CODES.find(p => p.code === value) ?? PHONE_CODES[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="h-full flex items-center gap-1.5 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-100 rounded-l-xl transition-colors text-sm font-semibold text-slate-700 whitespace-nowrap"
      >
        <span>{selected.flag}</span>
        <span>{selected.code}</span>
        <ChevronDown size={12} className="text-slate-400" />
      </button>
      {open && (
        <div className="absolute z-20 top-full left-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl w-48 max-h-52 overflow-y-auto">
          {PHONE_CODES.map(p => (
            <button
              key={p.code}
              type="button"
              onMouseDown={() => { onChange(p.code); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-brand-light hover:text-brand-primary transition-colors ${p.code === value ? 'text-brand-primary font-bold' : 'text-slate-700'}`}
            >
              <span>{p.flag}</span>
              <span className="font-semibold">{p.code}</span>
              <span className="text-slate-400 text-xs">{p.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Modal principal ─────────────────────────────────────────────────────────
export default function LoginModal() {
  const { isLoginModalOpen, setIsLoginModalOpen, login, register, logout, updateLocation, user } = useAuth();
  const navigate = useNavigate();

  const [view, setView] = useState<View>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState<string | null>(null); // nombre del recién registrado

  // Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Registro
  const [name, setName] = useState('');
  const [phoneCode, setPhoneCode] = useState('+57');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  // Edición de ubicación en perfil
  const [editingLocation, setEditingLocation] = useState(false);
  const [editDept, setEditDept] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editAddress, setEditAddress] = useState('');

  useEffect(() => {
    if (user?.isAdmin && isLoginModalOpen) { setIsLoginModalOpen(false); navigate('/admin'); }
  }, [user, navigate, setIsLoginModalOpen, isLoginModalOpen]);

  useEffect(() => {
    if (isLoginModalOpen) {
      setView(user ? 'profile' : 'login');
      setError(null);
      setEmail(''); setPassword('');
      setName(''); setPhoneCode('+57'); setPhoneNumber('');
      setDepartment(''); setCity(''); setAddress('');
      setEditingLocation(false);
      setRegistered(null);
    }
  }, [isLoginModalOpen, user]);

  if (!isLoginModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    const err = await login(email, password);
    if (err) setError(err);
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city) { setError('Selecciona una ciudad.'); return; }
    setLoading(true); setError(null);
    const err = await register({ name, email, password, whatsapp: `${phoneCode} ${phoneNumber}`, country: 'Colombia', department, city, address });
    if (err) { setError(err); setLoading(false); return; }
    setRegistered(name);
    setLoading(false);
    setTimeout(() => setIsLoginModalOpen(false), 2500);
  };

  const handleUpdateLocation = async () => {
    if (!editCity) { setError('Selecciona una ciudad.'); return; }
    setLoading(true); setError(null);
    const err = await updateLocation({ department: editDept, city: editCity, address: editAddress });
    if (err) { setError(err); } else { setEditingLocation(false); }
    setLoading(false);
  };

  const handleLogout = async () => { await logout(); setIsLoginModalOpen(false); };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50" onClick={() => setIsLoginModalOpen(false)} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[32px] shadow-2xl z-50 p-8 max-h-[90vh] overflow-y-auto">
        <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <X size={20} className="text-slate-500" />
        </button>

        {/* ── PERFIL ── */}
        {view === 'profile' && user && (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-3">
                <UserIcon size={32} className="text-brand-primary" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 font-display">Mi Perfil</h2>
            </div>

            <div className="space-y-3 mb-6">
              <InfoRow icon={<UserIcon size={16} />} label="Nombre" value={user.name} />
              <InfoRow icon={<Mail size={16} />} label="Correo" value={user.email} />
              {user.whatsapp && <InfoRow icon={<Phone size={16} />} label="WhatsApp" value={user.whatsapp} />}

              {/* Ubicación */}
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-slate-400" />
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Ubicación y dirección</span>
                  </div>
                  {!editingLocation && (
                    <button onClick={() => { setEditingLocation(true); setEditDept(user.department ?? ''); setEditCity(user.city ?? ''); setEditAddress(user.address ?? ''); setError(null); }} className="p-1.5 hover:bg-brand-light rounded-lg transition-colors">
                      <Pencil size={14} className="text-brand-primary" />
                    </button>
                  )}
                </div>

                {editingLocation ? (
                  <div className="space-y-2">
                    <select value={editDept} onChange={e => { setEditDept(e.target.value); setEditCity(''); }} className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-brand-primary/30">
                      <option value="">Departamento...</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <CityCombobox department={editDept} value={editCity} onChange={setEditCity} />
                    <input type="text" value={editAddress} onChange={e => setEditAddress(e.target.value)} placeholder="Dirección de envío" className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-brand-primary/30" />
                    {error && <p className="text-xs text-red-500">{error}</p>}
                    <div className="flex gap-2 pt-1">
                      <button onClick={handleUpdateLocation} disabled={loading} className="flex-1 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-1">
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Guardar
                      </button>
                      <button onClick={() => { setEditingLocation(false); setError(null); }} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-sm text-slate-700 font-medium ml-6">
                    {user.city && user.department && <p>{user.city}, {user.department}</p>}
                    <p className="text-slate-500">{user.address || 'Sin dirección registrada'}</p>
                  </div>
                )}
              </div>
            </div>

            <button onClick={handleLogout} className="w-full py-3 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 rounded-xl font-semibold transition-colors text-sm">
              <LogOut size={18} /> Cerrar sesión
            </button>
          </div>
        )}

        {/* ── ÉXITO DE REGISTRO ── */}
        {registered && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <span className="absolute -bottom-1 -right-1 text-2xl">🎉</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-display mb-2">
              ¡Bienvenido, {registered.split(' ')[0]}!
            </h2>
            <p className="text-slate-500 text-sm max-w-xs">
              Tu cuenta ha sido creada exitosamente. Ya puedes agregar productos al carrito y enviar tu pedido.
            </p>
            <div className="mt-6 flex gap-1.5">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* ── LOGIN / REGISTRO ── */}
        {view !== 'profile' && !registered && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-3">
                <UserIcon size={32} className="text-brand-primary" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 font-display">
                {view === 'login' ? 'Bienvenido de nuevo' : 'Crear cuenta'}
              </h2>
              <p className="text-slate-500 mt-1 text-sm">
                {view === 'login' ? 'Ingresa tus datos para continuar' : 'Regístrate para enviar tu pedido'}
              </p>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={view === 'login' ? handleLogin : handleRegister}>
              {view === 'register' && (
                <>
                  {/* Nombre */}
                  <div>
                    <label className={labelClass}>Nombre completo</label>
                    <div className="relative">
                      <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="Juan Pérez" value={name} onChange={e => setName(e.target.value)} className={inputClass} required />
                    </div>
                  </div>

                  {/* Teléfono con prefijo */}
                  <div>
                    <label className={labelClass}>WhatsApp</label>
                    <div className="flex">
                      <PhoneCodeSelect value={phoneCode} onChange={setPhoneCode} />
                      <input
                        type="tel"
                        placeholder="300 000 0000"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        className="flex-1 px-4 py-3 bg-slate-50 border border-l-0 border-slate-100 rounded-r-xl focus:bg-white focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Departamento */}
                  <div>
                    <label className={labelClass}>Departamento</label>
                    <div className="relative">
                      <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select
                        value={department}
                        onChange={e => { setDepartment(e.target.value); setCity(''); }}
                        className={inputClass + ' appearance-none cursor-pointer'}
                        required
                      >
                        <option value="">Selecciona tu departamento</option>
                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Ciudad (combobox buscable) */}
                  <div>
                    <label className={labelClass}>Ciudad</label>
                    <CityCombobox department={department} value={city} onChange={setCity} required />
                  </div>

                  {/* Dirección */}
                  <div>
                    <label className={labelClass}>Dirección de envío</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="Calle 123 # 45-67, Barrio" value={address} onChange={e => setAddress(e.target.value)} className={inputClass} required />
                    </div>
                  </div>

                  <hr className="border-slate-100" />
                </>
              )}

              <div>
                <label className={labelClass}>Correo electrónico</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" placeholder="juan@ejemplo.com" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} required />
                </div>
              </div>

              <div>
                <label className={labelClass}>Contraseña</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className={inputClass} required minLength={6} />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                {loading && <Loader2 size={18} className="animate-spin" />}
                {view === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-slate-500 text-sm">
                {view === 'login' ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}{' '}
                <button onClick={() => { setView(view === 'login' ? 'register' : 'login'); setError(null); }} className="text-brand-primary font-bold hover:underline">
                  {view === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
      <span className="text-slate-400 shrink-0">{icon}</span>
      <div>
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
