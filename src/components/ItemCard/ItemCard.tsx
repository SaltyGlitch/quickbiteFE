import { Link } from "react-router-dom";
import { User, itemCardProps } from "../../types/Types";
import { useEffect, useState } from "react";
import "./ItemCard.css";

const ItemCard: React.FC<itemCardProps> = ({ dish: Dish }) => {
  const [user, setUser] = useState<User | null>(null);
  const [counter, setCounter] = useState(1);

  const handleAddToCart = async (dishId: number, quantity: number) => {
    const response = await fetch(`http://localhost:5242/api/Carts?userId=${user?.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dishId, quantity }),
    });

    if (!response.ok) {
      console.error("Failed to add to cart");
    }
  };

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");

    fetch("http://localhost:5242/Auth/user", {
      method: "GET",
      headers: { Authorization: `Bearer ${jwt}` },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        return response.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  const increase = () => setCounter(counter + 1);
  const decrease = () => counter > 1 && setCounter(counter - 1);

  return (
    <main>
      <figure className="itemgallery-figure">
        <div className="itemgallery-info">
          <p className="itemgallery-p">{Dish.categoryId}</p>
          <p className="itemgallery-p">{Dish.name}</p>
          <p className="itemgallery-p">Price: <span className="itemgallery-dish-price">{Dish.price}</span></p>
          <div className="itemgallery-container">
            <div className="button-container">
              <button className="control-button" onClick={decrease}>-</button>
              <span className="counter-output">{counter}</span>
              <button className="control-button" onClick={increase}>+</button>
            </div>
            <Link to="/cart">
              <button className="itemgallery-button" onClick={() => handleAddToCart(Dish.id, counter)}>Add to Cart</button>
            </Link>
          </div>
        </div>
      </figure>
    </main>
  );
};

export default ItemCard;

