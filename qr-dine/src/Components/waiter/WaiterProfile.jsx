import React from 'react';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';

export default function WaiterProfile({ profile, ordersServed }) {
  const incentivePerOrder = 20;
  const totalIncentive = ordersServed * incentivePerOrder;
  const maxOrdersForProgress = 50; // Example target for radial progress
  const progress = Math.min((ordersServed / maxOrdersForProgress) * 100, 100);

  const profileVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      variants={profileVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center max-w-md mx-auto gap-6 p-6 md:p-5 md:max-w-[95vw]"
    >
      {/* Profile Card with Tilt Effect */}
      <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} perspective={1000} scale={1.02}>
        <div className="backdrop-blur-lg bg-white/30 border border-gray-200/50 rounded-2xl p-8 shadow-lg">
          {/* Avatar */}
          <div className="text-6xl mb-4 text-center">{profile.avatar || '🧑‍🍳'}</div>

          {/* Profile Info */}
          <div className="w-full space-y-2 text-left text-gray-700 text-base font-semibold">
            <div><span className="font-bold text-gray-900">Name:</span> {profile.name}</div>
            <div><span className="font-bold text-gray-900">ID:</span> {profile.id}</div>
            <div><span className="font-bold text-gray-900">Phone:</span> {profile.phone || 'N/A'}</div>
            <div><span className="font-bold text-gray-900">Joined:</span> {profile.joined}</div>
          </div>
        </div>
      </Tilt>

      {/* Stats Card with Radial Progress */}
      <div className="relative w-full bg-white/30 backdrop-blur-lg rounded-xl p-6 text-gray-800 font-bold text-center shadow-lg">
        <div className="relative flex items-center justify-center mb-4">
          <svg className="w-24 h-24">
            <circle
              className="text-gray-200"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="48"
              cy="48"
            />
            <circle
              className="text-green-500"
              strokeWidth="8"
              strokeDasharray={`${progress * 2.51}, 251.2`}
              strokeDashoffset="0"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="48"
              cy="48"
              transform="rotate(-90 48 48)"
            />
          </svg>
          <div className="absolute text-2xl font-bold text-green-600">{ordersServed}</div>
        </div>
        <div>🍽️ Orders Served</div>
        <div className="mt-2">
          💸 Incentive: <span className="text-green-600">₹{totalIncentive}</span>
          <span className="text-green-500 font-medium ml-1">(+ ₹{incentivePerOrder}/order)</span>
        </div>
      </div>

      {/* Shift Summary */}
      <div className="w-full bg-white/30 backdrop-blur-lg rounded-xl p-6 text-gray-800 text-center shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Shift Summary</h3>
        <div className="space-y-2 text-sm">
          <div>⏰ Shift Start: 9:00 AM, June 07, 2025</div>
          <div>📊 Tables Served: {Math.floor(ordersServed / 2)}</div>
          <div>🌟 Performance: {ordersServed >= maxOrdersForProgress ? 'Excellent' : 'Good'}</div>
        </div>
      </div>
    </motion.div>
  );
}