"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TrendingUp, Zap, Wallet, BarChart3, ArrowUpRight, PieChart } from 'lucide-react';

export default function Analytics({ sales, inventory }) {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExp = async () => {
      const { data } = await supabase.from('expenses').select('*');
      if (data) setExpenses(data);
    };
    fetchExp();
  }, []);

  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total_amount), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const netProfit = (totalRevenue * 0.20) - totalExpenses; // Assuming 20% margin before expenses

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'fadeIn 0.5s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '900', margin: '0' }}>Byopar <span style={{color:'#10b981'}}>Intelligence</span></h2>
        <div style={{ background: '#10b98122', padding: '10px 20px', borderRadius: '12px', border: '1px solid #10b98144' }}>
          <span style={{ color: '#10b981', fontWeight: '800', fontSize: '12px' }}>PWA ENABLED</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ background: '#1e293b', padding: '25px', borderRadius: '24px', flex: 1, border: '1px solid #334155' }}>
          <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '800', marginBottom: '10px' }}>TOTAL SALES</p>
          <b style={{ fontSize: '28px', color: '#10b981' }}>Rs.{totalRevenue.toLocaleString()}</b>
        </div>
        <div style={{ background: '#1e293b', padding: '25px', borderRadius: '24px', flex: 1, border: '1px solid #334155' }}>
          <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '800', marginBottom: '10px' }}>TOTAL KHARCHA</p>
          <b style={{ fontSize: '28px', color: '#ef4444' }}>Rs.{totalExpenses.toLocaleString()}</b>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', padding: '25px', borderRadius: '24px', flex: 1 }}>
          <p style={{ color: '#ffffffcc', fontSize: '11px', fontWeight: '800', marginBottom: '10px' }}>NET PROFIT</p>
          <b style={{ fontSize: '28px', color: 'white' }}>Rs.{netProfit.toLocaleString()}</b>
        </div>
      </div>

      <div style={{ background: '#1e293b', padding: '30px', borderRadius: '24px', border: '1px solid #334155' }}>
        <h3 style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Zap size={20} color="#3b82f6" fill="#3b82f6" /> AI Business Summary
        </h3>
        <p style={{ color: '#94a3b8', lineHeight: '1.6', margin: '0' }}>
          Byopar AI has analyzed <b>{sales.length} transactions</b>. 
          Your profit-to-expense ratio is <b>{((netProfit/totalRevenue)*100).toFixed(1)}%</b>. 
          The system is ready for mobile installation on your Vivo Y100.
        </p>
      </div>
    </div>
  );
}