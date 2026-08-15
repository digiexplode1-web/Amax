import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Order } from '../types';
import { Package, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const ordersRef = collection(db, 'orders');
    const unsub = onSnapshot(
      ordersRef,
      (snapshot) => {
        const list: Order[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            customerName: data.customerName || 'Customer',
            customerEmail: data.customerEmail || '',
            customerPhone: data.customerPhone || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            pincode: data.pincode || '',
            items: data.items || [],
            totalAmount: Number(data.totalAmount) || 0,
            paymentMethod: data.paymentMethod || 'Direct Inquiry',
            status: data.status || 'Pending',
            createdAt: data.createdAt || new Date().toISOString(),
          });
        });
        setOrders(list);
        setLoading(false);
      },
      (err) => {
        console.warn('Orders snapshot warning:', err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-[#F4E3DD] pb-4">
        <span className="text-xs font-bold text-[#C7953E] uppercase tracking-wider block">
          Live Database Orders
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#751C2F]">
          Order History & Tracking
        </h1>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs text-[#756A64]">
          Loading orders from Firestore...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#F4E3DD] p-12 text-center space-y-3 max-w-md mx-auto">
          <Package className="w-12 h-12 text-[#F4E3DD] mx-auto" />
          <h2 className="font-serif font-bold text-[#751C2F] text-lg">
            No Orders Found
          </h2>
          <p className="text-xs text-[#756A64]">
            When you place an order in the checkout page, it will automatically register here in real-time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-5 rounded-xl border border-[#F4E3DD] space-y-4 shadow-2xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F4E3DD] pb-3 text-xs">
                <div>
                  <span className="font-mono text-[#751C2F] font-bold">Order ID: #{order.id}</span>
                  <div className="text-[#756A64] text-[11px] mt-0.5">Customer: {order.customerName} ({order.customerPhone})</div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-200">
                    {order.status}
                  </span>
                  <span className="font-serif font-bold text-sm text-[#751C2F]">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-[#FFF9F0] p-2.5 rounded-lg border border-[#F4E3DD]">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt="" className="w-12 h-12 object-cover rounded bg-white" />
                    )}
                    <div>
                      <div className="font-bold text-[#25201E] line-clamp-1">{item.productName}</div>
                      <div className="text-[10px] text-[#756A64]">Qty: {item.quantity} | {item.selectedFinish}</div>
                      <div className="font-semibold text-[#751C2F]">₹{item.price.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-[#756A64] flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F4E3DD]/60">
                <div>Address: {order.address}</div>
                <div>Placed on: {new Date(order.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
