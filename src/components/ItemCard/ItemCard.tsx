import { User, itemCardProps } from "../../types/Types";
import { useEffect, useState } from "react";
import "./ItemCard.css";
const ItemCard: React.FC<itemCardProps> = ({ dish: Dish }) => {
  const [user, setUser] = useState<User | null>(null);
  const handleAddToCart = async (dishId: number, quantity: number) => {
    const response = await fetch(
      `http://localhost:5242/api/Carts?userId=${user?.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dishId,
          quantity,
        }),
      }
    );
    if (response.ok) {
    } else {
      console.error("Failed to register");
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
        console.log(user?.cartId);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, [user?.cartId]);
  const [counter, setCounter] = useState(1);
  const increase = () => {
    setCounter((count) => count + 1);
  };
  const decrease = () => {
    if (counter > 1) {
      setCounter((count) => count - 1);
    }
  };
  return (
    <main>
      <figure className="itemgallery-figure">
        <div className="itemgallery-info">
          <img className="itemcard-img" src={Dish.pictureUrl} alt="dish" />
          <p className="itemgallery-p">{Dish.name}</p>
          <p className="itemgallery-p">
            Price: <span className="itemgallery-dish-price">{Dish.price} €</span>
          </p>
          <p className="itemgallery-p">{Dish.description}</p>
          <div className="itemgallery-container">
            <div className="button-container">
              <button className="control-button" onClick={decrease}>
                -
              </button>
              <span className="counter-output">{counter}</span>
              <button className="control-button" onClick={increase}>
                +
              </button>
            </div>
            <button
              className="itemgallery-button"
              onClick={() => {
                handleAddToCart(Dish.id, counter);
              }}
            >
              Add
            </button>
          </div>
        </div>
      </figure>
    </main>
  );
};
export default ItemCard;
