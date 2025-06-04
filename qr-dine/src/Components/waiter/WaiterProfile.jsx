import React from 'react';

export default function WaiterProfile({ profile, ordersServed }) {
  return (
    <div className="flex flex-col items-center bg-warm-100 rounded-2xl shadow-[0_2px_10px_rgba(255,152,0,0.07)] p-9 max-w-[400px] mx-auto gap-4.5 md:p-4.5 md:pb-3 md:max-w-[98vw]">
      <div className="text-6xl mb-2">{profile.avatar}</div>
      <div className="text-lg text-orange-600 font-bold text-left w-full mb-2 space-y-1">
        <div><b>Name:</b> {profile.name}</div>
        <div><b>ID:</b> {profile.id}</div>
        <div><b>Phone:</b> {profile.phone}</div>
        <div><b>Joined:</b> {profile.joined}</div>
      </div>
      <div className="bg-warm-300 rounded-[10px] p-3.5 text-green-700 font-bold text-lg text-center shadow-[0_1px_4px_#ffe0b2]">
        <div><b>Orders Served:</b> {ordersServed}</div>
        <div>
          <b>Incentive:</b> ₹{ordersServed * 20} <span className="text-green-500">+ ₹20/order</span>
        </div>
      </div>
    </div>
  );
}