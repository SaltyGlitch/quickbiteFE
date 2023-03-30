import { useEffect, useState } from 'react'
import { type RestaurantModel } from '../../types/Types'
import SearchBar from '../../components/SearchBar/SearchBar'
import RestaurantGallery from '../../components/RestaurantGallery/RestaurantGallery'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import FooterComponent from '../../components/FooterComponent/FooterComponent'
import './HomePage.css'
function HomePage () {
  // const [restaurant, setRestaurant] = useState<RestaurantModel[]>([]);
  // const fetchRestaurant = async () => {
  //   const result = await fetch("http://localhost:5242/api/Restaurants");
  //   const data = await result.json();
  //   setRestaurant(data);
  //   console.log(data);
  // };
  // useEffect(() => {
  //   fetchRestaurant();
  // }, []);
  const [restaurant, setRestaurant] = useState<RestaurantModel[]>([])
  const fetchRestaurant = async () => {
    const result = await fetch('http://localhost:5242/api/Restaurants')
    const data = await result.json()
    setRestaurant(data)
    console.log(data)
  }
  useEffect(() => {
    fetchRestaurant()
  }, [])
  const filterCard = (value: any) => {
    if (value == '') fetchRestaurant()
    setRestaurant((previousState) =>
      previousState.filter((restaurant) =>
        restaurant.dishes.some((dish) =>
          dish.name.toLowerCase().includes(value.toLowerCase())
        )
      )
    )
  }
  return (
    <main className="home-main">
      <HeaderComponent />
      {/* <SearchBar /> */}
      <div className="home-search-container">
        <input
          className="home-input"
          type="text"
          placeholder="Search"
          onChange={(e: any) => { filterCard(e.target.value) }}
        />
        <button className="home-button">
          Search
          {/* <img className="searchbar-img" src="./assets/search.png" alt="search" /> */}
        </button>
      </div>
      <h1 className="home-h1">Categories</h1>
      <div className="container">
      <section className="home-section">
        <img className="home-img" src="./assets/pizza.png" alt="pizza" />
        <p>Pizza</p>
        </section>
      <section className="home-section">
        <img className="home-img" src="./assets/burger.png" alt="burger" />
        <p>Buruger</p>
        </section>
      <section className="home-section">
        <img className="home-img" src="./assets/chinese.png" alt="chinese" />
        <p>Chinese</p>
        </section>
      <section className="home-section">
        <img className="home-img" src="./assets/pasta.png" alt="pasta" />
        <p>Pasta</p>
        </section>
      </div>
      <h1 className="home-h1">Restaurants</h1>
      <RestaurantGallery restaurant={restaurant} />
      <FooterComponent />
    </main>
  )
}
export default HomePage
