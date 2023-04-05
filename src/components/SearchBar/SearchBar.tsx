import { useEffect, useState } from "react";
import { RestaurantModel } from "../../types/Types";
import "./SearchBar.css";
function SearchBar() {
  const [restaurant, setRestaurant] = useState<RestaurantModel[]>([]);
  const fetchRestaurant = async () => {
    const result = await fetch("http://localhost:5242/api/Restaurants");
    const data = await result.json();
    setRestaurant(data);
    console.log(data);
  };
  useEffect(() => {
    fetchRestaurant();
  }, []);
  const filterCard = (value: any) => {
    if (value == "") fetchRestaurant();
    setRestaurant((previousState) =>
      previousState.filter((restaurant) =>
        restaurant.dishes.some((dish) => dish.name.includes(value))
      )
    );
  };
  return (
    <main className="searchbar-main">
      <input
        className="searchbar-input"
        type="text"
        placeholder="Search"
        onChange={(e: any) => filterCard(e.target.value)}
      />
      <button className="searchbar-button">Search</button>
    </main>
  );
}
export default SearchBar;
