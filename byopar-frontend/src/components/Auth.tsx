"use client";
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState('admin@byopar.com');
  const [password, setPassword] = useState('Byopar786');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(''); // New: Shows progress on screen

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setStatus("Connecting to Cloud...");
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setStatus("Error: " + error.message);
        setLoading(false);
      } else if (data?.user) {
        setStatus("Success! Entering Dashboard...");
        onLogin(email, "Byopar Master Store");
      }
    } catch (err) {
      setStatus("System Error. Check connection.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', padding: '20px', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '400px', width: '100%', background: '#1e293b', padding: '30px', borderRadius: '20px', border: '1px solid #334155', textAlign: 'center' }}>
        <h1 style={{ color: '#10b981', marginBottom: '10px' }}>Byopar ERP</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '25px' }}>Barkat Ali Karyana Store</p>

        {/* Status Display */}
        {status && (
          <div style={{ padding: '10px', backgroundColor: status.includes('Error') ? '#ef444433' : '#10b98133', color: status.includes('Error') ? '#f87171' : '#34d399', borderRadius: '8px', marginBottom: '15px', fontSize: '13px' }}>
            {status}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #334155', background: '#0f172a', color: 'white', boxSizing: 'border-box' }}
            placeholder="Email"
          />
          
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #334155', background: '#0f172a', color: 'white', boxSizing: 'border-box' }}
            placeholder="Password"
          />

          <button 
            onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%', padding: '18px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Syncing..." : "LOGIN TO CLOUD"}
          </button>
        </div>
      </div>
    </div>
  );
}