"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Tag, Search, CreditCard, Wallet, Scan } from 'lucide-react';

export default function Billing({ inventory, cart, setCart, customer, setCustomer, onFinalize }) {
  const [searchTerm, setSearchTerm] = useState("");

  // --- AUTO-ADD ON SCAN LOGIC ---
  useEffect(() => {
    if (searchTerm.length >= 3) {
      const foundItem = inventory.find(i => i.barcode === searchTerm);
      if (foundItem) {
        addToCart(foundItem);
        setSearchTerm(""); // Clear search automatically after adding
      }
    }
  }, [searchTerm]);

  const addToCart = (p) => {
    const ex = cart.find(i => i.id === p.id);
    if (p.stock_qty <= 0) return alert("Out of Stock!");

    if (ex) {
      setCart(cart.map(i => i.id === p.id ? { ...i, orderQty: i.orderQty + 1, total: (i.orderQty + 1) * p.sale_price } : i));
    } else {
      setCart([...cart, { ...p, price: p.sale_price, orderQty: 1, total: p.sale_price }]);
    }
  };

  const total = cart.reduce((s, i) => s + (i.total || 0), 0);
  const inputStyle = { width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', padding: '15px', borderRadius: '12px', color: 'white', marginBottom: '15px', outline: 'none' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '30px', height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        <div style={{ position: 'relative' }}>
          <Scan style={{ position: 'absolute', left: '15px', top: '15px', color: '#10b981' }} size={20} />
          <input 
            value={searchTerm}
            placeholder="Scan Barcode or Search..." 
            style={{ ...inputStyle, paddingLeft: '50px', border: searchTerm.length > 5 ? '1px solid #10b981' : '1px solid #334155' }} 
            onChange={e => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' }}>
          {inventory.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
            <div key={p.id} onClick={() => addToCart(p)} style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '20px', border: '1px solid #334155', cursor: 'pointer' }}>
              <p style={{ fontWeight: '800', margin: '0 0 5px' }}>{p.name}</p>
              <p style={{ color: '#10b981', fontWeight: '900', fontSize: '18px', margin: '0' }}>Rs.{p.sale_price}</p>
              <small style={{ color: '#94a3b8', fontSize: '11px' }}>Stock: {p.stock_qty}</small>
            </div>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: '#1e293b', borderRadius: '35px', border: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '30px', borderBottom: '1px solid #334155', fontWeight: '900', fontSize: '20px' }}>Terminal</div>
        <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
          <input placeholder="Customer Name" style={inputStyle} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
          {customer.payMethod === 'Debt' && <input placeholder="Phone Number" style={{...inputStyle, borderColor:'#ef4444'}} onChange={e => setCustomer({ ...customer, phone: e.target.value })} />}
          
          {cart.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', background: '#0f172a', padding: '15px', borderRadius: '15px', marginBottom: '10px' }}>
              <div><b>{item.name}</b><br/><small>Rs.{item.price} x {item.orderQty}</small></div>
              <X size={16} color="#ef4444" onClick={() => setCart(cart.filter((_, i) => i !== idx))} />
            </div>
          ))}
        </div>

        <div style={{ padding: '30px', backgroundColor: '#0f172a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
             <span style={{color:'#94a3b8'}}>Grand Total</span><b style={{fontSize:'28px', color:'#10b981'}}>Rs.{total.toLocaleString()}</b>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button onClick={() => setCustomer({...customer, payMethod: 'Cash'})} style={{flex:1, padding:'15px', borderRadius:'15px', border:'none', background: customer.payMethod === 'Cash' ? '#10b981' : '#1e293b', color:'white', fontWeight:'800'}}><Wallet size={16}/> Cash</button>
            <button onClick={() => setCustomer({...customer, payMethod: 'Debt'})} style={{flex:1, padding:'15px', borderRadius:'15px', border:'none', background: customer.payMethod === 'Debt' ? '#ef4444' : '#1e293b', color:'white', fontWeight:'800'}}><CreditCard size={16}/> Udhaar</button>
          </div>
          <button onClick={onFinalize} style={{ width: '100%', padding: '22px', borderRadius: '18px', backgroundColor: '#3b82f6', color: 'white', border: 'none', fontWeight: '900', fontSize: '18px' }}>FINALIZE SALE</button>
        </div>
      </div>
    </div>
  );
}