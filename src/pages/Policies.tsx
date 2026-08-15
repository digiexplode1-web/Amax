import React from 'react';
import { useLocation } from 'react-router-dom';

export const Policies: React.FC = () => {
  const { pathname } = useLocation();

  let title = 'Privacy Policy';
  let content = (
    <div className="space-y-4 text-xs text-[#756A64] leading-relaxed">
      <p>At Amax Craft, we respect your privacy and are committed to protecting your personal data. We collect customer information strictly for order processing, custom CAD design consultation, and crate shipment coordination.</p>
      <p>Your details will never be sold or transferred to third-party advertisers. All transaction and database entries are securely stored in our cloud infrastructure.</p>
    </div>
  );

  if (pathname === '/terms') {
    title = 'Terms & Conditions';
    content = (
      <div className="space-y-4 text-xs text-[#756A64] leading-relaxed">
        <p>Welcome to Amax Craft. By placing an order for CNC laser cutting jalis, room dividers, or railing strips, you agree to the following terms:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Custom laser cut products are manufactured to dimensions confirmed during CAD drawing sign-off.</li>
          <li>Site measurement verification is the responsibility of the customer prior to fabrication.</li>
          <li>Panels supplied with powder coating or PVD finish must be handled carefully during installation.</li>
        </ul>
      </div>
    );
  } else if (pathname === '/shipping-policy') {
    title = 'Shipping & Delivery Policy';
    content = (
      <div className="space-y-4 text-xs text-[#756A64] leading-relaxed">
        <p>Amax Craft dispatches products across India in heavy-duty wooden crate packaging to protect metal and wooden jali panels from transit damage.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Standard dispatch timeline: 5-7 business days from CAD drawing approval.</li>
          <li>Tracking numbers and transport invoice details are provided upon dispatch.</li>
        </ul>
      </div>
    );
  } else if (pathname === '/return-refund-policy') {
    title = 'Return & Refund Policy';
    content = (
      <div className="space-y-4 text-xs text-[#756A64] leading-relaxed">
        <p>Since Amax Craft products are custom manufactured to specified sizes and thicknesses:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Defective or transit-damaged items will be replaced free of cost upon unboxing video proof within 48 hours of delivery.</li>
          <li>Custom CAD panels cannot be returned for change of mind once cutting has commenced.</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="border-b border-[#F4E3DD] pb-4">
        <span className="text-xs font-bold text-[#C7953E] uppercase tracking-wider block">
          Amax Craft Legal
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#751C2F]">
          {title}
        </h1>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#F4E3DD] shadow-xs">
        {content}
      </div>
    </div>
  );
};
