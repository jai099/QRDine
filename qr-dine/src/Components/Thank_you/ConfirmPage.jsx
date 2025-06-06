import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import jsPDF from "jspdf";

// Helper to get cart items
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
  const location = useLocation();
  const [customerName, setCustomerName] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [tip, setTip] = useState(0);
  const [customTip, setCustomTip] = useState("");
  const [showToast, setShowToast] = useState(false);

  const cart = getCart();
  // Get table number from cart, navigation state, or fallback
  let tableNumber = null;
  if (cart.length > 0 && cart[0].tableNumber) tableNumber = cart[0].tableNumber;
  else if (location.state && location.state.table) tableNumber = location.state.table;
  else tableNumber = null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cgst = subtotal * 0.025;
  const sgst = subtotal * 0.025;
  const serviceCharge = subtotal * 0.05;

  const effectiveTip = customTip !== "" ? parseFloat(customTip) : tip;
const tipAmount = isNaN(effectiveTip) ? 0 : effectiveTip;
const total = subtotal + cgst + sgst + serviceCharge + tipAmount;

  function handleConfirm() {
    const chefOrders = JSON.parse(localStorage.getItem("chefOrders") || "[]");
    chefOrders.push({
      id: Date.now(),
      table: tableNumber,
      items: cart,
      notes: orderNotes,
      total: total,
    });
    localStorage.setItem("chefOrders", JSON.stringify(chefOrders));
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate("/thank-you", { state: { table: tableNumber } });
    }, 1200);
  }

  function handleDownloadPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("QRDine Bill Receipt", 14, 16);
    doc.setFontSize(12);
    let y = 28;
    doc.text(`Table: #${tableNumber}`, 14, y);
    y += 8;
    doc.text("Items:", 14, y);
    y += 8;
    cart.forEach(item => {
      doc.text(`${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`, 16, y);
      y += 7;
    });
    y += 4;
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 14, y); y += 7;
    doc.text(`CGST (2.5%): ₹${cgst.toFixed(2)}`, 14, y); y += 7;
    doc.text(`SGST (2.5%): ₹${sgst.toFixed(2)}`, 14, y); y += 7;
    doc.text(`Service Charge (5%): ₹${serviceCharge.toFixed(2)}`, 14, y); y += 7;
   doc.text(`Tip: ₹${tipAmount.toFixed(2)}`, 14, y);
    doc.text(`Total: ₹${total.toFixed(2)}`, 14, y); y += 10;
    doc.text("Thank you for dining with us!", 14, y);
    doc.save("QRDine_Bill.pdf");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 font-sans">
      
      {/* Left Side: Order Summary */}
      <div className="w-full md:w-1/2 p-6 md:p-10 bg-orange-100 border-b-2 md:border-b-0 md:border-r-2 border-orange-300 shadow-md">
        <h2 className="text-3xl font-extrabold text-orange-600 mb-5">📋 Order Summary</h2>
        <p className="text-lg font-bold text-orange-700 mb-4">Table #{tableNumber}</p>

        <div className="space-y-3 mb-6">
          {cart.map(item => (
            <div key={item.name} className="flex justify-between items-center bg-orange-50 px-4 py-2 rounded shadow-sm border border-orange-200">
              <span className="text-orange-800 font-medium">{item.name}</span>
              <span className="text-orange-600 font-bold">x{item.quantity}</span>
              <span className="text-orange-600 font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 rounded-xl shadow-inner space-y-2 text-sm md:text-base">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>CGST (2.5%)</span><span>₹{cgst.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>SGST (2.5%)</span><span>₹{sgst.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Service Charge (5%)</span><span>₹{serviceCharge.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Tip ({effectiveTip}%)</span><span>₹{tipAmount.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-green-700 border-t pt-2 mt-2"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={cart.length === 0}
          className="mt-5 w-full bg-orange-500 text-white font-bold py-2 rounded-lg hover:bg-orange-600 transition disabled:bg-gray-300"
        >
          Download Bill as PDF
        </button>

        <button
          onClick={() => navigate("/")}
          className="mt-4 w-full bg-orange-200 text-orange-700 font-bold py-2 rounded-lg hover:bg-orange-300 transition"
        >
          ← Edit Order
        </button>
      </div>

      {/* Right Side: Confirmation */}
      <div className="w-full md:w-1/2 p-6 md:p-10 bg-white shadow-md">
        <h2 className="text-3xl font-extrabold text-orange-600 mb-5">✍️ Confirm & Submit</h2>

        <label className="block mb-2 font-semibold text-orange-700">Customer Name (optional)</label>
        <input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="e.g. John Doe"
          className="w-full mb-4 px-4 py-2 border border-orange-200 rounded focus:outline-orange-500"
        />

        <label className="block mb-2 font-semibold text-orange-700">Order Notes (optional)</label>
        <textarea
          value={orderNotes}
          onChange={(e) => setOrderNotes(e.target.value)}
          placeholder="e.g. No onions please"
          rows="3"
          className="w-full mb-4 px-4 py-2 border border-orange-200 rounded focus:outline-orange-500"
        />

        <label className="block mb-2 font-semibold text-orange-700">Tip</label>
<div className="flex flex-wrap gap-3 mb-4">
  {[0, 50, 100, 200, 300].map(val => (
    <button
      key={val}
      onClick={() => {
        setTip(val);
        setCustomTip("");
      }}
      type="button"
      className={`px-4 py-2 rounded border font-semibold ${
        tip === val && customTip === ""
          ? "bg-orange-500 text-white"
          : "bg-orange-100 text-orange-700 hover:bg-orange-200"
      }`}
    >
      ₹{val}
    </button>
  ))}
  <input
    type="number"
    placeholder="Custom ₹"
    min="0"
    value={customTip}
    onChange={e => {
      setCustomTip(e.target.value);
      setTip(0);
    }}
    className="w-28 px-3 py-2 border border-orange-200 rounded text-orange-700 focus:outline-orange-500"
  />
</div>

        <div className="flex justify-between text-xl font-bold text-green-700 border-t pt-4 mb-6">
          <span>Grand Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition"
        >
          🟢 Place Order
        </button>

        {showToast && (
          <div className="fixed top-5 right-5 bg-green-600 text-white font-semibold px-6 py-3 rounded shadow-lg z-50">
            ✅ Order Confirmed!
          </div>
        )}

        {/* Warning for missing table number */}
        {!tableNumber && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded font-bold text-center">
            Warning: Table number not found. Please scan the QR code again.
          </div>
        )}
      </div>
    </div>
  );
}
