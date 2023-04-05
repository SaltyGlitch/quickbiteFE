import { Link } from "react-router-dom";
import { Props } from "../../types/Types";
import "./RestaurantGallery.css";
const RestaurantGallery: React.FC<Props> = ({ restaurant }) => {
  return (
    <main>
      {restaurant.map((restaurant) => (
        <Link to={`/${restaurant.id}`}>
          <figure className="restaurantgallery-figure">
            <div className="restaurantgallery-container">
              <img
                className="restaurantgallery-img"
                src={restaurant.mainPictureUrl}
                alt="restaurant"
              />
            </div>
            <div className="restaurantgallery-container">
              <p className="restaurantgallery-p"><span className="restaurantgallery-span">{restaurant.name}</span></p>
              <p className="restaurantgallery-p">{restaurant.location}</p>
            </div>
          </figure>
        </Link>
      ))}
    </main>
  );
};
export default RestaurantGallery;
