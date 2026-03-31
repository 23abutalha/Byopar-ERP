"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MinusCircle, PlusCircle, Receipt, Trash2, Wallet } from 'lucide-react';

export default function Expenses() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", category: "General" });

  const fetchExpenses = async () => {
    const { data } = await supabase.from('expenses').select('*').order('created_at', { ascending: false });
    if (data) setList(data);
  };

  useEffect(() => { fetchExpenses(); }, []);

  const addExpense = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;
    
    const { error } = await supabase.from('expenses').insert([
      { title: form.title, amount: Number(form.amount), category: form.category }
    ]);
    
    if (!error) {
      setForm({ title: "", amount: "", category: "General" });
      fetchExpenses();
    }
  };

  const deleteExpense = async (id) => {
    await supabase.from('expenses').delete().eq('id', id);
    fetchExpenses();
  };

  const totalExp = list.reduce((s, i) => s + Number(i.amount), 0);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '40px' }}>
      {/* ADD EXPENSE FORM */}
      <div style={{ background: '#1e293b', padding: '35px', borderRadius: '30px', border: '1px solid #334155', height: 'fit-content' }}>
        <h3 style={{ margin: '0 0 25px', fontSize: '22px', fontWeight: '900' }}>Add <span style={{color:'#ef4444'}}>Expense</span></h3>
        <form onSubmit={addExpense} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            placeholder="Expense Title (e.g. Electricity Bill)" 
            value={form.title}
            style={{ padding: '15px', borderRadius: '12px', background: '#0f172a', border: '1px solid #334155', color: 'white' }}
            onChange={e => setForm({...form, title: e.target.value})}
          />
          <input 
            type="number" placeholder="Amount (Rs.)" 
            value={form.amount}
            style={{ padding: '15px', borderRadius: '12px', background: '#0f172a', border: '1px solid #334155', color: 'white' }}
            onChange={e => setForm({...form, amount: e.target.value})}
          />
          <select 
            style={{ padding: '15px', borderRadius: '12px', background: '#0f172a', border: '1px solid #334155', color: 'white' }}
            onChange={e => setForm({...form, category: e.target.value})}
          >
            <option value="General">General</option>
            <option value="Rent">Shop Rent</option>
            <option value="Bills">Utilities/Bills</option>
            <option value="Salary">Staff Salary</option>
          </select>
          <button type="submit" style={{ padding: '18px', borderRadius: '15px', background: '#ef4444', color: 'white', border: 'none', fontWeight: '900', cursor: 'pointer', marginTop: '10px' }}>
            Save Expense
          </button>
        </form>
      </div>

      {/* EXPENSE LIST */}
      <div style={{ background: '#1e293b', padding: '35px', borderRadius: '30px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h3 style={{ margin: '0', fontSize: '20px' }}>Monthly Outflow</h3>
          <b style={{ color: '#ef4444', fontSize: '24px' }}>Total: Rs.{totalExp.toLocaleString()}</b>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {list.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', background: '#0f172a', borderRadius: '15px', border: '1px solid #334155' }}>
              <div>
                <b style={{ display: 'block', fontSize: '16px' }}>{item.title}</b>
                <small style={{ color: '#64748b' }}>{item.category} • {new Date(item.created_at).toLocaleDateString()}</small>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <b style={{ color: '#ef4444', fontSize: '18px' }}>Rs.{Number(item.amount).toLocaleString()}</b>
                <Trash2 size={18} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => deleteExpense(item.id)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}