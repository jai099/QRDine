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

  // Get table number
  let tableNumber = null;
  // Always get from URL if present
  {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("table");
    if (t) tableNumber = parseInt(t, 10);
    else if (cart.length > 0 && cart[0].tableNumber) tableNumber = cart[0].tableNumber;
    else if (location.state && location.state.table) tableNumber = location.state.table;
  }

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
      items: cart.map(item => ({ ...item, tableNumber })),
      notes: orderNotes,
      total: total,
    });
    localStorage.setItem("chefOrders", JSON.stringify(chefOrders));
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      if (tableNumber) {
        navigate(`/thank-you?table=${tableNumber}`, { state: { table: tableNumber } });
      } else {
        navigate("/thank-you");
      }
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
    doc.text(`Tip: ₹${tipAmount.toFixed(2)}`, 14, y); y += 7;
    doc.text(`Total: ₹${total.toFixed(2)}`, 14, y); y += 10;
    doc.text("Thank you for dining with us!", 14, y);
    doc.save("QRDine_Bill.pdf");
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col md:flex-row">
      {/* Left Side: Order Summary */}
      <div className="w-full md:w-1/2 p-6 md:p-10 bg-[#fff8ee] border-b-2 md:border-b-0 md:border-r-2 border-orange-200 shadow-md rounded-xl m-2 flex flex-col">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-orange-700 mb-4">📋 Order Summary</h2>
        <p className="text-lg font-bold text-orange-600 mb-4">Table {tableNumber}</p>
        <div className="space-y-3 mb-6">
          {cart.map(item => (
            <div key={item.name} className="flex justify-between items-center bg-orange-50 px-4 py-2 rounded-lg shadow-sm border border-orange-100">
              <span className="text-orange-800 font-medium">{item.name}</span>
              <span className="text-orange-800 font-semibold">x{item.quantity}</span>
              <span className="text-orange-800 font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="space-y-1 text-orange-800 font-medium">
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>CGST (2.5%): ₹{cgst.toFixed(2)}</p>
          <p>SGST (2.5%): ₹{sgst.toFixed(2)}</p>
          <p>Service Charge (5%): ₹{serviceCharge.toFixed(2)}</p>
          <p>Tip: ₹{tipAmount.toFixed(2)}</p>
          <p className="text-lg font-bold">Total: ₹{total.toFixed(2)}</p>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="mt-6 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md shadow-lg transition"
        >
          📄 Download PDF
        </button>
      </div>

      {/* Right Side: Inputs */}
      <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-orange-700 mb-4">Customer Details</h2>
          <input
            type="text"
            placeholder="Enter your name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-3 mb-4 border border-orange-300 rounded-md"
          />
          <textarea
            placeholder="Order Notes (optional)"
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            className="w-full p-3 mb-4 border border-orange-300 rounded-md"
          />
          <div className="mb-4">
            <label className="block mb-1 text-orange-700 font-medium">Add Tip (optional)</label>
            <div className="flex gap-2 mb-2">
              {[0, 10, 20, 50].map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setTip(amt);
                    setCustomTip("");
                  }}
                  className={`px-4 py-2 border rounded ${
                    tip === amt && customTip === "" ? "bg-orange-500 text-white" : "bg-white text-orange-700"
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
            <input
              type="number"
              placeholder="Custom Tip"
              value={customTip}
              onChange={(e) => {
                setCustomTip(e.target.value);
                setTip(0);
              }}
              className="w-full p-2 border border-orange-300 rounded-md"
            />
          </div>
        </div>
        <button
          onClick={handleConfirm}
          className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-md shadow-lg mt-4"
        >
          ✅ Confirm Order
        </button>
        {showToast && (
          <div className="mt-4 text-green-700 font-semibold">Order placed successfully!</div>
        )}
      </div>
    </div>
  );
}
