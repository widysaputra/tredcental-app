import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { RentedItem } from '../types';
import { PrintIcon, CloseIcon } from './Icons';

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
  
  const ReceiptContent = () => (
    <div className="bg-white text-black font-mono text-xs p-2">
      <header className="text-center mb-4">
        <h1 className="text-lg font-semibold uppercase">Tredcental</h1>
        <p>Rental Alat Camping</p>
        <p>Jl. Petualang No. 1, Jakarta</p>
        <p>--------------------------------</p>
      </header>
      <section className="mb-2">
        <div className="flex justify-between">
          <span>Tanggal:</span>
          <span>{new Date().toLocaleDateString('id-ID')}</span>
        </div>
        <div className="flex justify-between">
          <span>Durasi:</span>
          <span>{rentalDays} Hari</span>
        </div>
      </section>
      <p>--------------------------------</p>
      <section>
        {rentedItems.map(item => (
          <div key={item.id} className="mb-1">
            <p>{item.name}</p>
            <div className="flex justify-between">
              <span>  {item.quantity}x {formatCurrency(item.pricePerDay * rentalDays)}</span>
              <span>{formatCurrency(item.pricePerDay * item.quantity * rentalDays)}</span>
            </div>
          </div>
        ))}
      </section>
      <p>--------------------------------</p>
      <section className="font-semibold">
        <div className="flex justify-between text-sm">
          <span>TOTAL</span>
          <span>{formatCurrency(totalCost)}</span>
        </div>
      </section>
      <p>--------------------------------</p>
      <section className="flex flex-col items-center text-center mt-4">
        <h2 className="font-semibold mb-2">PEMBAYARAN QRIS</h2>
        <img src="/qris-payment.png" alt="Kode Pembayaran QRIS" className="w-40 h-40" />
        <p className="mt-2">Pindai untuk membayar</p>
      </section>
      <footer className="text-center mt-6">
        <p>Terima kasih telah menyewa!</p>
        <p>Simpan struk ini sebagai bukti sewa.</p>
      </footer>
    </div>
  );

  const modalContent = (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none print-modal-wrapper">
        <div
          className="bg-white rounded-lg shadow-2xl w-full max-w-sm print-modal-content pointer-events-auto flex flex-col"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Preview for screen */}
          <div className="p-4 no-print overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Pratinjau Struk</h3>
            <div className="border rounded-md p-2 bg-slate-50 max-h-96 overflow-y-auto">
                <div className="w-[300px] mx-auto scale-90">
                    <ReceiptContent />
                </div>
            </div>
          </div>
           {/* Hidden content for printing */}
          <div className="hidden print:block">
            <ReceiptContent />
          </div>

          <div className="bg-slate-100 p-4 flex justify-end space-x-3 rounded-b-lg no-print">
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
              <span>Cetak Struk</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(modalContent, modalRoot);
};

export default PrintPreviewModal;