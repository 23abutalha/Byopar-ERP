"use client";
import React from 'react';
import { Printer, X, CheckCircle2 } from 'lucide-react';

export default function Receipt({ order, onClose }) {
  if (!order) return null;

  const printReceipt = () => window.print();

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(8px)' }}>
      <div id="printable-receipt" style={{ width: '380px', background: 'white', color: '#1e293b', padding: '40px', borderRadius: '30px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', fontFamily: 'monospace' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'inline-flex', background: '#10b98122', padding: '12px', borderRadius: '50%', marginBottom: '15px' }}>
            <CheckCircle2 color="#10b981" size={32} />
          </div>
          <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '900', letterSpacing: '-1px' }}>BYOPAR ERP</h2>
          <p style={{ margin: '5px 0', fontSize: '12px', color: '#64748b' }}>Premium Digital Receipt</p>
        </div>

        <div style={{ borderTop: '1px dashed #e2e8f0', borderBottom: '1px dashed #e2e8f0', padding: '20px 0', margin: '20px 0', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>Date:</span> <b>{new Date().toLocaleDateString()}</b></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>Customer:</span> <b>{order.customer}</b></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Payment:</span> <b style={{color: order.payMethod === 'Cash' ? '#10b981' : '#ef4444'}}>{order.payMethod}</b></div>
        </div>

        <table style={{ width: '100%', fontSize: '13px', marginBottom: '20px' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#64748b' }}><th style={{paddingBottom:'10px'}}>Item</th><th>Qty</th><th style={{textAlign:'right'}}>Total</th></tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i}><td style={{padding:'8px 0'}}>{item.name}</td><td>{item.orderQty}</td><td style={{textAlign:'right'}}>Rs.{item.total}</td></tr>
            ))}
          </tbody>
        </table>

        <div style={{ borderTop: '2px solid #1e293b', paddingTop: '15px', textAlign: 'right' }}>
          <p style={{ margin: '0', fontSize: '12px', color: '#64748b' }}>Grand Total</p>
          <p style={{ margin: '0', fontSize: '26px', fontWeight: '900' }}>Rs.{order.total.toLocaleString()}</p>
        </div>

        <div className="no-print" style={{ display: 'flex', gap: '10px', marginTop: '40px' }}>
          <button onClick={printReceipt} style={{ flex: 1, padding: '16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Printer size={18} /> Print Bill
          </button>
          <button onClick={onClose} style={{ flex: 1, padding: '16px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '16px', fontWeight: '800', cursor: 'pointer' }}>Close</button>
        </div>
      </div>
      <style>{`@media print { .no-print { display: none !important; } body * { visibility: hidden; } #printable-receipt, #printable-receipt * { visibility: visible; } #printable-receipt { position: fixed; left: 0; top: 0; width: 100%; } }`}</style>
    </div>
  );
}