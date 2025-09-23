import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { RentedItem } from '../types';
import { MountainIcon, PrintIcon, CloseIcon } from './Icons';

interface PrintPreviewModalProps {
  rentedItems: RentedItem[];
  rentalDays: number;
  totalCost: number;
  onClose: () => void;
}

const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  rentedItems,
  rentalDays,
  totalCost,
  onClose,
}) => {
  const modalRoot = document.getElementById('modal-root');

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!modalRoot) return null; // Should not happen

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Centering container (allows clicks to pass through to backdrop) */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none print-modal-wrapper">
        
        {/* Modal Content Window (re-enables clicks for itself and children) */}
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-md print-modal-content pointer-events-auto"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()} // Prevents clicks inside modal from closing it
        >
          <div className="p-6">
            {/* This div is the actual printable area */}
            <div>
              <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                      <MountainIcon className="h-8 w-8 text-emerald-500" />
                      <h1 className="text-2xl font-bold text-slate-800 tracking-wider">
                          Tredcental
                      </h1>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-600">Struk Sewa</h2>
              </div>

              <div className="border-t border-b border-slate-200 py-4 mb-4">
                  <div className="flex justify-between text-sm text-slate-600">
                      <span>Tanggal:</span>
                      <span>{new Date().toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600 mt-1">
                      <span>Durasi Sewa:</span>
                      <span>{rentalDays} hari</span>
                  </div>
              </div>

              <table className="w-full text-sm">
                  <thead>
                      <tr className="border-b">
                          <th className="text-left font-semibold text-slate-600 pb-2">Barang</th>
                          <th className="text-center font-semibold text-slate-600 pb-2">Jml</th>
                          <th className="text-right font-semibold text-slate-600 pb-2">Subtotal</th>
                      </tr>
                  </thead>
                  <tbody>
                      {rentedItems.map(item => (
                          <tr key={item.id}>
                              <td className="py-2 text-slate-800">{item.name}</td>
                              <td className="text-center py-2 text-slate-800">{item.quantity}</td>
                              <td className="text-right py-2 text-slate-800">{formatCurrency(item.pricePerDay * item.quantity * rentalDays)}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>

              <div className="mt-6 pt-4 border-t-2 border-dashed">
                  <div className="flex justify-between items-center text-lg">
                      <span className="font-bold text-slate-800">Total</span>
                      <span className="font-extrabold text-emerald-600">{formatCurrency(totalCost)}</span>
                  </div>
              </div>
              
              <p className="text-center text-xs text-slate-500 mt-8">
                  Terima kasih telah menyewa di Tredcental!
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 flex justify-end space-x-3 rounded-b-xl no-print">
            <button
              onClick={onClose}
              className="bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-50 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <CloseIcon className="h-5 w-5" />
              <span>Tutup</span>
            </button>
            <button
              onClick={handlePrint}
              className="bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <PrintIcon className="h-5 w-5" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(modalContent, modalRoot);
};

export default PrintPreviewModal;
