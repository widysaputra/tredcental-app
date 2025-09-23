import React, { useState } from 'react';
import { Gear } from '../types';
import { PlusIcon } from './Icons';

interface AddItemFormProps {
  gearList: Gear[];
  onAddItem: (gear: Gear) => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ gearList, onAddItem }) => {
  const [selectedGearId, setSelectedGearId] = useState<string>('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGearId) return;

    const gearToAdd = gearList.find(g => g.id === parseInt(selectedGearId, 10));
    if (gearToAdd) {
      onAddItem(gearToAdd);
    }
    setSelectedGearId(''); // Reset dropdown after adding
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg no-print">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-4 sm:space-y-0">
        <div className="flex-grow">
          <label htmlFor="gear-select" className="block text-sm font-medium text-slate-700 mb-1">
            Pilih Barang
          </label>
          <select
            id="gear-select"
            value={selectedGearId}
            onChange={(e) => setSelectedGearId(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="" disabled>-- Pilih peralatan camping --</option>
            {gearList.map(gear => (
              <option key={gear.id} value={gear.id}>
                {gear.name} ({formatCurrency(gear.pricePerDay)}/hari)
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={!selectedGearId}
          className="w-full sm:w-auto bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Tambah</span>
        </button>
      </form>
    </div>
  );
};

export default AddItemForm;
