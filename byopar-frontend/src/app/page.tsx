"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Auth from '../components/Auth';
import { 
  ShoppingCart, Package, History, TrendingUp, Search, Plus, Minus, X, 
  User, Trash2, Edit3, Download, CheckCircle, Clock, Truck, LogOut, Save, Printer
} from 'lucide-react';

export default function ByoparERP() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Billing');
  const [loading, setLoading] = useState(true);
  
  // Database States
  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]); // Preparation/Tracking
  const [ledger, setLedger] = useState([]); // Udhaar Section
  const [salesHistory, setSalesHistory] = useState([]);

  // UI/Modal States
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [newProd, setNewProd] = useState({ name: '', price: 0, cost: 0, stock: 0 });

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user.email);
        refreshAllData();
      }
    };
    init();
  }, []);

  const refreshAllData = async () => {
    setLoading(true);
    try {
      const { data: inv } = await supabase.from('inventory').select('*').order('name');
      const { data: led } = await supabase.from('ledger').select('*').order('name');
      const { data: sls } = await supabase.from('sales').select('*').order('created_at', { ascending: false });
      const { data: ord } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      
      if (inv) setInventory(inv);
      if (led) setLedger(led);
      if (sls) setSalesHistory(sls);
      if (ord) setOrders(ord);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  // --- 1. POS TERMINAL & BILLING ENGINE ---
  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (item.stock <= (existing?.qty || 0)) return alert("Out of Stock!");
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const calculateTotal = () => cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

  const completeCheckout = async (type, customerId = null) => {
    const total = calculateTotal();
    const profit = cart.reduce((s, i) => s + ((i.price - i.cost) * i.qty), 0);

    // FEATURE: SAVE SALE TO HISTORY
    const { data: saleData } = await supabase.from('sales').insert([{ total, profit, items_count: cart.length }]).select();
    
    // FEATURE: ORDER PREPARATION & TRACKING
    await supabase.from('orders').insert([{ items: cart, total, status: 'Preparing', type: type }]);

    // FEATURE: REAL-TIME STOCK UPDATE
    for (const item of cart) {
      await supabase.from('inventory').update({ stock: item.stock - item.qty }).eq('id', item.id);
    }

    // FEATURE: UDHAAR LEDGER OPERATION
    if (type === 'Udhaar' && customerId) {
      const customer = ledger.find(l => l.id === customerId);
      await supabase.from('ledger').update({ balance: (customer.balance || 0) + total }).eq('id', customerId);
    }

    setCart([]);
    setShowCheckoutModal(false);
    refreshAllData();
    setActiveTab('Tracking'); // Auto-switch to tracking
    alert(`Success: Order placed via ${type}`);
  };

  // --- 2. INVENTORY CRUD (Working Ability) ---
  const saveProduct = async () => {
    if (!newProd.name || !newProd.price) return alert("Fill Name and Price");
    await supabase.from('inventory').insert([newProd]);
    setShowAddProduct(false);
    setNewProd({ name: '', price: 0, cost: 0, stock: 0 });
    refreshAllData();
  };

  const deleteProduct = async (id) => {
    if(confirm("Delete this item?")) {
      await supabase.from('inventory').delete().eq('id', id);
      refreshAllData();
    }
  };

  if (!user) return <Auth onLogin={(email) => setUser(email)} />;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
      
      <header style={{ padding: '15px', background: '#1e293b', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981', margin: 0 }}>BARKAT ALI ERP</h1>
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>Admin Mode Active</span>
        </div>
        <LogOut size={18} onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }} />
      </header>

      {/* NAV - ALL FEATURES ACCESSIBLE */}
      <nav style={{ display: 'flex', background: '#1e293b', padding: '10px', gap: '8px', overflowX: 'auto', borderBottom: '1px solid #334155' }}>
        {['Billing', 'Tracking', 'Inventory', 'Udhaar', 'Reports'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 18px', borderRadius: '12px', border: 'none', backgroundColor: activeTab === tab ? '#10b981' : '#334155', color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            {tab}
          </button>
        ))}
      </nav>

      <main style={{ flex: 1, padding: '15px', paddingBottom: '130px' }}>
        
        {/* 1. POS TERMINAL / BILLING */}
        {activeTab === 'Billing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: '#1e293b', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
              <Search size={18} color="#94a3b8"/>
              <input type="text" placeholder="Search Sufi, Tapal..." onChange={(e) => setSearchTerm(e.target.value)} style={{ background: 'none', border: 'none', color: 'white', paddingLeft: '10px', width: '100%', outline: 'none' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {inventory.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                <div key={item.id} onClick={() => addToCart(item)} style={{ background: '#1e293b', padding: '15px', borderRadius: '15px', border: item.stock < 5 ? '1px solid #ef4444' : '1px solid #334155', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{item.name}</div>
                  <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '16px' }}>Rs. {item.price}</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>Stock: {item.stock}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. ORDER PREPARATION & TRACKING (Working Ability) */}
        {activeTab === 'Tracking' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {orders.length === 0 && <p style={{textAlign:'center', color:'#94a3b8'}}>No active orders</p>}
            {orders.map(order => (
              <div key={order.id} style={{ background: '#1e293b', padding: '15px', borderRadius: '15px', borderLeft: order.status === 'Delivered' ? '5px solid #10b981' : '5px solid #f59e0b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>Order #{order.id.toString().slice(-4)}</span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>{order.type}</span>
                </div>
                <div style={{ margin: '8px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {order.status === 'Preparing' ? <Clock size={14} color="#f59e0b"/> : <CheckCircle size={14} color="#10b981"/>}
                  Status: <span style={{ fontWeight: 'bold' }}>{order.status}</span>
                </div>
                {order.status === 'Preparing' && (
                  <button onClick={async () => { await supabase.from('orders').update({status: 'Delivered'}).eq('id', order.id); refreshAllData(); }} style={{ width: '100%', padding: '10px', background: '#10b981', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold' }}>MARK AS DELIVERED</button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 3. INVENTORY CRUD (Working Ability) */}
        {activeTab === 'Inventory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={() => setShowAddProduct(true)} style={{ padding: '15px', background: '#3b82f6', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold' }}>+ ADD NEW CLOUD PRODUCT</button>
            {inventory.map(item => (
              <div key={item.id} style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Sale: Rs. {item.price} | Cost: Rs. {item.cost} | Stock: {item.stock}</div>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <Edit3 size={18} color="#3b82f6"/>
                  <Trash2 size={18} color="#ef4444" onClick={() => deleteProduct(item.id)}/>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. UDHAAR LEDGER (Working Ability) */}
        {activeTab === 'Udhaar' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {ledger.map(person => (
              <div key={person.id} style={{ background: '#1e293b', padding: '15px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', border: '1px solid #334155' }}>
                <div><div style={{ fontWeight: 'bold' }}>{person.name}</div><div style={{ fontSize: '11px', color: '#94a3b8' }}>Phone: {person.phone || 'N/A'}</div></div>
                <div style={{ color: person.balance > 0 ? '#ef4444' : '#10b981', fontWeight: 'bold', fontSize: '18px' }}>Rs. {person.balance}</div>
              </div>
            ))}
          </div>
        )}

        {/* 5. REPORTS & SALE HISTORY (Working Ability) */}
        {activeTab === 'Reports' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', padding: '25px', borderRadius: '20px' }}>
              <div style={{ opacity: 0.8 }}>Total Cloud Revenue</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>Rs. {salesHistory.reduce((s, x) => s + x.total, 0)}</div>
              <div style={{ fontSize: '12px', marginTop: '5px' }}>Total Profit: Rs. {salesHistory.reduce((s, x) => s + x.profit, 0)}</div>
            </div>
            <div style={{ background: '#1e293b', padding: '15px', borderRadius: '15px' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>Sale History Log</h4>
              {salesHistory.slice(0, 10).map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #0f172a', fontSize: '12px' }}>
                   <span>{new Date(s.created_at).toLocaleTimeString()}</span>
                   <span style={{ color: '#10b981', fontWeight: 'bold' }}>+ Rs. {s.total}</span>
                </div>
              ))}
            </div>
            <button onClick={() => window.print()} style={{ padding: '15px', borderRadius: '15px', border: '2px solid #10b981', background: 'none', color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Download size={18}/> DOWNLOAD PDF REPORT
            </button>
          </div>
        )}
      </main>

      {/* POS CART & PROCEED BUTTON */}
      {cart.length > 0 && activeTab === 'Billing' && (
        <div style={{ position: 'fixed', bottom: '0', left: '0', right: '0', background: '#1e293b', padding: '20px', borderTop: '2px solid #10b981', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', boxShadow: '0 -10px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
             <span style={{ fontSize: '14px' }}>{cart.length} Items Selected</span>
             <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>Rs. {calculateTotal()}</span>
          </div>
          <button onClick={() => setShowCheckoutModal(true)} style={{ width: '100%', padding: '16px', background: '#10b981', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold', fontSize: '16px' }}>PROCEED TO PAYMENT</button>
        </div>
      )}

      {/* CHECKOUT MODAL: CASH OR UDHAAR */}
      {showCheckoutModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 100 }}>
          <div style={{ background: '#1e293b', width: '100%', padding: '25px', borderRadius: '24px', border: '1px solid #334155' }}>
            <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Payment Method</h3>
            <button onClick={() => completeCheckout('Cash')} style={{ width: '100%', padding: '18px', background: '#10b981', borderRadius: '12px', marginBottom: '12px', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '16px' }}>CASH PAYMENT</button>
            <div style={{ margin: '15px 0', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>CHARGE TO UDHAAR ACCOUNT:</div>
            <div style={{ maxHeight: '180px', overflowY: 'auto', marginBottom: '15px' }}>
               {ledger.map(c => (
                 <button key={c.id} onClick={() => completeCheckout('Udhaar', c.id)} style={{ width: '100%', padding: '12px', background: '#334155', borderRadius: '8px', border: 'none', color: 'white', marginBottom: '8px', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{c.name}</span>
                    <span>Rs. {c.balance}</span>
                 </button>
               ))}
            </div>
            <button onClick={() => setShowCheckoutModal(false)} style={{ width: '100%', background: 'none', border: 'none', color: '#ef4444', fontWeight: 'bold' }}>CANCEL ORDER</button>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL: Working CRUD */}
      {showAddProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 100 }}>
          <div style={{ background: '#1e293b', width: '100%', padding: '25px', borderRadius: '24px' }}>
            <h3 style={{ marginBottom: '15px' }}>New Cloud Product</h3>
            <input placeholder="Product Name" onChange={e => setNewProd({...newProd, name: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '10px', background: '#0f172a', border: 'none', color: 'white', borderRadius: '8px' }} />
            <input placeholder="Sale Price (Rs)" type="number" onChange={e => setNewProd({...newProd, price: parseFloat(e.target.value)})} style={{ width: '100%', padding: '12px', marginBottom: '10px', background: '#0f172a', border: 'none', color: 'white', borderRadius: '8px' }} />
            <input placeholder="Purchase Cost (Rs)" type="number" onChange={e => setNewProd({...newProd, cost: parseFloat(e.target.value)})} style={{ width: '100%', padding: '12px', marginBottom: '10px', background: '#0f172a', border: 'none', color: 'white', borderRadius: '8px' }} />
            <input placeholder="Initial Stock" type="number" onChange={e => setNewProd({...newProd, stock: parseInt(e.target.value)})} style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#0f172a', border: 'none', color: 'white', borderRadius: '8px' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={saveProduct} style={{ flex: 1, padding: '15px', background: '#10b981', borderRadius: '12px', border: 'none', color: 'white', fontWeight: 'bold' }}>SAVE TO CLOUD</button>
              <button onClick={() => setShowAddProduct(false)} style={{ flex: 1, padding: '15px', background: '#334155', borderRadius: '12px', border: 'none', color: 'white' }}>CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}