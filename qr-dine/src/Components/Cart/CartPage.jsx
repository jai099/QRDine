import React from "react";
import CartItem from "./CartItem.jsx";
import jsPDF from "jspdf";

export default function CartPage({ cart, setCart, onProceedToCheckout, tableNumber }) {
  // Only show cart items for this table
  const filteredCart = tableNumber ? cart.filter(item => item.tableNumber === tableNumber) : cart;

  const handleQuantityChange = (id, delta) => {
    setCart((items) =>
      items
        .map((item) =>
          item.id === id
            ? { ...item, qty: Math.max(1, item.qty + delta) }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const handleDelete = (id) => {
    setCart((items) => items.filter((item) => item.id !== id));
  };

  // GST and taxes (Indian):
  // CGST: 2.5%, SGST: 2.5%, Service Charge: 5%
  const subtotal = filteredCart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cgst = subtotal * 0.025;
  const sgst = subtotal * 0.025;
  const serviceCharge = subtotal * 0.05;
  const total = subtotal + cgst + sgst + serviceCharge;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("QRDine Bill Receipt", 14, 16);
    doc.setFontSize(12);
    let y = 28;
    doc.text("Items:", 14, y);
    y += 8;
    filteredCart.forEach((item) => {
      doc.text(
        `${item.name} x${item.qty} - ₹${(item.price * item.qty).toFixed(2)}`,
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
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col">
      {/* Table number visual confirmation */}
      {tableNumber && (
        <div className="w-full bg-orange-100 text-orange-700 text-center py-2 font-bold text-lg shadow-sm">
          You are ordering for <span className="text-orange-600">Table #{tableNumber}</span>
        </div>
      )}
      {!tableNumber && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded font-bold text-center">
          Warning: Table number not found. Please scan the QR code again.
        </div>
      )}
      <div className="flex-1 overflow-y-auto px-2 sm:px-8 pt-8 pb-8">
        <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-orange-500 tracking-wider mb-7 drop-shadow-[0_2px_8px_#ffe0b2] animate-popInCart">
          Your Cart
        </h2>
        <div className="space-y-4">
          {filteredCart.length === 0 ? (
            <div className="text-center text-orange-500 font-bold text-xl mt-10 tracking-wide">
              Your cart is empty!
            </div>
          ) : (
            filteredCart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
      <div className="sticky bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg shadow-[0_-2px_16px_rgba(255,152,0,0.08)] px-2 sm:px-8 pb-6 z-10 rounded-b-3xl border-t border-orange-100">
        <div className="flex flex-col gap-2 pt-4">
          <div className="flex justify-between items-center text-orange-600 text-lg sm:text-xl font-extrabold bg-[#fffde7] rounded-xl shadow-[0_2px_8px_#ffe0b2] px-4 py-2 animate-fadeInCartTotal">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-orange-600 text-lg sm:text-xl font-extrabold bg-[#fffde7] rounded-xl shadow-[0_2px_8px_#ffe0b2] px-4 py-2">
            <span>CGST (2.5%)</span>
            <span>₹{cgst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-orange-600 text-lg sm:text-xl font-extrabold bg-[#fffde7] rounded-xl shadow-[0_2px_8px_#ffe0b2] px-4 py-2">
            <span>SGST (2.5%)</span>
            <span>₹{sgst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-orange-600 text-lg sm:text-xl font-extrabold bg-[#fffde7] rounded-xl shadow-[0_2px_8px_#ffe0b2] px-4 py-2">
            <span>Service Charge (5%)</span>
            <span>₹{serviceCharge.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-orange-600 text-lg sm:text-xl font-extrabold bg-[#fffde7] rounded-xl shadow-[0_2px_8px_#ffe0b2] px-4 py-2">
            <span className="font-extrabold">Total</span>
            <span className="font-extrabold">₹{total.toFixed(2)}</span>
          </div>
        </div>
        <button
          className="w-full mt-6 py-4 bg-gradient-to-r from-orange-500 to-amber-300 text-white rounded-xl text-xl font-extrabold tracking-wider shadow-[0_4px_16px_rgba(255,152,0,0.18)] hover:bg-gradient-to-r hover:from-amber-400 hover:to-amber-200 hover:filter hover:brightness-110 hover:drop-shadow-[0_0_12px_#ff9800cc] hover:shadow-[0_0_32px_#ff9800cc,0_4px_24px_rgba(255,152,0,0.18)] transition-all duration-200 animate-ctaGlow active:filter active:brightness-95 active:scale-95"
          onClick={onProceedToCheckout}
        >
          Proceed to Checkout
        </button>
        <button
          className="w-full mt-3 py-3 bg-orange-100 text-orange-700 rounded-xl text-lg font-bold hover:bg-orange-200 transition-all duration-200"
          onClick={handleDownloadPDF}
        >
          Download Bill (PDF)
        </button>
      </div>
    </div>
  );
}