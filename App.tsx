import React, { useState, useMemo } from 'react';
import { RentedItem, Gear } from './types';
import { AVAILABLE_GEAR } from './constants';
import Header from './components/Header';
import BillingSummary from './components/BillingSummary';
import AddItemForm from './components/AddItemForm';
import PrintPreviewModal from './components/PrintPreviewModal';

const App: React.FC = () => {
  const [rentedItems, setRentedItems] = useState<RentedItem[]>([]);
  const [rentalDays, setRentalDays] = useState<number>(1);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const handleAddItem = (gearToAdd: Gear) => {
    setRentedItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === gearToAdd.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === gearToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...gearToAdd, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
    } else {
      setRentedItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (itemId: number) => {
    setRentedItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const totalCost = useMemo(() => {
    const days = Math.max(1, rentalDays);
    return rentedItems.reduce((total, item) => total + item.pricePerDay * item.quantity * days, 0);
  }, [rentedItems, rentalDays]);
  
  const handleOpenPreview = () => {
    if (rentedItems.length > 0) {
      setIsPreviewing(true);
    }
  };
  
  const handleClosePreview = () => {
    setIsPreviewing(false);
  };

  const availableGearOptions = useMemo(() => {
    return AVAILABLE_GEAR;
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      <main className="container mx-auto p-4 lg:p-8 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <AddItemForm 
            gearList={availableGearOptions}
            onAddItem={handleAddItem}
          />
          <div className="mt-8">
            <BillingSummary
              rentedItems={rentedItems}
              rentalDays={rentalDays}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onSetRentalDays={setRentalDays}
              totalCost={totalCost}
              onPrint={handleOpenPreview}
            />
          </div>
        </div>
      </main>
      {isPreviewing && (
        <PrintPreviewModal 
          rentedItems={rentedItems}
          rentalDays={rentalDays}
          totalCost={totalCost}
          onClose={handleClosePreview}
        />
      )}
    </div>
  );
};

export default App;