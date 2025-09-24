import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { RentedItem } from '../types';
import { PrintIcon, CloseIcon } from './Icons';

interface PrintPreviewModalProps {
  rentedItems: RentedItem[];
  rentalDays: number;
  totalCost: number;
  subtotal: number;
  discount: number;
  discountAmount: number;
  customerName: string;
  startDate: string;
  endDate: string;
  onClose: () => void;
}

const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  rentedItems,
  rentalDays,
  totalCost,
  subtotal,
  discount,
  discountAmount,
  customerName,
  startDate,
  endDate,
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
    // Return just the number, formatted.
    return new Intl.NumberFormat('id-ID').format(amount);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handlePrint = () => {
    window.print();
  };
  
  const ReceiptContent = () => (
    <div className="bg-white text-black font-mono text-[10px] p-1 leading-tight">
      <header className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
            <img src="/tred-logo.png" alt="Logo" className="w-12 h-auto" />
        </div>
        <div className="tex-left">
            <h1 className="text-sm font-bold">TREDC OUTDOOR</h1>
            <p>Rental Peralatan Camping</p>
            <p>Babakan - Ciapus Banjaran</p>
            <p>Tlp:082120575451|IG:@tredc.outdoor</p>
        </div>
      </header>

      <hr className="border-t border-dashed border-black my-1" />

      <section className="text-[9px]">
        <div className="grid grid-cols-[max-content,1fr] gap-x-2">
            <span>Pelanggan</span>     <span>: {customerName || '...'}</span>
            <span>Tanggal Sewa</span>   <span>: {formatDate(startDate)}</span>
            <span>Tanggal Kembali</span><span>: {formatDate(endDate)}</span>
        </div>
      </section>

      <hr className="border-t border-dashed border-black my-1" />
      
      {/* Items Table */}
      <div>
        <div className="flex font-bold">
            <span className="flex-1">Nama Barang</span>
            <span className="w-6 text-center">QTY</span>
            <span className="w-14 text-right">Harga</span>
            <span className="w-16 text-right">Subtotal</span>
        </div>
         <hr className="border-t border-dashed border-black my-1" />
        {rentedItems.map(item => (
          <div key={item.id} className="flex">
            <span className="flex-1 pr-1">{item.name.toUpperCase()}</span>
            <span className="w-6 text-center">{item.quantity}</span>
            <span className="w-14 text-right">{formatCurrency(item.pricePerDay)}</span>
            <span className="w-16 text-right">{formatCurrency(item.pricePerDay * item.quantity * rentalDays)}</span>
          </div>
        ))}
      </div>

      <hr className="border-t border-dashed border-black my-1" />

      {/* Totals Section */}
      <section className="flex flex-col items-end text-[10px]">
        <div className="w-48">
             <div className="flex justify-between">
                <span>Total Sebelum Diskon</span>
                <span>{formatCurrency(subtotal)}</span>
            </div>
             <div className="flex justify-between">
                <span>Diskon ({discount}%)</span>
                <span>-{formatCurrency(discountAmount)}</span>
            </div>
            <hr className="border-t border-dashed border-black my-1" />
             <div className="flex justify-between font-bold">
                <span>TOTAL</span>
                <span>{formatCurrency(totalCost)}</span>
            </div>
        </div>
      </section>
      
      {/* Payment Section */}
      <section className="flex flex-col items-center text-center mt-3">
        <img src="/qrcode.png" alt="Kode Pembayaran QRIS" className="w-32 h-32" />
        <p className="mt-1 text-[9px]">Silahkan bayar ke DANA:</p>
        <p className="font-bold text-lg my-1">Rp {formatCurrency(totalCost)}</p>
        <p>Terima kasih atas kepercayaan Anda!</p>
        <p className="mt-2">- TREDC OUTDOOR -</p>
      </section>
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
            <div className="border rounded-md p-2 bg-slate-50 max-h-[60vh] overflow-y-auto">
                <div className="w-[270px] mx-auto scale-100">
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
