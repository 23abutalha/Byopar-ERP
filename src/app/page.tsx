"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Auth from '../components/Auth';

export default function ByoparERP() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Stock');
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Sufi Oil 1L', price: 550, stock: 20 },
    { id: 2, name: 'National Ketchup', price: 230, stock: 50 }
  ]);

  if (!user) return <Auth onLogin={(email) => setUser(email)} />;

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a', 
      color: 'white', 
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden' // FIX: Stops sideways moving
    }}>
      {/* Viewport Fix for Vivo Y100 */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>

      {/* --- TOP MOBILE NAVIGATION --- */}
      <nav style={{ 
        padding: '15px', 
        background: '#1e293b', 
        borderBottom: '1px solid #334155',
        display: 'flex',
        overflowX: 'auto', // Allows swiping tabs on phone
        gap: '10px',
        whiteSpace: 'nowrap'
      }}>
        {['Billing', 'Stock', 'Ledger', 'Analytics'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: activeTab === tab ? '#10b981' : 'transparent',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <main style={{ flex: 1, padding: '15px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>{activeTab} Dashboard</h2>

        {activeTab === 'Stock' && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', // FIX: 2 Columns on Phone
            gap: '12px',
            maxWidth: '1200px'
          }}>
            {inventory.map((item) => (
              <div key={item.id} style={{ 
                background: '#1e293b', 
                padding: '15px', 
                borderRadius: '15px', 
                border: '1px solid #334155',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.name}</div>
                <div style={{ color: '#10b981', fontSize: '18px', margin: '5px 0' }}>Rs. {item.price}</div>
                <div style={{ color: '#94a3b8', fontSize: '12px' }}>Stock: {item.stock}</div>
                
                <button style={{ 
                  marginTop: '10px', 
                  width: '100%', 
                  padding: '8px', 
                  backgroundColor: '#3b82f6', 
                  border: 'none', 
                  borderRadius: '8px', 
                  color: 'white',
                  fontSize: '12px'
                }}>
                  Edit Stock
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Other tabs would go here */}
      </main>

      {/* --- FOOTER INFO --- */}
      <footer style={{ padding: '10px', textAlign: 'center', fontSize: '10px', color: '#475569' }}>
        BARKAT ALI KARYANA STORE - Powered by Vercel Cloud
      </footer>
    </div>
  );
}