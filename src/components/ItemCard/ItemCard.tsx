import "./ItemCard.css";
import { Link } from "react-router-dom";
import { Dish } from "../../types/Types";
import { useEffect, useState } from "react";
import Counter from "../Counter/Counter";

interface itemCardProps {
  dish: Dish;
}
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phoneNumber: string;
  cartId: number;
}
const ItemCard : React.FC<itemCardProps> = ({dish: Dish}) => {
  const addToCart = (dishId: any, quantity: any) => {};
  const [dishId, setdishId] = useState("");
  const [quantity, setquantity] = useState("");
  const [cartId,setCartId] = useState();
  const [user, setUser] = useState<User | null>(null);
  const handleAddToCart = async (dishId : number, quantity : number) => {
    const response = await fetch(`http://localhost:5242/api/Carts?userId=${user?.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dishId,
        quantity,
      }),
    });
    if (response.ok) {
      
    } else {
      console.error("Failed to register");
    }
    addToCart(dishId, quantity);
  };

  //getUser


  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    // if (!jwt) {
    //   navigate('/login');
    //   return;
    // }

    fetch('http://localhost:5242/Auth/user', {
      method: 'GET',
      headers: { Authorization: `Bearer ${jwt}` },
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setUser(data);
        console.log(user?.cartId);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, []);


//Counter function
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
            <p className="itemgallery-p">{Dish.categoryId}</p>
            <p className="itemgallery-p">{Dish.name}</p>
            <p className="itemgallery-p">{Dish.description}</p>
            <p className="itemgallery-dish-price">{Dish.price}</p>
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
              <Link to="/cart">
                <button
                  className="itemgallery-button"
                  onClick = {()=>{handleAddToCart(Dish.id, counter)}}
                >
                  Add to Cart
                </button>
              </Link>
            </div>
          </div>
        </figure>
      
    </main>
  );
}
export default ItemCard;
