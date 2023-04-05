import { useEffect, useState } from "react";
import { RestaurantModel } from "../../types/Types";
import RestaurantGallery from "../../components/RestaurantGallery/RestaurantGallery";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import "./HomePage.css";
function HomePage() {
  const [restaurant, setRestaurant] = useState<RestaurantModel[]>([]);
  const [filteredRestaurant, setFilteredRestaurant] = useState<
    RestaurantModel[]
  >([]);
  const fetchRestaurant = async () => {
    const result = await fetch("https://quickbitebe.azurewebsites.net/api/Restaurants");
    const data = await result.json();
    setRestaurant(data);
    setFilteredRestaurant(data);
  };
  useEffect(() => {
    fetchRestaurant();
  }, []);
  const filterCard = (value: string) => {
    if (value === "") {
      setFilteredRestaurant(restaurant);
    } else {
      const filtered = restaurant.filter((r) =>
        r.dishes.some((dish) =>
          dish.name.toLowerCase().includes(value.toLowerCase())
        )
      );
      setFilteredRestaurant(filtered);
    }
  };
  const filterPizza = () => {
    const filtered = restaurant.filter((r) =>
      r.dishes.some((dish) => dish.name.toLowerCase().includes("pizza"))
    );
    setFilteredRestaurant(filtered);
  };
  const filterBurger = () => {
    const filtered = restaurant.filter((r) =>
      r.dishes.some((dish) => dish.name.toLowerCase().includes("burger"))
    );
    setFilteredRestaurant(filtered);
  };
  const filterCake = () => {
    const filtered = restaurant.filter((r) =>
      r.dishes.some((dish) => dish.name.toLowerCase().includes("cake"))
    );
    setFilteredRestaurant(filtered);
  };
  const filterSpaghetti = () => {
    const filtered = restaurant.filter((r) =>
      r.dishes.some((dish) => dish.name.toLowerCase().includes("spaghetti"))
    );
    setFilteredRestaurant(filtered);
  };
  return (
    <main className="home-main">
      <HeaderComponent />
      <div className="home-search-container">
        <input
          className="home-input"
          type="text"
          placeholder="Search"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            filterCard(e.target.value)
          }
        />
        <button className="home-button">Search</button>
      </div>
      <h1 className="home-h1">What would you like to eat?</h1>
      <div className="container">
        <section onClick={filterPizza} className="home-section">
          <img className="home-img" src="./assets/pizza-logo.png" alt="pizza" />
        </section>
        <section onClick={filterBurger} className="home-section">
          <img
            className="home-img"
            src="./assets/burger-logo.png"
            alt="burger"
          />
        </section>
        <section onClick={filterCake} className="home-section">
          <img className="home-img" src="./assets/cake-logo.png" alt="cake" />
        </section>
        <section onClick={filterSpaghetti} className="home-section">
          <img
            className="home-img"
            src="./assets/spaghetti-logo.png"
            alt="spaghetti"
          />
        </section>
      </div>
      <h1 className="home-h1">Restaurants</h1>
      <RestaurantGallery restaurant={filteredRestaurant} />
      <FooterComponent />
    </main>
  );
}
export default HomePage;
