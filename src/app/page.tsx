"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Auth from '../components/Auth';
import { 
  ShoppingCart, Package, History, TrendingUp, Search, 
  Plus, Minus, X, Save, User, Trash2, Edit3, Download, PieChart, CheckCircle, LogOut 
} from 'lucide-react';

export default function ByoparERP() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Billing');
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [sales, setSales] = useState([]);
  
  // Modal & Input States
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, cost: 0, stock: 0 });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user.email);
        fetchAllData();
      }
    };
    checkUser();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    const { data: inv } = await supabase.from('inventory').select('*').order('name');
    const { data: led } = await supabase.from('ledger').select('*').order('name');
    const { data: sls } = await supabase.from('sales').select('*').order('created_at', { ascending: false });
    
    if (inv) setInventory(inv);
    if (led) setLedger(led);
    if (sls) setSales(sls);
    setLoading(false);
  };

  // --- FEATURE 1: DYNAMIC BILLING & STOCK LOGIC ---
  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (item.stock <= (existing?.qty || 0)) return alert("Out of Stock!");
    
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  // --- FEATURE 2: REAL-TIME CHECKOUT (Updates Database) ---
  const handleCheckout = async () => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const profit = cart.reduce((sum, item) => sum + ((item.price - item.cost) * item.qty), 0);

    // 1. Record the Sale
    await supabase.from('sales').insert([{ total, profit, items: cart.length }]);

    // 2. Update Stock in Inventory
    for (const item of cart) {
      await supabase.from('inventory')
        .update({ stock: item.stock - item.qty })
        .eq('id', item.id);
    }

    setCart([]);
    fetchAllData();
    alert("Sale Completed Successfully!");
  };

  // --- FEATURE 3: INVENTORY MANAGEMENT (CRUD) ---
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) return;
    await supabase.from('inventory').insert([newProduct]);
    setShowAddProduct(false);
    setNewProduct({ name: '', price: 0, cost: 0, stock: 0 });
    fetchAllData();
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) return <Auth onLogin={(email) => setUser(email)} />;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column' }}>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
      
      {/* HEADER */}
      <header style={{ padding: '15px', background: '#1e293b', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981', margin: 0 }}>BARKAT ALI ERP</h1>
        <LogOut size={18} onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }} />
      </header>

      {/* NAVIGATION */}
      <nav style={{ display: 'flex', background: '#1e293b', padding: '10px', gap: '8px', overflowX: 'auto', borderBottom: '1px solid #334155' }}>
        {[
          { id: 'Billing', icon: <ShoppingCart size={16}/> },
          { id: 'Inventory', icon: <Package size={16}/> },
          { id: 'Udhaar', icon: <User size={16}/> },
          { id: 'History', icon: <History size={16}/> }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 15px', borderRadius: '12px', border: 'none', backgroundColor: activeTab === tab.id ? '#10b981' : '#334155', color: 'white', fontWeight: 'bold' }}>
            {tab.icon} {tab.id}
          </button>
        ))}
      </nav>

      <main style={{ flex: 1, padding: '15px', paddingBottom: '120px' }}>
        
        {/* --- BILLING SECTION --- */}
        {activeTab === 'Billing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: '#1e293b', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
              <Search size={18} color="#94a3b8"/>
              <input 
                type="text" 
                placeholder="Search Sufi, Lux, Tapal..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: 'none', border: 'none', color: 'white', paddingLeft: '10px', width: '100%', outline: 'none' }} 
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {filteredInventory.map(item => (
                <div key={item.id} onClick={() => addToCart(item)} style={{ background: '#1e293b', padding: '15px', borderRadius: '15px', border: item.stock < 5 ? '1px solid #ef4444' : '1px solid #334155', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{item.name}</div>
                  <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '16px' }}>Rs. {item.price}</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>Stock: {item.stock}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- INVENTORY TAB --- */}
        {activeTab === 'Inventory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={() => setShowAddProduct(true)} style={{ width: '100%', padding: '15px', background: '#3b82f6', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Plus size={18}/> ADD NEW PRODUCT
            </button>
            {inventory.map(item => (
              <div key={item.id} style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Sale: Rs. {item.price} | Stock: {item.stock}</div>
                </div>
                <Edit3 size={18} color="#3b82f6"/>
              </div>
            ))}
          </div>
        )}

        {/* --- UDHAAR LEDGER --- */}
        {activeTab === 'Udhaar' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {ledger.map(person => (
              <div key={person.id} style={{ background: '#1e293b', padding: '15px', borderRadius: '15px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{person.name}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{person.phone}</div>
                </div>
                <div style={{ color: person.balance > 0 ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>Rs. {person.balance}</div>
              </div>
            ))}
          </div>
        )}

        {/* --- SALES HISTORY & PROFIT --- */}
        {activeTab === 'History' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sales.map(sale => (
              <div key={sale.id} style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                   <span style={{ fontSize: '12px', color: '#94a3b8' }}>{new Date(sale.created_at).toLocaleTimeString()}</span>
                   <span style={{ fontWeight: 'bold', color: '#10b981' }}>Rs. {sale.total}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>Profit: Rs. {sale.profit}</div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- FLOATING BILLING DRAWER --- */}
      {cart.length > 0 && activeTab === 'Billing' && (
        <div style={{ position: 'fixed', bottom: '0', left: '0', right: '0', background: '#1e293b', padding: '20px', borderTop: '2px solid #10b981', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', boxShadow: '0 -5px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
             <span>{cart.length} Items Selected</span>
             <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#10b981' }}>Rs. {cartTotal()}</span>
          </div>
          <button onClick={handleCheckout} style={{ width: '100%', padding: '16px', background: '#10b981', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold', fontSize: '16px' }}>
            CONFIRM SALE & UPDATE STOCK
          </button>
        </div>
      )}

      {/* --- ADD PRODUCT MODAL --- */}
      {showAddProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 100 }}>
          <div style={{ background: '#1e293b', width: '100%', padding: '20px', borderRadius: '20px' }}>
             <h3 style={{ marginBottom: '15px' }}>Add Product to Cloud</h3>
             <input placeholder="Name" onChange={e => setNewProduct({...newProduct, name: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '10px', background: '#0f172a', border: 'none', color: 'white', borderRadius: '8px' }} />
             <input placeholder="Sale Price" type="number" onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} style={{ width: '100%', padding: '12px', marginBottom: '10px', background: '#0f172a', border: 'none', color: 'white', borderRadius: '8px' }} />
             <input placeholder="Purchase Cost" type="number" onChange={e => setNewProduct({...newProduct, cost: parseFloat(e.target.value)})} style={{ width: '100%', padding: '12px', marginBottom: '10px', background: '#0f172a', border: 'none', color: 'white', borderRadius: '8px' }} />
             <input placeholder="Stock Qty" type="number" onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})} style={{ width: '100%', padding: '12px', marginBottom: '10px', background: '#0f172a', border: 'none', color: 'white', borderRadius: '8px' }} />
             <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setShowAddProduct(false)} style={{ flex: 1, padding: '12px', background: '#334155', border: 'none', borderRadius: '8px', color: 'white' }}>Cancel</button>
                <button onClick={handleAddProduct} style={{ flex: 1, padding: '12px', background: '#10b981', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold' }}>Save to Cloud</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}