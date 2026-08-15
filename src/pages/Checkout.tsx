import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart, placeOrder } = useShop();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('WhatsApp Direct / Bank Transfer');

  const [submitting, setSubmitting] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const gstAmount = Math.round(cartTotal * 0.18);
  const finalTotal = cartTotal + gstAmount;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !address || !pincode) {
      setErrorMsg('Please fill in all required customer details.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const newOrder = {
        customerName,
        customerEmail,
        customerPhone,
        address: `${address}, ${city}, ${state} - ${pincode}`,
        city,
        state,
        pincode,
        items: cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          imageUrl: item.product.imageUrl || item.product.images[0],
          selectedFinish: item.selectedFinish || 'Standard',
        })),
        totalAmount: finalTotal,
        paymentMethod,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };

      const docId = await placeOrder(newOrder);
      setCompletedOrderId(docId);
      clearCart();
    } catch (err: any) {
      console.error('Order submission error:', err);
      setErrorMsg(`Failed to save order to Firestore: ${err.message || String(err)}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (completedOrderId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold text-[#C7953E] uppercase tracking-wider block">
          Order Successfully Placed
        </span>

        <h1 className="font-serif text-3xl font-bold text-[#751C2F]">
          Thank You for Your Order!
        </h1>

        <p className="text-xs text-[#756A64] max-w-md mx-auto leading-relaxed">
          Your order has been recorded in the Amax Craft database. Our CAD design team will contact you shortly to confirm laser cutting measurements.
        </p>

        <div className="bg-white p-4 rounded-xl border border-[#F4E3DD] text-xs font-mono text-left max-w-sm mx-auto space-y-1">
          <div><strong className="text-[#751C2F]">Order ID:</strong> {completedOrderId}</div>
          <div><strong className="text-[#751C2F]">Total Amount:</strong> ₹{finalTotal.toLocaleString('en-IN')}</div>
          <div><strong className="text-[#751C2F]">Status:</strong> Pending Confirmation</div>
        </div>

        <div className="pt-4 flex justify-center gap-4">
          <Link
            to={`/orders`}
            className="px-6 py-2.5 bg-[#751C2F] text-white text-xs font-bold rounded-lg hover:bg-[#591423]"
          >
            Track Your Orders
          </Link>

          <Link
            to="/"
            className="px-6 py-2.5 bg-[#F4E3DD] text-[#751C2F] text-xs font-bold rounded-lg hover:bg-[#ebd5cd]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-xl font-bold text-[#751C2F]">
          Your Cart is Empty
        </h2>
        <p className="text-xs text-[#756A64]">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link to="/shop" className="inline-block px-5 py-2 bg-[#751C2F] text-white text-xs font-bold rounded-lg">
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#751C2F] hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Cart</span>
      </Link>

      <div className="border-b border-[#F4E3DD] pb-4">
        <span className="text-xs font-bold text-[#C7953E] uppercase tracking-wider block">
          Complete Your Purchase
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#751C2F]">
          Amax Craft Checkout
        </h1>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Details Form */}
        <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-xl border border-[#F4E3DD]">
          <h3 className="font-serif font-bold text-base text-[#751C2F] border-b border-[#F4E3DD] pb-3">
            Shipping & Custom Delivery Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-[#25201E] block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full bg-[#FFF9F0] border border-[#F4E3DD] rounded-lg p-2.5 outline-none focus:border-[#C7953E]"
              />
            </div>

            <div>
              <label className="font-bold text-[#25201E] block mb-1">Phone / WhatsApp Number *</label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 8514000016"
                className="w-full bg-[#FFF9F0] border border-[#F4E3DD] rounded-lg p-2.5 outline-none focus:border-[#C7953E]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-[#25201E] block mb-1">Email Address</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="ramesh@example.com"
                className="w-full bg-[#FFF9F0] border border-[#F4E3DD] rounded-lg p-2.5 outline-none focus:border-[#C7953E]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-[#25201E] block mb-1">Street Address / Site Location *</label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Plot No, Road, Landmark"
                className="w-full bg-[#FFF9F0] border border-[#F4E3DD] rounded-lg p-2.5 outline-none focus:border-[#C7953E]"
              />
            </div>

            <div>
              <label className="font-bold text-[#25201E] block mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Jaipur"
                className="w-full bg-[#FFF9F0] border border-[#F4E3DD] rounded-lg p-2.5 outline-none focus:border-[#C7953E]"
              />
            </div>

            <div>
              <label className="font-bold text-[#25201E] block mb-1">State / Pincode *</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Rajasthan"
                  className="w-full bg-[#FFF9F0] border border-[#F4E3DD] rounded-lg p-2.5 outline-none"
                />
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="302001"
                  className="w-full bg-[#FFF9F0] border border-[#F4E3DD] rounded-lg p-2.5 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="pt-4 border-t border-[#F4E3DD] space-y-3">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#751C2F]">
              Payment Options
            </h4>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 p-3 rounded-lg border border-[#F4E3DD] bg-[#FFF9F0] cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'WhatsApp Direct / Bank Transfer'}
                  onChange={() => setPaymentMethod('WhatsApp Direct / Bank Transfer')}
                />
                <span className="font-semibold text-[#25201E]">Direct Factory Inquiry / UPI / Bank Transfer</span>
              </label>
              <label className="flex items-center gap-2 p-3 rounded-lg border border-[#F4E3DD] bg-white cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Cash on Custom Crate Delivery'}
                  onChange={() => setPaymentMethod('Cash on Custom Crate Delivery')}
                />
                <span className="font-semibold text-[#25201E]">Pay Advance + Balance on Crate Delivery</span>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary & Submit Column */}
        <div className="bg-white p-6 rounded-xl border border-[#F4E3DD] space-y-6 h-fit shadow-sm">
          <h3 className="font-serif font-bold text-[#751C2F] text-base border-b border-[#F4E3DD] pb-3">
            Cart Items ({cart.length})
          </h3>

          <div className="space-y-3 text-xs divide-y divide-[#F4E3DD]/60 max-h-60 overflow-y-auto pr-1">
            {cart.map((i) => (
              <div key={i.product.id} className="pt-2 flex justify-between gap-2">
                <div>
                  <div className="font-bold text-[#25201E]">{i.product.name}</div>
                  <div className="text-[10px] text-[#756A64]">Qty: {i.quantity} | {i.selectedFinish || 'Standard'}</div>
                </div>
                <div className="font-bold text-[#751C2F]">₹{(i.product.price * i.quantity).toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#F4E3DD] space-y-2 text-xs text-[#756A64]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-[#25201E]">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span className="font-bold text-[#25201E]">₹{gstAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-2 border-t border-[#F4E3DD] flex justify-between text-base font-bold text-[#751C2F]">
              <span>Payable Total</span>
              <span>₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#751C2F] text-white font-bold text-xs rounded-xl hover:bg-[#591423] transition-colors shadow-md disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Recording Order to Database...</span>
              </>
            ) : (
              <span>Confirm Order</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
