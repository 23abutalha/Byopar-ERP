"use client";
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Phone, Wallet, CheckCircle, Search, AlertCircle } from 'lucide-react';

export function DebtLedger({ sales, onUpdate }) {
  const [search, setSearch] = useState("");

  // --- AI LOGIC: GROUP DEBTS BY CUSTOMER ---
  const customerDebts = sales.reduce((acc, sale) => {
    if (sale.payment_method === 'Debt' && sale.status !== 'paid') {
      const key = sale.customer_phone || 'Unknown';
      if (!acc[key]) {
        acc[key] = { name: sale.customer_name, phone: key, total: 0, records: [] };
      }
      acc[key].total += Number(sale.total_amount);
      acc[key].records.push(sale);
    }
    return acc;
  }, {});

  const debtList = Object.values(customerDebts).filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  const settleDebt = async (phone) => {
    if (window.confirm(`Mark all debts for ${phone} as PAID?`)) {
      const { error } = await supabase
        .from('sales_history')
        .update({ status: 'paid' })
        .eq('customer_phone', phone)
        .eq('payment_method', 'Debt');

      if (!error) {
        alert("Account Cleared in Cloud!");
        onUpdate(); // Refresh the data
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '900', margin: '0' }}>Recovery <span style={{color:'#ef4444'}}>Ledger</span></h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '5px 0 0' }}>Manage outstanding market credit</p>
        </div>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search style={{ position: 'absolute', left: '15px', top: '12px', color: '#64748b' }} size={18} />
          <input 
            placeholder="Search Name or Phone..." 
            style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', padding: '12px 12px 12px 45px', borderRadius: '12px', color: 'white', outline: 'none' }}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {debtList.length === 0 && <p style={{color:'#64748b'}}>No outstanding Udhaar found.</p>}
        {debtList.map((customer, idx) => (
          <div key={idx} style={{ background: '#1e293b', borderRadius: '24px', border: '1px solid #334155', padding: '25px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ background: '#ef444422', padding: '12px', borderRadius: '15px' }}><User color="#ef4444"/></div>
              <div>
                <b style={{ fontSize: '18px', display: 'block' }}>{customer.name}</b>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Phone size={12}/> {customer.phone}
                </span>
              </div>
            </div>

            <div style={{ background: '#0f172a', padding: '20px', borderRadius: '18px', marginBottom: '20px' }}>
              <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '800', margin: '0 0 5px', textTransform: 'uppercase' }}>Total Outstanding</p>
              <b style={{ fontSize: '24px', color: '#ef4444' }}>Rs.{customer.total.toLocaleString()}</b>
            </div>

            <button 
              onClick={() => settleDebt(customer.phone)}
              style={{ width: '100%', padding: '15px', borderRadius: '15px', border: 'none', background: '#10b981', color: 'white', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              <CheckCircle size={18}/> Settle Full Balance
            </button>
            
            {/* AI Risk Tag */}
            {customer.total > 5000 && (
              <div style={{ position: 'absolute', top: '15px', right: '15px', background: '#ef444422', color: '#ef4444', padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: '900', border: '1px solid #ef444444' }}>
                HIGH RISK
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}