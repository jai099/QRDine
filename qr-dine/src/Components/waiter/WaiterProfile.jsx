import React from 'react';
import './WaiterProfile.css';

export default function WaiterProfile({ profile, ordersServed }) {
  return (
    <div className="waiter-profile-root">
      <div className="waiter-profile-avatar">{profile.avatar}</div>
      <div className="waiter-profile-info">
        <div><b>Name:</b> {profile.name}</div>
        <div><b>ID:</b> {profile.id}</div>
        <div><b>Phone:</b> {profile.phone}</div>
        <div><b>Joined:</b> {profile.joined}</div>
      </div>
      <div className="waiter-profile-bonus">
        <b>Orders Served:</b> {ordersServed}<br/>
        <b>Incentive:</b> ₹{ordersServed * 20} <span style={{color:'#43ea5e'}}>+ ₹20/order</span>
      </div>
    </div>
  );
}
