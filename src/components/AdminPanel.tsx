import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProductsContext } from '../context/ProductContext';
import { ArrowLeft, Plus, Image as ImageIcon, CheckCircle, Package, Edit2, Trash2, X, BarChart2, Users, MousePointer2, Search } from 'lucide-react';
import { Category, Product } from '../types';
import { getAnalyticsStats } from '../lib/analytics';

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, removeProduct } = useProductsContext();

  const [activeTab, setActiveTab] = useState<'products' | 'analytics'>('products');

  // Estados del formulario
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category>('Ventiladores');
  const [image, setImage] = useState('');
  const [promotion, setPromotion] = useState('');
  const [success, setSuccess] = useState(false);

  const [stats, setStats] = useState(getAnalyticsStats());

  useEffect(() => {
    // Proteger ruta de admin
    if (!user || !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab === 'analytics') {
      setStats(getAnalyticsStats());
    }
  }, [activeTab]);

  if (!user || !user.isAdmin) return null;

  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setDescription(p.description);
    setPrice(p.price.toString());
    setCategory(p.category as Category);
    setImage(p.image);
    setPromotion(p.promotion || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice('');
    setImage('');
    setPromotion('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name,
      description,
      price: Number(price),
      category,
      image: image || 'https://images.unsplash.com/photo-1550009158-9effb64fda70?auto=format&fit=crop&q=80&w=600',
      promotion: promotion ? promotion : undefined,
    };

    if (editingId) {
      updateProduct(editingId, productData);
    } else {
      addProduct(productData);
    }

    // Limpiar formulario y mostrar éxito
    handleCancelEdit();
    setSuccess(true);
    
    setTimeout(() => setSuccess(false), 3000);
  };

  const categories: Category[] = ['Ventiladores', 'TV', 'Lavadoras', 'Neveras'];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <main className="flex-1 transition-all p-4 md:p-8 lg:p-12 max-w-6xl mx-auto w-full">
        <button
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors font-medium"
        >
          <ArrowLeft size={18} />
          Volver a la tienda
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center">
              <Package size={24} className="text-brand-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900">Panel de Administración</h1>
              <p className="text-slate-500">Gestiona el catálogo y revisa las estadísticas</p>
            </div>
          </div>
          <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-100">
            <button 
              onClick={() => setActiveTab('products')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Catálogo
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Estadísticas
            </button>
          </div>
        </div>

        {activeTab === 'products' ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Formulario (Ocupa 1 columna en pantallas grandes) */}
            <div className="xl:col-span-1 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 h-fit sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  {editingId ? <Edit2 size={18} className="text-brand-primary"/> : <Plus size={18} className="text-brand-primary"/>}
                  {editingId ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                {editingId && (
                  <button onClick={handleCancelEdit} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                    <X size={16} />
                  </button>
                )}
              </div>

              {success && (
                <div className="mb-6 p-3 bg-green-50 text-green-700 border border-green-200 rounded-xl flex items-center gap-2 text-sm">
                  <CheckCircle size={16} />
                  <span className="font-semibold">{editingId ? '¡Actualizado!' : '¡Agregado exitosamente!'}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:bg-white focus:border-brand-primary/30 focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Precio</label>
                    <input 
                      type="number" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:bg-white focus:border-brand-primary/30 focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:bg-white focus:border-brand-primary/30 focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Promoción</label>
                  <input 
                    type="text" 
                    value={promotion}
                    onChange={(e) => setPromotion(e.target.value)}
                    placeholder="Ej. -20% Dto"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:bg-white focus:border-brand-primary/30 focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:bg-white focus:border-brand-primary/30 focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none min-h-[80px] resize-y"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">URL Imagen</label>
                  <div className="relative">
                    <ImageIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="url" 
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:bg-white focus:border-brand-primary/30 focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none"
                    />
                  </div>
                  {image && (
                    <div className="mt-2 text-center">
                      <img src={image} alt="Vista previa" className="w-full h-24 object-cover rounded-lg border border-slate-100" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300?text=Error')} />
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full py-3 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl font-bold shadow-md shadow-brand-primary/20 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    {editingId ? <CheckCircle size={18} /> : <Plus size={18} />}
                    {editingId ? 'Guardar Cambios' : 'Agregar Producto'}
                  </button>
                </div>
              </form>
            </div>

            {/* Lista de Productos (Ocupa 2 columnas en pantallas grandes) */}
            <div className="xl:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 mb-4 px-2">Catálogo Actual</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map(p => (
                  <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 hover:shadow-md transition-shadow group">
                    <img src={p.image} alt={p.name} className="w-20 h-20 rounded-xl object-cover border border-slate-50" />
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{p.name}</h3>
                      <p className="text-brand-primary font-bold text-sm mt-1">${p.price.toLocaleString()}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {p.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 justify-center border-l border-slate-100 pl-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(p)}
                        className="p-2 bg-slate-50 hover:bg-brand-light text-slate-600 hover:text-brand-primary rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`¿Estás seguro de eliminar "${p.name}"?`)) {
                            removeProduct(p.id);
                          }
                        }}
                        className="p-2 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-500 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {products.length === 0 && (
                  <div className="col-span-1 sm:col-span-2 py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-100 border-dashed">
                    No hay productos en el catálogo.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Tarjetas de Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Users size={24} />
                  </div>
                </div>
                <h3 className="text-slate-500 text-sm font-medium mb-1">Nuevos Registros</h3>
                <p className="text-3xl font-display font-bold text-slate-900">{stats.registrations}</p>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                    <MousePointer2 size={24} />
                  </div>
                </div>
                <h3 className="text-slate-500 text-sm font-medium mb-1">Clics a WhatsApp</h3>
                <p className="text-3xl font-display font-bold text-slate-900">{stats.whatsappClicks}</p>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                    <BarChart2 size={24} />
                  </div>
                </div>
                <h3 className="text-slate-500 text-sm font-medium mb-1">Vistas a Productos</h3>
                <p className="text-3xl font-display font-bold text-slate-900">{stats.totalViews}</p>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                    <Search size={24} />
                  </div>
                </div>
                <h3 className="text-slate-500 text-sm font-medium mb-1">Búsquedas Totales</h3>
                <p className="text-3xl font-display font-bold text-slate-900">{stats.searches}</p>
              </div>
            </div>

            {/* Tops */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Search size={18} className="text-brand-primary" />
                  Términos más buscados
                </h3>
                <div className="space-y-4">
                  {Object.entries(stats.topSearches).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([term, count], index) => (
                    <div key={term} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center">{index + 1}</span>
                        <span className="font-medium text-slate-700 capitalize">{term}</span>
                      </div>
                      <span className="bg-brand-light text-brand-primary px-3 py-1 rounded-lg text-sm font-bold">{count} búsquedas</span>
                    </div>
                  ))}
                  {Object.keys(stats.topSearches).length === 0 && (
                    <p className="text-slate-500 text-center py-4">No hay datos de búsqueda todavía.</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <BarChart2 size={18} className="text-brand-primary" />
                  Productos más vistos
                </h3>
                <div className="space-y-4">
                  {Object.entries(stats.topProducts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([slug, count], index) => {
                    const p = products.find(prod => prod.name.toLowerCase().replace(/\s+/g, "-").replace(/"/g, "") === slug);
                    return (
                      <div key={slug} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center">{index + 1}</span>
                          <span className="font-medium text-slate-700 truncate max-w-[200px]">{p ? p.name : slug}</span>
                        </div>
                        <span className="bg-brand-light text-brand-primary px-3 py-1 rounded-lg text-sm font-bold">{count} vistas</span>
                      </div>
                    );
                  })}
                  {Object.keys(stats.topProducts).length === 0 && (
                    <p className="text-slate-500 text-center py-4">No hay datos de vistas todavía.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
