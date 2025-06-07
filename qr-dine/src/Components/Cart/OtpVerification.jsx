import React, { useState } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../firebase.js';

const OtpVerification = ({ onVerified }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState('');
    const [step, setStep] = useState(1);
    
    console.log(auth)

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response) => {
            console.log('reCAPTCHA solved', response);
          },
          'expired-callback': () => {
            setError('reCAPTCHA expired. Please try again.');
          }
        },
        auth
      );
      window.recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
      });
    }
  };

  const handleSendOTP = async () => {
    setError('');
    if (!phone.startsWith('+91')) {
      setError('Phone number must include +91 (India country code)');
      return;
    }

    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
        console.log(result)
        setConfirmationResult(result);
      setStep(2);
    } catch (err) {
        console.error(err);
        console.log(err)
      setError(err.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOTP = async () => {
    setError('');
    try {
      await confirmationResult.confirm(otp);
      onVerified(); // Proceed to next step
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-amber-200 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm border border-orange-200">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-4">
          {step === 1 ? 'Enter Mobile Number' : 'Enter OTP'}
        </h2>

        {step === 1 ? (
          <>
            <input
              type="tel"
              placeholder="+91XXXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mb-4 p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              onClick={handleSendOTP}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-300 text-white font-bold rounded-lg shadow hover:brightness-110 transition-all duration-200"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mb-4 p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              onClick={handleVerifyOTP}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-lime-400 text-white font-bold rounded-lg shadow hover:brightness-110 transition-all duration-200"
            >
              Verify OTP
            </button>
          </>
        )}

        {error && <p className="text-red-500 mt-3 text-center font-semibold">{error}</p>}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default OtpVerification;
