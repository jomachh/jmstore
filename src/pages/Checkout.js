import { useState, useCallback, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { API_URL, IMAGE_URL } from "../constants";
import { Dimmer, Modal } from "../components";
import { delete_product, clean_cart } from "../redux/actions";
import { MdDelete } from "react-icons/md";
import { Redirect } from "react-router-dom";
import "../styles/checkout.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const Checkout = ({ cart, user, deleteProduct, cleanCart }) => {
  const [cards, setCards] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [cardSelected, setCardSelected] = useState(null);
  const [addressSelected, setAddressSelected] = useState(null);
  const [show, setShow] = useState(false);
  const [isCard, setIsCard] = useState(false);
  const [total, setTotal] = useState(0);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardMonth, setCardMonth] = useState("");
  const [cardYear, setCardYear] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [dropDate, setDropDate] = useState("");
  const [redirect, setRedirect] = useState("");

  const getUserCards = useCallback(async () => {
    try {
      if (user) {
        const url = `${API_URL}user/cards/${user.id}`;
        const req = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        const res = await req.json();

        if (res.error === 0) {
          setCards(res.cards);
        } else {
          console.log(res.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  const getUserAddresses = useCallback(async () => {
    try {
      if (user) {
        const url = `${API_URL}user/addresses/${user.id}`;
        const req = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        const res = await req.json();

        if (res.error === 0) {
          setAddresses(res.addresses);
        } else {
          console.log(res.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  const addCard = useCallback(async () => {
    try {
      const url = `${API_URL}user/cards/new`;
      const body = JSON.stringify({
        lastFour: cardNumber.slice(cardNumber.length - 4),
        user: user ? user.id : null,
      });
      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body,
      });
      const res = await req.json();

      if (res.error === 0) {
        setCards((cards) => cards.concat([res.card]));
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  }, [cardNumber, user]);

  const addAddress = useCallback(async () => {
    try {
      const url = `${API_URL}user/addresses/new`;
      const body = JSON.stringify({
        line1,
        line2,
        city,
        user: user ? user.id : null,
      });
      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body,
      });
      const res = await req.json();

      if (res.error === 0) {
        setAddresses((addresses) => addresses.concat([res.address]));
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  }, [city, line1, line2, user]);

  const pay = useCallback(async () => {
    try {
      const url = `${API_URL}payment/new`;
      const body = JSON.stringify({
        total,
        card: cardSelected,
        address: addressSelected,
        user: user ? user.id : null,
        products: cart,
      });

      console.log(JSON.parse(body));

      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body,
      });
      const res = await req.json();

      if (res.error === 0) {
        console.log("Crack");
        MySwal.fire({
          title: `Felicidades, próximamente estarás recibiendo tu compra #${res.purchase}.`,
          icon: "success",
          showConfirmButton: true,
          confirmButtonText: "Continuar",
        }).then((result) => {
          if (result.isConfirmed) {
            cleanCart();
            setRedirect(true);
          }
        });
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  }, [addressSelected, cardSelected, cart, cleanCart, total, user]);

  const cardLayout = useMemo(
    () => (
      <div className="payment-modal">
        <label>Nombre en la tarjeta</label>
        <input value={cardName} onChange={(e) => setCardName(e.target.value)} />
        <label>Número</label>
        <input
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
        <div className="payment-modal-small">
          <div className="payment-modal-small-one">
            <label>Vencimiento</label>
            <div className="small-container">
              <input
                value={cardMonth}
                onChange={(e) => setCardMonth(e.target.value)}
                className="small-input"
                placeholder="MM"
              />
              <input
                value={cardYear}
                onChange={(e) => setCardYear(e.target.value)}
                className="small-input"
                placeholder="YY"
              />
            </div>
          </div>
          <div className="payment-modal-small-two">
            <label>CVV</label>
            <div className="small-container">
              <input
                value={cardCVV}
                onChange={(e) => setCardCVV(e.target.value)}
                className="small-input"
              />
            </div>
          </div>
        </div>
      </div>
    ),
    [cardCVV, cardMonth, cardName, cardNumber, cardYear]
  );

  const addressLayout = useMemo(
    () => (
      <div className="payment-modal">
        <label>Linea 1</label>
        <input value={line1} onChange={(e) => setLine1(e.target.value)} />
        <label>Linea 2</label>
        <input value={line2} onChange={(e) => setLine2(e.target.value)} />
        <label>Ciudad</label>
        <input value={city} onChange={(e) => setCity(e.target.value)} />
      </div>
    ),
    [city, line1, line2]
  );

  const actions = useMemo(
    () => [
      {
        name: "Cancelar",
        onClick: () => {
          if (isCard) {
            setShow(false);
            setCardNumber("");
            setCardName("");
            setCardMonth("");
            setCardYear("");
            setCardCVV("");
          } else {
            setShow(false);
            setLine1("");
            setLine2("");
            setCity("");
          }
        },
        negative: true,
      },
      {
        name: "Agregar",
        onClick: () => {
          if (isCard) {
            addCard().finally(() => {
              setShow(false);
              setCardNumber("");
              setCardName("");
              setCardMonth("");
              setCardYear("");
              setCardCVV("");
            });
          } else {
            addAddress().finally(() => {
              setShow(false);
              setLine1("");
              setLine2("");
              setCity("");
            });
          }
        },
        positive: true,
      },
    ],
    [addAddress, addCard, isCard]
  );

  useEffect(() => {
    if (user) {
      getUserCards();
      getUserAddresses();
    }
  }, [getUserAddresses, getUserCards, user]);

  useEffect(() => {
    if (cart.length > 0) {
      setTotal(0);
      cart.forEach((product) => {
        setTotal((total) => total + product.total);
      });
    }
  }, [cart]);

  useEffect(() => {
    if (cardSelected === -1) {
      setShow(true);
      setIsCard(true);
    }
  }, [cardSelected]);

  useEffect(() => {
    if (addressSelected === -1) {
      setShow(true);
      setIsCard(false);
    }
  }, [addressSelected]);

  return (
    <div className="checkout-container">
      {redirect && <Redirect to="/" exact />}
      <label className="checkout-title">Carrito de compras</label>
      <div className="checkout-body">
        <div className="checkout-list">
          {cart &&
            cart.length > 0 &&
            cart.map((product, index) => (
              <div key={index} className="checkout-item">
                <img
                  src={`${IMAGE_URL + product.imagePath}`}
                  alt={product.name}
                />
                <div>
                  <h2>{product.name}</h2>
                  <h3>Cantidad: {product.qty}</h3>
                  <h3>Total: C${product.total}</h3>
                  <div
                    className="deleteFabCheckout"
                    onClick={() => deleteProduct(product)}
                  >
                    <div>
                      <MdDelete color="#ffe4e2" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="payment">
          {cards.length > 0 ? (
            <>
              <h3 className="subtitle-payment">Selecciona la tarjeta</h3>
              <select
                className="select-on-payment"
                onChange={(e) => setCardSelected(parseInt(e.target.value, 10))}
              >
                <option value={null}>- - -</option>
                {cards.map((card, index) => (
                  <option key={index} value={card.id}>
                    **** **** **** {card.lastFour}
                  </option>
                ))}
                <option value={-1}>Agregar nueva tarjeta</option>
              </select>
            </>
          ) : (
            <button
              className="btn"
              onClick={() => {
                setIsCard(true);
                setShow(true);
              }}
            >
              Agrega una tarjeta
            </button>
          )}
          {addresses.length > 0 ? (
            <>
              <h3 className="subtitle-payment">
                Selecciona la dirección de entrega
              </h3>
              <select
                onChange={(e) =>
                  setAddressSelected(parseInt(e.target.value, 10))
                }
                className="select-on-payment"
              >
                <option value={null}>- - -</option>
                {addresses.map((address, index) => (
                  <option key={index} value={address.id}>
                    {address.line1 + address.line2}
                  </option>
                ))}
                <option value={-1}>Agregar nueva dirección</option>
              </select>
            </>
          ) : (
            <button
              className="btn"
              onClick={() => {
                setIsCard(false);
                setShow(true);
              }}
            >
              Agrega una dirección
            </button>
          )}
          <h3 className="subtitle-payment">
            Selecciona la fecha y hora de entrega
          </h3>
          <input
            className="select-on-payment"
            value={dropDate}
            onChange={(e) => setDropDate(e.target.value)}
            type="datetime-local"
          />
          <h3 className="subtitle-payment">TOTAL: C${total}</h3>
          <button className="btn" onClick={() => pay()}>
            Pagar
          </button>
        </div>
      </div>
      <Dimmer show={show}>
        <Modal
          title={
            isCard
              ? "Ingresa los datos de tu tarjeta"
              : "Ingresa los datos de tu nueva dirección"
          }
          actions={actions}
        >
          {isCard ? cardLayout : addressLayout}
        </Modal>
      </Dimmer>
    </div>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cartReducer.cart,
  user: state.authReducer.user,
});

export default connect(mapStateToProps, {
  deleteProduct: delete_product,
  cleanCart: clean_cart,
})(Checkout);
