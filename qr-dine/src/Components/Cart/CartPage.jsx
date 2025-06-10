import React, { useState } from "react";
import CartItem from "./CartItem.jsx";
import jsPDF from "jspdf";
import OtpVerification from "./OtpVerification"; // Import the OTP component

export default function CartPage({ cart, setCart, onProceedToCheckout, tableNumber }) {
  const [showOtp, setShowOtp] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Only show items for the current table
  const tableCart = tableNumber
    ? cart.filter((item) => item.tableNumber === Number(tableNumber))
    : cart;

  const handleQuantityChange = (id, delta) => {
    setCart((items) =>
      items
        .map((item) =>
          item.id === id && (!tableNumber || item.tableNumber === Number(tableNumber))
            ? { ...item, qty: Math.max(1, item.qty + delta) }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const handleDelete = (id) => {
    setCart((items) => items.filter((item) => !(item.id === id && (!tableNumber || item.tableNumber === Number(tableNumber)))));
  };

  const subtotal = tableCart.reduce((sum, item) => sum + item.price * item.qty, 0);
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
    cart.forEach((item) => {
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

  const handleProceedClick = () => {
    if (onProceedToCheckout) {
      onProceedToCheckout();
    } else {
      window.location.href = '/confirm';
    }
  };

  const handleOtpVerified = () => {
    // Place your backend call to place order here
    setOrderPlaced(true);
    setShowOtp(false);
    onProceedToCheckout(); // Proceed with existing logic
    // Removed automatic bill PDF download after OTP verification
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-r from-[#fff3e0] to-[#ffe0b2] animate-fadeInCartBg">
      {showOtp && !orderPlaced ? (
        <OtpVerification onVerified={handleOtpVerified} />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-8 pt-14 pb-8">
            <h2 className="text-center text-4xl font-extrabold text-orange-500 tracking-wider mb-7 drop-shadow-[0_2px_8px_#ffe0b2] animate-popInCart">
              Your Cart
            </h2>
            <div>
              {tableCart.length === 0 ? (
                <div className="text-center text-orange-500 font-bold text-xl mt-10 tracking-wide">
                  Your cart is empty!
                </div>
              ) : (
                tableCart.map((item) => (
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
          <div className="sticky bottom-0 left-0 w-full bg-white/85 backdrop-blur-lg shadow-[0_-2px_16px_rgba(255,152,0,0.08)] px-8 pb-6 z-[100] rounded-b-3xl pointer-events-auto">
            <div className="flex justify-between items-center pt-4 text-orange-600 text-xl font-extrabold bg-[#fffde7] rounded-xl shadow-[0_2px_8px_#ffe0b2] animate-fadeInCartTotal">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-4 text-orange-600 text-xl font-extrabold bg-[#fffde7] rounded-xl shadow-[0_2px_8px_#ffe0b2]">
              <span>CGST (2.5%)</span>
              <span>₹{cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-4 text-orange-600 text-xl font-extrabold bg-[#fffde7] rounded-xl shadow-[0_2px_8px_#ffe0b2]">
              <span>SGST (2.5%)</span>
              <span>₹{sgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-4 text-orange-600 text-xl font-extrabold bg-[#fffde7] rounded-xl shadow-[0_2px_8px_#ffe0b2]">
              <span>Service Charge (5%)</span>
              <span>₹{serviceCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-4 text-orange-600 text-xl font-extrabold bg-[#fffde7] rounded-xl shadow-[0_2px_8px_#ffe0b2]">
              <span className="font-extrabold">Total</span>
              <span className="font-extrabold">₹{total.toFixed(2)}</span>
            </div>
            <button
              className={`w-full mt-4 py-4 bg-gradient-to-r from-orange-500 to-amber-300 text-white rounded-xl text-xl font-extrabold tracking-wider shadow-[0_4px_16px_rgba(255,152,0,0.18)] hover:bg-gradient-to-r hover:from-amber-400 hover:to-amber-200 hover:filter hover:brightness-110 hover:drop-shadow-[0_0_12px_#ff9800cc] hover:shadow-[0_0_32px_#ff9800cc,0_4px_24px_rgba(255,152,0,0.18)] transition-all duration-200 animate-ctaGlow active:filter active:brightness-95 active:scale-95 z-20 pointer-events-auto ${tableCart.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleProceedClick}
              disabled={tableCart.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
