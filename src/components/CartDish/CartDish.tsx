import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CartDishProps, Dish, User } from "../../types/Types";
import "./CartDish.css";
const CartDish: React.FC<CartDishProps> = ({ cartDishes, updateCart }) => {
  const [user, setUser] = useState<User | null>(null);
  const [counter, setCounter] = useState(cartDishes.quantity);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const increase = () => {
    setCounter((count) => count + 1);
  };
  const decrease = () => {
    if (counter > 0) {
      setCounter((count) => count - 1);
    }
  };
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    fetch("https://quickbitebe.azurewebsites.net/Auth/user", {
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
  let { id } = useParams();
  const [dishesById, setDishesById] = useState<Dish>();
  const fetchDishesById = useCallback(
    async (id: any) => {
      const result = await fetch(
        `https://quickbitebe.azurewebsites.net/api/Dishes/${cartDishes.dishId}`
      );
      const data = await result.json();
      setDishesById(data);
    },
    [cartDishes.dishId]
  );
  useEffect(() => {
    fetchDishesById(id);
  }, [id, fetchDishesById]);
  const handlePatchCart = async () => {
    const response = await fetch(`https://quickbitebe.azurewebsites.net/api/Carts/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user?.id,
        dishId: dishesById?.id,
        quantity: counter,
      }),
    });
    if (response.ok) {
      updateCart({ ...cartDishes, quantity: counter });
      const result = await fetch(
        `https://quickbitebe.azurewebsites.net/api/Carts/${user?.cartId}`
      );
      const data = await result.json();
      setTotalPrice(data.totalPrice);
      console.log(data);
      console.error("Failed to patch cart");
      console.log(totalPrice);
    }
  };
  return (
    <main>
      <p>{dishesById?.name}</p>
      {cartDishes.quantity > 0 ? (
        <div className="cart-container">
          <div className="cart-container-left">
            <p>
              Price: &nbsp;
              <span className="cartdish-span">{dishesById?.price}</span>
            </p>
            <p>Amount: &nbsp; {cartDishes.quantity}</p>
          </div>
          <div className="button-container">
            <div className="cart-container-right">
              <button className="control-button" onClick={decrease}>
                -
              </button>
              <span className="counter-output">{counter}</span>
              <button className="control-button" onClick={increase}>
                +
              </button>
              <br />
              <button className="cart-add-button" onClick={handlePatchCart}>
                Update
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
};
export default CartDish;
