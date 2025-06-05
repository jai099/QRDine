import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function TableQRList({ baseUrl }) {
  const tables = Array.from({ length: 12 }, (_, i) => i + 1);
  return (
    <div style={{ textAlign: 'center', margin: '2rem 0' }}>
      <h2>Scan QR for Each Table</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
        {tables.map(table => (
          <div key={table} style={{ margin: '1rem', padding: '1rem', border: '1px solid #eee', borderRadius: 12, background: '#fff' }}>
            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Table {table}</div>
            <QRCodeSVG value={`${baseUrl}/?table=${table}`} size={160}/>
            <div style={{ marginTop: 8, fontSize: 12, wordBreak: 'break-all' }}>{`${baseUrl}/?table=${table}`}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
