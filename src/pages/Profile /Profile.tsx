/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorResponse, User, Order, RestaurantModel } from "../../types/Types";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import "./Profile.css";
function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [restaurants, setRestaurants] = useState<
    Record<number, RestaurantModel>
  >({});
  const navigate = useNavigate();
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
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setError((error as ErrorResponse)?.message ?? "Unknown error");
        setLoading(false);
      });
  }, [navigate]);
  const fetchOrders = async () => {
    const response = await fetch(
      `http://localhost:5242/api/Orders?userId=${user?.id}`
    );
    const data = await response.json();
    setOrders(data);
  };
  const fetchRestaurantById = async (id: number) => {
    if (!restaurants[id]) {
      const result = await fetch(`http://localhost:5242/api/Restaurants/${id}`);
      const data = await result.json();
      setRestaurants((prevRestaurants) => ({ ...prevRestaurants, [id]: data }));
    }
  };
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);
  useEffect(() => {
    orders.forEach((order) => {
      order.dishes.forEach((dish) => {
        const restaurantId = dish.restaurantId;
        if (!restaurants[restaurantId]) {
          fetchRestaurantById(restaurantId);
        }
      });
    });
  }, [orders]);
  const handleLogout = async () => {
    const response = await fetch("http://localhost:5242/Auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (response.ok) {
      navigate("/login");
    } else {
      setError("Failed to logout");
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!user) {
    return <div>User not found</div>;
  }
  return (
    <main className="profile-main">
      <HeaderComponent />
      <h1 className="profile-h1">User Profile</h1>
      <img
        className="profile-img"
        src="./assets/profile-logo.png"
        alt="profile"
      />
      <section className="profile-section">
        <p className="profile-p">Name: {user.firstName} </p>
        <p className="profile-p">Email: {user.email}</p>
        <p className="profile-p">Number: {user.phoneNumber}</p>
        <p className="profile-p">Address: {user.address}</p>
        <h2>Previous Orders:</h2>
        {orders.length === 0 ? (
          <p>You have no orders</p>
        ) : (
          <table align="center">
            <thead>
              <tr>
                <th>Order Id</th>
                <th>Total Price</th>
                <th>Restaurants</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.totalPrice} €</td>
                  <td>
                    {order.dishes.map((dish, index) => {
                      if (
                        index === 0 ||
                        dish.restaurantId !==
                          order.dishes[index - 1].restaurantId
                      ) {
                        return (
                          <span key={dish.id}>
                            {restaurants[dish.restaurantId]?.name}
                          </span>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button className="profile-button" onClick={handleLogout}>
          Logout
        </button>
      </section>
      <FooterComponent />
    </main>
  );
}
export default Profile;
