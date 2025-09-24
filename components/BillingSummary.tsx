import React from 'react';
import { RentedItem } from '../types';
import { MinusIcon, PlusIcon, TrashIcon, EmptyCartIcon, QrisIcon } from './Icons';

interface BillingSummaryProps {
  rentedItems: RentedItem[];
  totalCost: number;
  subtotal: number;
  discountAmount: number;
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  onPrint: () => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  discount: number;
  setDiscount: (percent: number) => void;
}

const BillingSummary: React.FC<BillingSummaryProps> = ({
  rentedItems,
  totalCost,
  subtotal,
  discountAmount,
  onUpdateQuantity,
  onRemoveItem,
  onPrint,
  customerName,
  setCustomerName,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  discount,
  setDiscount,
}) => {
    
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div id="billing-summary" className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-slate-800 border-b pb-4 mb-4">Ringkasan Tagihan</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
            <label htmlFor="customer-name" className="block text-sm font-medium text-slate-700 mb-1">
                Nama Pelanggan
            </label>
            <input
                type="text"
                id="customer-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Masukkan nama pelanggan"
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
        </div>
         <div>
            <label htmlFor="discount" className="block text-sm font-medium text-slate-700 mb-1">
                Diskon (%)
            </label>
            <input
                type="number"
                id="discount"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                min="0"
                max="100"
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
        </div>
        <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-slate-700 mb-1">
                Tanggal Sewa
            </label>
            <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
        </div>
        <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-slate-700 mb-1">
                Tanggal Kembali
            </label>
            <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
        </div>
      </div>

      <div className="space-y-4">
        {rentedItems.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <EmptyCartIcon className="h-16 w-16 mx-auto text-slate-300 mb-4" />
            <p className="font-medium">Keranjang sewa kosong</p>
            <p className="text-sm">Silakan pilih barang untuk disewa.</p>
          </div>
        ) : (
          rentedItems.map(item => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">{item.name}</p>
                <p className="text-sm text-slate-500">{formatCurrency(item.pricePerDay)} / hari</p>
              </div>
              <div className="flex items-center space-x-2 no-print">
                <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full bg-slate-200 hover:bg-slate-300"><MinusIcon className="h-4 w-4 text-slate-600"/></button>
                <span className="font-bold w-6 text-center">{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full bg-slate-200 hover:bg-slate-300"><PlusIcon className="h-4 w-4 text-slate-600"/></button>
                <button onClick={() => onRemoveItem(item.id)} className="p-1.5 rounded-full text-red-500 hover:bg-red-100"><TrashIcon className="h-4 w-4"/></button>
              </div>
            </div>
          ))
        )}
      </div>

      {rentedItems.length > 0 && (
        <div className="mt-6 pt-4 border-t">
           <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-slate-600">Total Sebelum Diskon</span>
                <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-slate-600">Diskon ({discount}%)</span>
                <span className="font-semibold text-red-500">-{formatCurrency(discountAmount)}</span>
            </div>
            <div className="mt-2 pt-2 border-t flex justify-between items-center text-xl">
                <span className="font-bold text-slate-800">Total</span>
                <span className="font-extrabold text-emerald-600">{formatCurrency(totalCost)}</span>
            </div>
          </div>

          <div className="mt-6 no-print">
            <button 
              onClick={onPrint}
              disabled={rentedItems.length === 0}
              className="w-full bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              <QrisIcon className="h-5 w-5" />
              <span>Buat Tagihan & QRIS</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingSummary;