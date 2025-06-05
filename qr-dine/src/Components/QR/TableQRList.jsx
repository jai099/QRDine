import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function TableQRList({ baseUrl }) {
  const tables = Array.from({ length: 12 }, (_, i) => i + 1);
  return (
    <div style={{ textAlign: 'center', margin: '2rem 0' }}>
      <h2>Scan QR for Each Table</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
        {tables.map(table => (
          <div key={table} className='m-[1rem] p-[1rem] rounded-[12px] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] flex flex-col items-center gap-4'>
            <div className='bold flex flex-none items-center justify-center'>Table {table}</div>
            <QRCodeSVG value={`${baseUrl}/?table=${table}`} size={160}/>
            <div style={{ marginTop: 8, fontSize: 12, wordBreak: 'break-all' }}>{`${baseUrl}/?table=${table}`}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
