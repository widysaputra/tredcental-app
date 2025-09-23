import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Gear } from '../types';
import { PlusIcon, SearchIcon } from './Icons';

interface AddItemFormProps {
  gearList: Gear[];
  onAddItem: (gear: Gear) => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ gearList, onAddItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGear, setSelectedGear] = useState<Gear | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const filteredGear = useMemo(() => {
    if (!searchTerm) {
      return gearList;
    }
    return gearList.filter(gear =>
      gear.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, gearList]);

  // Effect to handle clicks outside of the combobox to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedGear(null); // When user types, clear the explicit selection
    setIsDropdownOpen(true);
  };

  const handleSelectGear = (gear: Gear) => {
    setSearchTerm(gear.name);
    setSelectedGear(gear);
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGear) return;
    onAddItem(selectedGear);
    setSearchTerm('');
    setSelectedGear(null);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg no-print">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-4 sm:space-y-0">
        <div className="flex-grow relative" ref={wrapperRef}>
          <label htmlFor="gear-search" className="block text-sm font-medium text-slate-700 mb-1">
            Cari & Pilih Barang
          </label>
          <div className="relative">
             <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-slate-400" />
            </span>
            <input
              id="gear-search"
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Ketik untuk mencari barang..."
              autoComplete="off"
              className="w-full p-2.5 pl-10 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredGear.length > 0 ? (
                <ul>
                  {filteredGear.map(gear => (
                    <li
                      key={gear.id}
                      onClick={() => handleSelectGear(gear)}
                      className="px-4 py-3 hover:bg-emerald-50 cursor-pointer text-slate-800"
                    >
                      {gear.name} 
                      <span className="block text-xs text-slate-500">{formatCurrency(gear.pricePerDay)}/hari</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-3 text-slate-500">Barang tidak ditemukan.</div>
              )}
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={!selectedGear}
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
