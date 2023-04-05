export interface LoginDto {
  email: string;
  password: string;
}
export interface ErrorResponse {
  message: string;
}
export interface Dish {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  price: number;
  restaurantId: number;
  pictureUrl: string;
}
export interface RestaurantModel {
  id: number;
  name: string;
  description: string;
  location: string;
  phoneNumber: string;
  email: string;
  deliveryCost: number;
  mainPictureUrl: string;
  dishes: Dish[];
}
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
  cartId: number;
  cart: {
    id: number;
    cartDishes: any[];
    totalPrice: number;
  };
  orders: {
    id: number;
    dishes: any;
    address: string;
    userId: number;
    totalPrice: number;
  }[];
}
export interface CartModel {
  id: number;
  cartDishes: cartDish[];
  totalPrice: number;
}
export interface cartDish {
  id: number;
  dishId: number;
  quantity: number;
  restaurant: number;
}
export interface itemCardProps {
  dish: Dish;
}
export interface itemGalleryProps {
  dishes: Dish[];
}
export interface CartDishProps {
  cartDishes: cartDish;
  updateCart: (cartDish: cartDish) => void;
}
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
}
export interface Props {
  restaurant: RestaurantModel[];
}
export interface Order {
  id: number;
  dishes: Dish[];
  address: string;
  userId: number;
  totalPrice: number;
  restaurantName: string;
}
