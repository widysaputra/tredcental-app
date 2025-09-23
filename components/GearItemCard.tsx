
import React from 'react';
import { Gear } from '../types';
import { PlusIcon } from './Icons';

interface GearItemCardProps {
  gear: Gear;
  onAddItem: (gear: Gear) => void;
}

const GearItemCard: React.FC<GearItemCardProps> = ({ gear, onAddItem }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
      <img className="h-48 w-full object-cover" src={gear.imageUrl} alt={gear.name} />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="uppercase tracking-wide text-xs text-emerald-600 font-semibold">{gear.category}</div>
          <p className="block mt-1 text-lg leading-tight font-bold text-slate-800">{gear.name}</p>
          <p className="mt-2 text-slate-600 font-semibold">
            {formatCurrency(gear.pricePerDay)} <span className="font-normal text-sm">/ hari</span>
          </p>
        </div>
        <button
          onClick={() => onAddItem(gear)}
          className="mt-4 w-full bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Tambah</span>
        </button>
      </div>
    </div>
  );
};

export default GearItemCard;
