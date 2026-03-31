"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState('admin@byopar.com');
  const [password, setPassword] = useState('Byopar786');
  const [loading, setLoading] = useState(false);

  // Auto-Test on Load
  useEffect(() => {
    console.log("Auth Component Loaded");
  }, []);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    
    // IF THIS ALERT DOES NOT SHOW, YOUR PHONE IS BLOCKING JS
    alert("VIVO DEBUG: Step 1 - Click Detected");
    
    setLoading(true);
    
    try {
      alert("VIVO DEBUG: Step 2 - Connecting to Supabase...");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert("LOGIN ERROR: " + error.message);
        setLoading(false);
      } else if (data?.user) {
        alert("SUCCESS: Welcome to Byopar ERP");
        onLogin(email, "Byopar Master Store");
      }
    } catch (err) {
      alert("SYSTEM CRASH: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      
      {/* --- EMERGENCY TEST BUTTON --- */}
      <button 
        onClick={() => alert("BROWSER TEST: JavaScript is ALIVE on this Phone!")}
        style={{ width: '100%', padding: '15px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', marginBottom: '20px', fontWeight: 'bold' }}
      >
        1. CLICK THIS RED BUTTON FIRST
      </button>

      <div style={{ maxWidth: '400px', margin: '0 auto', background: '#1e293b', padding: '30px', borderRadius: '20px', border: '1px solid #334155' }}>
        <h1 style={{ color: '#10b981', marginBottom: '10px' }}>Byopar ERP</h1>
        <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '30px' }}>Login Terminal (Mobile Optimized)</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
            placeholder="Email"
          />
          
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
            placeholder="Password"
          />

          <button 
            onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%', padding: '18px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
          >
            {loading ? "Syncing..." : "2. LOGIN TO CLOUD"}
          </button>
        </div>

        <p style={{ marginTop: '20px', fontSize: '11px', color: '#475569' }}>
          BARKAT ALI KARYANA STORE System
        </p>
      </div>
    </div>
  );
}