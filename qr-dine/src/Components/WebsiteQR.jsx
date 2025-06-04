import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function WebsiteQR({ url }) {
  const [qrUrl, setQrUrl] = useState(url || window.location.origin);

  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center gap-5'>
      <h2>Scan to visit Menu</h2>
      <QRCodeSVG value={qrUrl} size={220} fgColor="black" or="#fff" />
    </div>
  );
}
