import React from 'react';
import { Booking } from '../types/hotel';
import { Hotel, Printer, X, CheckCircle, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

interface InvoiceModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${booking.id.replace('bk-', '').toUpperCase()}`;
  const invoiceDate = new Date(booking.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm print:p-0 print:bg-white animate-fadeIn">
      <div className="bg-white text-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:w-full print:rounded-none">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-300">
              Official Tax Invoice / Folio
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Area */}
        <div id="printable-invoice" className="p-8 overflow-y-auto space-y-6 print:p-6 print:overflow-visible">
          
          {/* Header & Logo */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
                  <Hotel className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-black tracking-tight text-slate-900">
                    Grand Stay Resort & Spa
                  </h2>
                  <p className="text-xs text-slate-500 font-sans">Luxury Hospitality & Suites Ltd.</p>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-600 space-y-0.5">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  124 Marine Promenade, Coastal Bay, Mumbai 400001
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  +91 (22) 8800-4321 • Helpdesk: 24/7
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  reservations@hotelgrandstay.com • GSTIN: 27AABCG9876Q1Z3
                </p>
              </div>
            </div>

            {/* Invoice Metas */}
            <div className="sm:text-right text-xs space-y-1">
              <span className="inline-block px-2.5 py-1 rounded font-bold text-xs bg-slate-100 text-slate-800 border border-slate-300">
                TAX INVOICE
              </span>
              <p className="font-mono text-sm font-bold text-slate-900 mt-2">{invoiceNumber}</p>
              <p className="text-slate-500">Date: {invoiceDate}</p>
              <p className="text-slate-500">
                Status:{' '}
                <span
                  className={`font-semibold ${
                    booking.status === 'Cancelled'
                      ? 'text-red-600'
                      : booking.status === 'Checked-in'
                      ? 'text-blue-600'
                      : 'text-emerald-600'
                  }`}
                >
                  {booking.status}
                </span>
              </p>
              <p className="text-slate-500">
                Payment: <strong className="text-slate-900">{booking.paymentStatus}</strong>
              </p>
            </div>
          </div>

          {/* Billed To / Guest Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <p className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                Guest Information (Billed To)
              </p>
              <p className="text-sm font-bold text-slate-900 mt-1">{booking.guestName}</p>
              <p className="text-slate-600">{booking.guestEmail}</p>
              <p className="text-slate-600">Phone: {booking.guestPhone}</p>
              <p className="text-slate-500 mt-1">Guests: {booking.guestsCount} Person(s)</p>
            </div>
            <div>
              <p className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                Stay Schedule Details
              </p>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <span className="text-slate-500 block text-[11px]">Check-in</span>
                  <span className="font-semibold text-slate-900">{booking.checkIn}</span>
                  <span className="text-slate-400 block text-[10px]">(From 2:00 PM)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Check-out</span>
                  <span className="font-semibold text-slate-900">{booking.checkOut}</span>
                  <span className="text-slate-400 block text-[10px]">(By 11:00 AM)</span>
                </div>
              </div>
              <p className="text-slate-500 mt-2">
                Room Allocated: <strong className="text-slate-900">Room #{booking.roomNumber} ({booking.roomType})</strong>
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Description</th>
                  <th className="py-2.5 px-4 font-semibold text-center">Nights</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Tariff / Night</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">
                      {booking.roomType} Suite Accommodation - Room #{booking.roomNumber}
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      Stay from {booking.checkIn} to {booking.checkOut}
                      {booking.specialRequests ? ` • Req: ${booking.specialRequests}` : ''}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-center font-medium">{booking.nights}</td>
                  <td className="py-3 px-4 text-right font-medium">${booking.pricePerNight.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-semibold">
                    ${(booking.nights * booking.pricePerNight).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end">
            <div className="w-full sm:w-64 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Room Charges Subtotal:</span>
                <span className="font-semibold text-slate-900">
                  ${(booking.nights * booking.pricePerNight).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Hospitality GST & Tax (12%):</span>
                <span className="font-semibold text-slate-900">${booking.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 text-sm font-bold text-slate-900 border-b-2 border-slate-900">
                <span>Grand Total:</span>
                <span className="text-amber-600 text-base">${booking.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-500 text-[11px]">
                <span>Amount Paid:</span>
                <span className="font-semibold text-emerald-600">
                  {booking.paymentStatus === 'Paid' ? `$${booking.totalAmount.toFixed(2)}` : '$0.00'}
                </span>
              </div>
              {booking.paymentStatus === 'Refunded' && (
                <div className="flex justify-between py-1 text-red-600 font-semibold text-[11px]">
                  <span>Refund Issued:</span>
                  <span>-${booking.totalAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer & Signature */}
          <div className="border-t border-slate-200 pt-6 text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between items-end gap-6">
            <div className="space-y-1 max-w-sm">
              <p className="font-semibold text-slate-700">Terms & Guest Policies:</p>
              <p>1. Check-in: 14:00 hrs | Check-out: 11:00 hrs.</p>
              <p>2. Government-issued photo ID is required upon check-in.</p>
              <p>3. This is a computer-generated tax folio for B.Tech IT College Project evaluation.</p>
            </div>
            <div className="text-center sm:text-right">
              <div className="w-36 h-10 border-b border-slate-400 mx-auto sm:ml-auto"></div>
              <p className="font-semibold text-slate-800 mt-1">Authorized Signatory</p>
              <p className="text-[10px] text-slate-400">Grand Stay Front Office</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
