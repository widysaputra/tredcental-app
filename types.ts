
export interface Gear {
  id: number;
  name: string;
  pricePerDay: number;
  imageUrl: string;
  category: string;
}

export interface RentedItem extends Gear {
  quantity: number;
}
