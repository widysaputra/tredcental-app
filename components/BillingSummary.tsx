import React from 'react';
import { RentedItem } from '../types';
import { MinusIcon, PlusIcon, TrashIcon, CalendarIcon, EmptyCartIcon, QrisIcon } from './Icons';

interface BillingSummaryProps {
  rentedItems: RentedItem[];
  rentalDays: number;
  totalCost: number;
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  onSetRentalDays: (days: number) => void;
  onPrint: () => void;
}

const BillingSummary: React.FC<BillingSummaryProps> = ({
  rentedItems,
  rentalDays,
  totalCost,
  onUpdateQuantity,
  onRemoveItem,
  onSetRentalDays,
  onPrint,
}) => {
    
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const days = parseInt(e.target.value, 10);
    onSetRentalDays(isNaN(days) || days < 1 ? 1 : days);
  };

  return (
    <div id="billing-summary" className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-slate-800 border-b pb-4 mb-4">Ringkasan Tagihan</h3>
      
      <div className="mb-6 no-print">
        <label htmlFor="rental-days" className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-slate-500" />
          Durasi Sewa (hari)
        </label>
        <input
          type="number"
          id="rental-days"
          min="1"
          value={rentalDays}
          onChange={handleDaysChange}
          className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
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
                <p className="text-sm text-slate-500">{formatCurrency(item.pricePerDay)} x {rentalDays} hari</p>
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
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium">Subtotal</span>
            <span className="font-bold text-slate-800">{formatCurrency(totalCost)}</span>
          </div>
          <div className="mt-4 flex justify-between items-center text-xl">
            <span className="font-bold text-slate-800">Total</span>
            <span className="font-extrabold text-emerald-600">{formatCurrency(totalCost)}</span>
          </div>
          <div className="mt-6 no-print">
            <button 
              onClick={onPrint}
              className="w-full bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center justify-center space-x-2"
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