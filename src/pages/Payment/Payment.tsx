import { useEffect, useState } from "react";
import { CartModel, PaymentIntent, User } from "../../types/Types";
import { useParams,useNavigate } from "react-router-dom";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import "./Payment.css";
const Payment = () => {
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(
    null
  );
  const [amount, setAmount] = useState<number>();
  const [cardNumber, setCardNumber] = useState<string>("");
  const [expiryMonth, setExpiryMonth] = useState<number>();
  const [expiryYear, setExpiryYear] = useState<number>();
  const [cvc, setCvc] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [cartById, setCartById] = useState<CartModel>();
  const navigate = useNavigate();

  
  const fetchCartId = async (id: any) => {
    if (user?.cartId) {
      const result = await fetch(
        `http://localhost:5242/api/Carts/${user.cartId}`
      );
      const data = await result.json();
      setCartById(data);
      console.log(data);
      console.log(cartById);
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
  }, []);
  useEffect(() => {
    fetchCartId(idCart);
  }, [user?.cartId]);

  useEffect(() => {
    if (!cartById) {
      return;
    }
    const total = cartById.totalPrice * 100;
    if (isNaN(total)) {
      console.error(`Invalid total: ${total}`);
      return;
    }
    setAmount(total);
  }, [cartById]); 
  
  let { idCart } = useParams();
  const postOrder = async () => {
    const response = await fetch(`http://localhost:5242/api/Orders/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user?.id }),
    });
    if (response.ok) {
      console.log("post order success");
    }
  };
  const createPayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5242/Payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          currency: "eur",
        }),
      });
      if (response.status === 200) {
        const data = await response.json();
        setPaymentIntent(data);
        console.log(paymentIntent?.id);
      }
    } catch {
      console.log("error");
    }
  };
  useEffect(() => {
    if (paymentIntent) {
      completePayment();
    }
  }, [paymentIntent]);
  const completePayment = async () => {
    if (!paymentIntent) {
      console.error("Payment intent is null or undefined");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:5242/Payment/paymentmethod",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            CardNumber: cardNumber,
            ExpiryMonth: expiryMonth,
            ExpiryYear: expiryYear,
            Cvc: cvc,
          }),
        }
      );
      if (response.status === 200) {
        try {
          setLoading(true);
          const response = await fetch("http://localhost:5242/Payment/complete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ PaymentIntentId: paymentIntent.id }),
          });
          if (response.status === 200) {
            const data = await response.text();
            console.log(data);
            setLoading(false);
            setSuccess(true);
            postOrder();
            setTimeout(() => {
              navigate("/profile"); // Navigate to the Profile Page after a 2-second delay
            }, 2000);
          } else {
            console.error("Error completing payment:", response.statusText);
            setLoading(false);
          }
        } catch (error) {
          console.error("Error completing payment:", error);
          setLoading(false);
        }
      } else {
        console.error("Error creating payment method:", response.statusText);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error creating payment method:", error);
      setLoading(false);
    }
  };
  return (
    <main className="payment-main">
      <HeaderComponent />
      <section className="payment-section">
      <h1 className="payment-h1">Payment Page</h1>
      <form onSubmit={createPayment}>
        <div className="payment-section">
          <label className="payment-label">
            Amount: <span>{cartById?.totalPrice} euros</span>
          </label>
          <br />
          <label className="payment-label">
            Card Number:
            <input
              className="payment-input"
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </label>
          <br />
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <div style={{ flexGrow: 1, marginRight: "10px" }}>
              <label className="payment-label">
                Expiry Month:
                <input
                  className="payment-input"
                  type="number"
                  value={expiryMonth}
                  onChange={(e) => setExpiryMonth(parseInt(e.target.value))}
                />
              </label>
            </div>
            <div style={{ flexGrow: 1 }}>
              <label className="payment-label">
                Expiry Year:
                <input
                  className="payment-input"
                  type="number"
                  value={expiryYear}
                  onChange={(e) => setExpiryYear(parseInt(e.target.value))}
                />
              </label>
            </div>
          </div>
          <label className="payment-label">
            CVC:
            <input
              className="payment-input"
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
            />
          </label>
          <br />
          <button className="payment-button" type="submit">
            Pay
          </button>
        </div>
      </form>
      {loading && (
        <div>
          <p>Processing payment...</p>
        </div>
      )}
         {success && (
        <div>
          <p>Payment success.</p>
        </div>
      )}
      </section>
      <FooterComponent />
    </main>
  );
};
export default Payment;
