import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { RentedItem } from '../types';
import { QrStatus } from '../App';
import { MountainIcon, PrintIcon, CloseIcon } from './Icons';

interface PrintPreviewModalProps {
  rentedItems: RentedItem[];
  rentalDays: number;
  totalCost: number;
  onClose: () => void;
  qrisCodeUrl: string | null;
  qrStatus: QrStatus;
}

const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  rentedItems,
  rentalDays,
  totalCost,
  onClose,
  qrisCodeUrl,
  qrStatus,
}) => {
  const modalRoot = document.getElementById('modal-root');

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

  if (!modalRoot) return null;

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

  const QrCodeDisplay = () => {
    switch (qrStatus) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center h-48 bg-slate-100 rounded-lg">
            <svg className="animate-spin h-10 w-10 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-3 text-sm text-slate-600">Membuat kode QRIS...</p>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center h-48 bg-red-50 rounded-lg text-center p-4">
            <p className="font-semibold text-red-600">Gagal Membuat QRIS</p>
            <p className="text-sm text-slate-600 mt-1">Tidak dapat membuat kode pembayaran. Pastikan ada barang di keranjang.</p>
          </div>
        );
      case 'idle':
        if (qrisCodeUrl) {
          return <img src={qrisCodeUrl} alt="Kode Pembayaran QRIS" className="w-48 h-48" />;
        }
        return null;
      default:
        return null;
    }
  };

  const modalContent = (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none print-modal-wrapper">
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-md print-modal-content pointer-events-auto"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
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
              
              <div className="mt-6 pt-6 border-t text-center">
                <h3 className="font-semibold text-slate-700">Pembayaran QRIS</h3>
                <div className="mt-2 flex items-center justify-center">
                  <QrCodeDisplay />
                </div>
                <p className="text-xs text-slate-500 mt-2">Pindai untuk membayar tagihan ini.</p>
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
              disabled={qrStatus === 'loading'}
              className="bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
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