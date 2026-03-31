"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; 
import Auth from '../components/Auth';
import Inventory from '../components/Inventory';
import Billing from '../components/Billing';
import Analytics from '../components/Analytics';
import Receipt from '../components/Receipt';
import Expenses from '../components/Expenses'; // <--- NEW IMPORT
import { DebtLedger } from '../components/Ledger';
import { Receipt as ReceiptIcon, Clock, Package, Users, BarChart3, LogOut, History, Globe, WalletMinimal } from 'lucide-react';

export default function ByoparApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [owner, setOwner] = useState({ id: null, store: "" });
  const [activeTab, setActiveTab] = useState('pos');
  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: "", phone: "", payMethod: "Cash" });
  const [orderQueue, setOrderQueue] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);

  const fetchAllData = async () => {
    const { data: inv } = await supabase.from('inventory').select('*');
    if (inv) setInventory(inv);
    const { data: sales } = await supabase.from('sales_history').select('*').order('created_at', { ascending: false });
    if (sales) setSalesHistory(sales);
  };

  useEffect(() => {
    const sessionData = localStorage.getItem('byopar_session');
    if (sessionData) {
      setOwner(JSON.parse(sessionData));
      fetchAllData();
    }
  }, [isLoggedIn]);

  const handleFinalize = async () => {
    if (!customer.name || cart.length === 0) return alert("Fill Details!");
    const total = cart.reduce((s, i) => s + (i.total || 0), 0);
    const newOrder = { id: Date.now(), customer: customer.name, phone: customer.phone, items: [...cart], total: total, payMethod: customer.payMethod };
    for (const item of cart) {
      const { data: cur } = await supabase.from('inventory').select('stock_qty').eq('id', item.id).single();
      if (cur) await supabase.from('inventory').update({ stock_qty: cur.stock_qty - item.orderQty }).eq('id', item.id);
    }
    setOrderQueue([newOrder, ...orderQueue]);
    setLastOrder(newOrder); 
    setCart([]); setCustomer({ name: "", phone: "", payMethod: "Cash" });
  };

  const deliverOrder = async (order) => {
    const { error } = await supabase.from('sales_history').insert([{
      customer_name: order.customer,
      customer_phone: order.phone,
      total_amount: order.total,
      payment_method: order.payMethod,
      status: order.payMethod === 'Debt' ? 'unpaid' : 'paid'
    }]);
    if (!error) {
      setOrderQueue(orderQueue.filter(o => o.id !== order.id));
      fetchAllData();
    }
  };

  if (!isLoggedIn) return <Auth onLogin={(email, store) => { setOwner({id: email, store}); setIsLoggedIn(true); localStorage.setItem('byopar_session', JSON.stringify({id:email, store})); }} />;

  const navBtn = (id) => ({
    display: 'flex', alignItems: 'center', gap: '15px', padding: '16px 20px', borderRadius: '18px', cursor: 'pointer',
    backgroundColor: activeTab === id ? '#3b82f6' : 'transparent', color: activeTab === id ? 'white' : '#64748b',
    fontWeight: '800', border: 'none', width: '100%', textAlign: 'left', marginBottom: '8px', transition: '0.2s'
  });

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0f172a', color: 'white', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
      <aside style={{ width: '280px', backgroundColor: '#1e293b', padding: '40px 25px', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '50px' }}>
          <div style={{background:'#10b98122', padding:'10px', borderRadius:'15px'}}><BarChart3 color="#10b981"/></div>
          <h1 style={{ color: 'white', fontSize: '26px', fontWeight: '900', margin: '0' }}>Byopar</h1>
        </div>
        <nav style={{ flex: 1 }}>
          <button style={navBtn('pos')} onClick={() => setActiveTab('pos')}><ReceiptIcon size={20}/> Billing</button>
          <button style={navBtn('queue')} onClick={() => setActiveTab('queue')}><Clock size={20}/> Preparation</button>
          <button style={navBtn('inventory')} onClick={() => setActiveTab('inventory')}><Package size={20}/> Stock</button>
          <button style={navBtn('register')} onClick={() => setActiveTab('register')}><Users size={20}/> Udhaar Ledger</button>
          <button style={navBtn('expenses')} onClick={() => setActiveTab('expenses')}><WalletMinimal size={20}/> Expense Khata</button>
          <button style={navBtn('reports')} onClick={() => setActiveTab('reports')}><BarChart3 size={20}/> Analytics</button>
          <button style={navBtn('history')} onClick={() => setActiveTab('history')}><History size={20}/> History</button>
        </nav>
        <button onClick={() => {localStorage.removeItem('byopar_session'); setIsLoggedIn(false);}} style={{ background:'#ef444411', border:'1px solid #ef444433', color:'#ef4444', padding:'15px', borderRadius:'18px', fontWeight:'800', cursor:'pointer' }}>End Session</button>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '100px', backgroundColor: '#1e293b55', backdropFilter: 'blur(10px)', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 50px' }}>
          <div><p style={{color:'#64748b', fontSize:'11px', fontWeight:'900', textTransform:'uppercase'}}>Store Management</p><b style={{fontSize:'18px'}}>{owner.store}</b></div>
          <div style={{textAlign:'right'}}><p style={{fontSize:'10px', color:'#10b981', fontWeight:'900'}}><Globe size={10}/> CLOUD CONNECTED</p></div>
        </header>

        <main style={{ flex: 1, padding: '50px', overflowY: 'auto' }}>
          {activeTab === 'pos' && <Billing inventory={inventory} cart={cart} setCart={setCart} customer={customer} setCustomer={setCustomer} onFinalize={handleFinalize} />}
          {activeTab === 'inventory' && <Inventory inventory={inventory} setInventory={fetchAllData} />}
          {activeTab === 'reports' && <Analytics sales={salesHistory} inventory={inventory} />}
          {activeTab === 'register' && <DebtLedger sales={salesHistory} onUpdate={fetchAllData} />}
          {activeTab === 'expenses' && <Expenses />}
          {/* Preparation and History logic remains same... */}
        </main>
      </div>

      {lastOrder && <Receipt order={lastOrder} onClose={() => setLastOrder(null)} />}
    </div>
  );
}