"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Auth from '../components/Auth';

export default function ByoparERP() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Stock');
  const [inventory, setInventory] = useState([]); // Real data from Cloud
  const [loading, setLoading] = useState(true);

  // 1. Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUser(user.email);
    };
    checkUser();
  }, []);

  // 2. Fetch Real Data from Supabase
  useEffect(() => {
    if (user) {
      const fetchStock = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('inventory').select('*');
        if (!error && data) setInventory(data);
        setLoading(false);
      };
      fetchStock();
    }
  }, [user]);

  if (!user) return <Auth onLogin={(email) => setUser(email)} />;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
      
      {/* NAVIGATION BAR */}
      <nav style={{ padding: '15px', background: '#1e293b', borderBottom: '1px solid #334155', display: 'flex', overflowX: 'auto', gap: '10px' }}>
        {['Billing', 'Stock', 'Ledger', 'Analytics'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: activeTab === tab ? '#10b981' : 'transparent', color: 'white', fontWeight: 'bold' }}>
            {tab}
          </button>
        ))}
      </nav>

      <main style={{ flex: 1, padding: '15px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>{activeTab} Dashboard</h2>

        {activeTab === 'Stock' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {loading ? <p>Loading Cloud Data...</p> : inventory.map((item) => (
              <div key={item.id} style={{ background: '#1e293b', padding: '15px', borderRadius: '15px', border: '1px solid #334155', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.name}</div>
                <div style={{ color: '#10b981', fontSize: '18px', margin: '5px 0' }}>Rs. {item.price}</div>
                <div style={{ color: '#94a3b8', fontSize: '12px' }}>Stock: {item.stock}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}