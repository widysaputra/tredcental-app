import React, { useState, useMemo } from 'react';
import { RentedItem, Gear } from './types';
import { AVAILABLE_GEAR } from './constants';
import Header from './components/Header';
import BillingSummary from './components/BillingSummary';
import AddItemForm from './components/AddItemForm';
import PrintPreviewModal from './components/PrintPreviewModal';

const App: React.FC = () => {
  const [rentedItems, setRentedItems] = useState<RentedItem[]>([]);
  const [isPreviewing, setIsPreviewing] = useState(false);

  // New state for detailed receipt
  const [customerName, setCustomerName] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]);
  const [discount, setDiscount] = useState(0); // Percentage

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

  const rentalDays = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return 1;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [startDate, endDate]);

  const subtotal = useMemo(() => {
    return rentedItems.reduce((total, item) => total + item.pricePerDay * item.quantity * rentalDays, 0);
  }, [rentedItems, rentalDays]);

  const discountAmount = useMemo(() => {
    return subtotal * (discount / 100);
  }, [subtotal, discount]);

  const totalCost = useMemo(() => {
    return subtotal - discountAmount;
  }, [subtotal, discountAmount]);
  
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
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              totalCost={totalCost}
              onPrint={handleOpenPreview}
              // Pass new state and handlers
              customerName={customerName}
              setCustomerName={setCustomerName}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              discount={discount}
              setDiscount={setDiscount}
              subtotal={subtotal}
              discountAmount={discountAmount}
            />
          </div>
        </div>
      </main>
      {isPreviewing && (
        <PrintPreviewModal 
          rentedItems={rentedItems}
          rentalDays={rentalDays}
          totalCost={totalCost}
          subtotal={subtotal}
          discount={discount}
          discountAmount={discountAmount}
          customerName={customerName}
          startDate={startDate}
          endDate={endDate}
          onClose={handleClosePreview}
        />
      )}
    </div>
  );
};

export default App;