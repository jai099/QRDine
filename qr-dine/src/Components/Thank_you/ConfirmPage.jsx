import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const getCart = () => {
  try {
    const cart = JSON.parse(localStorage.getItem("cartItems"));
    if (Array.isArray(cart)) {
      return cart.map(item => ({
        ...item,
        price: Number(item.price),
        quantity: item.qty || item.quantity || 1
      }));
    }
  } catch {}
  return [];
};

export default function ConfirmPage() {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [tip, setTip] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const tableNumber = 12;
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cgst = subtotal * 0.025;
  const sgst = subtotal * 0.025;
  const serviceCharge = subtotal * 0.05;
  const total = subtotal + cgst + sgst + serviceCharge;

  function handleConfirm() {
    const chefOrders = JSON.parse(localStorage.getItem('chefOrders') || '[]');
    chefOrders.push({
      id: Date.now(),
      table: tableNumber,
      items: cart,
      notes: orderNotes,
      total: total,
    });
    localStorage.setItem('chefOrders', JSON.stringify(chefOrders));
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate("/thank-you", { state: { table: tableNumber } });
    }, 1200);
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("QRDine Bill Receipt", 14, 16);
    doc.setFontSize(12);
    let y = 28;
    doc.text(`Table: #${tableNumber}`, 14, y);
    y += 8;
    doc.text("Items:", 14, y);
    y += 8;
    cart.forEach((item) => {
      doc.text(
        `${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`,
        16,
        y
      );
      y += 7;
    });
    y += 4;
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 14, y);
    y += 7;
    doc.text(`CGST (2.5%): ₹${cgst.toFixed(2)}`, 14, y);
    y += 7;
    doc.text(`SGST (2.5%): ₹${sgst.toFixed(2)}`, 14, y);
    y += 7;
    doc.text(`Service Charge (5%): ₹${serviceCharge.toFixed(2)}`, 14, y);
    y += 7;
    doc.text(`Total: ₹${total.toFixed(2)}`, 14, y);
    y += 10;
    doc.text("Thank you for dining with us!", 14, y);
    doc.save("QRDine_Bill.pdf");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-warm-300 to-warm-200 font-sans md:flex-col">
      {/* Left: Order Summary */}
      <div className="flex-1 p-12 flex flex-col bg-warm-300/95 border-r-2 border-amber-300 shadow-[8px_0_32px_rgba(255,152,0,0.07)] min-w-0 md:p-7 md:pb-4.5 md:border-r-0 md:border-b-2 md:shadow-none">
        <div className="text-4xl font-extrabold text-orange-500 mb-6 tracking-widest drop-shadow-[0_2px_8px_#ffe0b2]">
          📋 Order Summary
        </div>
        <div className="flex items-center text-xl font-bold text-orange-600 mb-4.5">
          <span className="mr-2.5">Table</span>
          <span>#{tableNumber}</span>
        </div>
        <div className="mb-4.5">
          {cart.map(item => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-4 bg-warm-300 rounded-lg p-3 mb-3 shadow-[0_2px_10px_rgba(255,152,0,0.07)] transition-shadow duration-200 hover:shadow-[0_4px_18px_rgba(255,152,0,0.13)]"
            >
              <span className="font-bold text-lg text-orange-600 tracking-tight truncate">
                {item.name}
              </span>
              <span className="font-bold text-base text-orange-500">x{item.quantity}</span>
              <span className="bg-warm-300 rounded-lg px-2.5 py-0.5 font-semibold text-base text-orange-500">
                ₹{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4.5 bg-warm-100 rounded-xl shadow-[0_2px_12px_#ffe0b2] p-4.5 pb-2.5 max-w-[340px] mx-auto">
          <div className="flex justify-between text-base text-orange-600 mb-1.5">
            <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base text-orange-600 mb-1.5">
            <span>CGST (2.5%)</span><span>₹{cgst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base text-orange-600 mb-1.5">
            <span>SGST (2.5%)</span><span>₹{sgst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base text-orange-600 mb-1.5">
            <span>Service Charge (5%)</span><span>₹{serviceCharge.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-green-600 border-t-2 border-amber-300 mt-2.5 pt-1.5">
            <span>Total</span><span>₹{total.toFixed(2)}</span>
          </div>
        </div>
        <button
          className="mt-4 bg-gradient-to-r from-orange-500 to-amber-300 text-white border-none rounded-lg py-2.5 text-base font-bold shadow-[0_2px_8px_#ffe0b2] transition-all duration-200 hover:bg-[#c95d0c] hover:scale-103 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed w-full"
          onClick={handleDownloadPDF}
          disabled={cart.length === 0}
        >
          Download Bill as PDF
        </button>
        <button
          className="mt-7 bg-gradient-to-r from-warm-200 to-orange-500 text-orange-600 border-none rounded-[10px] py-2.5 text-lg font-bold shadow-[0_2px_8px_rgba(255,152,0,0.10)] transition-all duration-200 hover:bg-gradient-to-r hover:from-amber-300 hover:to-orange-500 w-full"
          onClick={() => navigate("/")}
        >
          ← Edit Order
        </button>
      </div>
      {/* Right: Confirm & Submit */}
      <div className="flex-1 p-12 flex flex-col bg-white/98 shadow-[-8px_0_32px_rgba(255,152,0,0.07)] min-w-0 md:p-7 md:pb-4.5 md:shadow-none">
        <div className="text-4xl font-extrabold text-orange-500 mb-6 tracking-widest drop-shadow-[0_2px_8px_#ffe0b2]">
          ✍️ Confirm & Submit
        </div>
        <div className="mb-5.5 flex flex-col gap-1.5">
          <label className="text-base font-semibold text-orange-600">Customer Name (optional)</label>
          <input
            className="p-2.5 rounded-lg border-[1.5px] border-amber-300 text-orange-600 bg-warm-50 text-lg font-semibold outline-none transition-border duration-200 focus:border-2 focus:border-orange-500"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            placeholder="e.g. John Doe"
          />
        </div>
        <div className="mb-5.5 flex flex-col gap-1.5">
          <label className="text-base font-semibold text-orange-600">Order Notes (optional)</label>
          <textarea
            className="p-2.5 rounded-lg border-[1.5px] border-amber-300 text-orange-600 bg-warm-50 text-lg font-semibold outline-none transition-border duration-200 focus:border-2 focus:border-orange-500"
            value={orderNotes}
            onChange={e => setOrderNotes(e.target.value)}
            placeholder="e.g. No onions please"
            rows={2}
          />
        </div>
        <div className="mb-5.5 flex flex-col gap-1.5">
          <label className="text-base font-semibold text-orange-600">Tip</label>
          <div className="flex gap-3">
            {[0, 5, 10, 15].map(val => (
              <button
                key={val}
                className={`bg-warm-200 text-orange-600 border-none rounded-lg px-4.5 py-2 font-bold text-base shadow-[0_2px_8px_rgba(255,152,0,0.10)] transition-all duration-200 hover:bg-orange-500 hover:text-white ${tip === val ? 'bg-orange-500 text-white' : ''}`}
                onClick={() => setTip(val)}
                type="button"
              >
                {val}%
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-between text-2xl font-extrabold text-green-700 border-t-[2.5px] border-green-300 mt-8 pt-4.5 mb-9">
          <span>Grand Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <button
          className="w-full py-4.5 bg-gradient-to-r from-green-500 to-green-300 text-white border-none rounded-xl text-xl font-extrabold shadow-[0_4px_24px_rgba(67,234,94,0.18),0_2px_8px_rgba(60,60,120,0.10)] transition-all duration-200 animate-confirmGlow active:brightness-95 md:sticky md:bottom-0 md:z-10"
          onClick={handleConfirm}
        >
          🟢 Place Order
        </button>
        {showToast && (
          <div className="fixed top-8 right-8 bg-orange-500 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-[0_2px_16px_#ff9800cc] z-[2000] animate-toastPop">
            Order Confirmed! 👨‍🍳
          </div>
        )}
      </div>
    </div>
  );
}