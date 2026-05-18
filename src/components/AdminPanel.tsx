import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProductsContext } from '../context/ProductContext';
import { ArrowLeft, Plus, Image as ImageIcon, CheckCircle, Package } from 'lucide-react';
import { Category } from '../types';

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { products, addProduct } = useProductsContext();

  // Estados del formulario
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category>('Ventiladores');
  const [image, setImage] = useState('');
  const [promotion, setPromotion] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Proteger ruta de admin
    if (!user || !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || !user.isAdmin) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addProduct({
      name,
      description,
      price: Number(price),
      category,
      image: image || 'https://images.unsplash.com/photo-1550009158-9effb64fda70?auto=format&fit=crop&q=80&w=600', // imagen por defecto si está vacía
      promotion: promotion ? promotion : undefined,
    });

    // Limpiar formulario y mostrar éxito
    setName('');
    setDescription('');
    setPrice('');
    setImage('');
    setPromotion('');
    setSuccess(true);
    
    setTimeout(() => setSuccess(false), 3000);
  };

  const categories: Category[] = ['Ventiladores', 'TV', 'Lavadoras', 'Neveras'];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <main className="flex-1 transition-all p-4 md:p-8 lg:p-12 max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors font-medium"
        >
          <ArrowLeft size={18} />
          Volver a la tienda
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center">
            <Package size={24} className="text-brand-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Panel de Administración</h1>
            <p className="text-slate-500">Agrega nuevos productos al catálogo ({products.length} productos actuales)</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          {success && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl flex items-center gap-3">
              <CheckCircle size={20} />
              <span className="font-semibold">¡Producto agregado exitosamente al catálogo!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nombre del Producto</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Ventilador Eco-Cool 3000"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Precio (COP)</label>
                  <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Ej. 150000"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Promoción (Opcional)</label>
                  <input 
                    type="text" 
                    value={promotion}
                    onChange={(e) => setPromotion(e.target.value)}
                    placeholder="Ej. -20% Dto, Envío Gratis"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Descripción</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción detallada del producto..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none min-h-[140px] resize-y"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">URL de la Imagen</label>
                  <div className="relative">
                    <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="url" 
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
                    />
                  </div>
                </div>

                {image && (
                  <div className="mt-4 p-2 border border-slate-100 rounded-xl bg-slate-50">
                    <p className="text-xs text-slate-500 font-semibold mb-2">Vista Previa:</p>
                    <img src={image} alt="Vista previa" className="w-full h-32 object-cover rounded-lg" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300?text=Error+de+Imagen')} />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button 
                type="submit"
                className="px-8 py-3.5 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 transition-all flex items-center gap-2"
              >
                <Plus size={20} />
                Agregar Producto
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
