"use client";
import React from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, PlusCircle, Scan, Cloud } from 'lucide-react';

export default function Inventory({ inventory, setInventory }) {
  
  const addProduct = async () => {
    const name = window.prompt("Product Name:");
    const barcode = window.prompt("Scan or Enter Barcode (Optional):") || ""; // NEW FIELD
    const cost = parseFloat(window.prompt("Purchase Price (Cost):")) || 0;
    const price = parseFloat(window.prompt("Sale Price:")) || 0;
    const qty = parseFloat(window.prompt("Initial Stock:")) || 0;
    const unit = window.prompt("Unit (kg/pcs):") || "pcs";

    if (name) {
      const { data, error } = await supabase
        .from('inventory')
        .insert([{ 
          name, 
          barcode, // SAVING BARCODE TO CLOUD
          cost_price: cost, 
          sale_price: price, 
          stock_qty: qty, 
          unit 
        }])
        .select();

      if (error) {
        alert("Cloud Error: " + error.message);
      } else {
        setInventory([...inventory, data[0]]);
        alert("Product with Barcode Synced!");
      }
    }
  };

  return (
    <div style={{ background: '#1e293b', padding: '40px', borderRadius: '30px', border: '1px solid #334155' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{margin:'0', fontSize:'24px', fontWeight:'900'}}>Cloud Inventory</h2>
          <p style={{margin:'5px 0 0', color:'#94a3b8', fontSize:'14px'}}>Hardware & Barcode Ready</p>
        </div>
        <button onClick={addProduct} style={{ background: '#10b981', border: 'none', color: 'white', padding: '12px 25px', borderRadius: '15px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PlusCircle size={20}/> Add New Item
        </button>
      </div>
      
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{color:'#64748b', fontSize: '11px', textTransform:'uppercase', borderBottom:'1px solid #334155'}}>
            <th style={{padding:'15px'}}>Barcode</th>
            <th style={{padding:'15px'}}>Product</th>
            <th style={{padding:'15px'}}>Stock</th>
            <th style={{padding:'15px'}}>Price</th>
            <th style={{padding:'15px'}}>Action</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(i => (
            <tr key={i.id} style={{borderBottom:'1px solid #ffffff05'}}>
              <td style={{padding:'15px', color: '#94a3b8', fontSize: '12px'}}>{i.barcode || '---'}</td>
              <td style={{padding:'20px 15px'}}><b>{i.name}</b></td>
              <td style={{padding:'15px', color:'#60a5fa'}}>{i.stock_qty} {i.unit}</td>
              <td style={{padding:'15px', color:'#10b981'}}>Rs.{i.sale_price}</td>
              <td style={{padding:'15px'}}><Trash2 size={18} color="#ef4444" style={{cursor:'pointer'}} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}