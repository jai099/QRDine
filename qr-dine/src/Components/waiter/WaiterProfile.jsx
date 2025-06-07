import React from 'react';

export default function WaiterProfile({ profile, ordersServed }) {
  const incentivePerOrder = 20;
  const totalIncentive = ordersServed * incentivePerOrder;

  return (
    <div className="flex flex-col items-center bg-warm-100 rounded-2xl shadow-[0_2px_10px_rgba(255,152,0,0.08)] p-8 max-w-md mx-auto gap-4 md:p-5 md:max-w-[95vw]">
      {/* Avatar */}
      <div className="text-6xl mb-1">{profile.avatar || '🧑‍🍳'}</div>

      {/* Profile Info */}
      <div className="w-full space-y-1 text-left text-orange-700 text-base font-semibold">
        <div><span className="font-bold">Name:</span> {profile.name}</div>
        <div><span className="font-bold">ID:</span> {profile.id}</div>
        <div><span className="font-bold">Phone:</span> {profile.phone || 'N/A'}</div>
        <div><span className="font-bold">Joined:</span> {profile.joined}</div>
      </div>

      {/* Stats Card */}
      <div className="bg-warm-300 rounded-xl p-4 text-green-800 font-bold text-base text-center w-full shadow-sm">
        <div>🍽️ Orders Served: <span className="text-green-700">{ordersServed}</span></div>
        <div className="mt-1">
          💸 Incentive: <span className="text-green-700">₹{totalIncentive}</span>
          <span className="text-green-500 font-medium ml-1">(+ ₹{incentivePerOrder}/order)</span>
        </div>
      </div>
    </div>
  );
}
