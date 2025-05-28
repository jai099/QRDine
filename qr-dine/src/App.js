import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import CartPage from './CartPage';

function App() {
  const [showCart, setShowCart] = useState(false);

  return (
    <div className="App">
      {/* Cart button at top right */}
      <button
        onClick={() => setShowCart(true)}
        style={{
          position: "absolute",
          top: 24,
          right: 32,
          background: "#fff",
          border: "none",
          borderRadius: "50%",
          boxShadow: "0 2px 8px rgba(60,60,120,0.10)",
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 10
        }}
        aria-label="View Cart"
      >
        {/* Simple cart SVG icon */}
        <svg width="28" height="28" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
      </button>
      {showCart ? (
        <>
          <button
            onClick={() => setShowCart(false)}
            style={{
              position: "absolute",
              top: 24,
              left: 32,
              background: "#fff",
              border: "none",
              borderRadius: "50%",
              boxShadow: "0 2px 8px rgba(60,60,120,0.10)",
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 10
            }}
            aria-label="Back"
          >
            {/* Left arrow icon */}
            <svg width="24" height="24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <CartPage />
        </>
      ) : (
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      )}
    </div>
  );
}

export default App;
