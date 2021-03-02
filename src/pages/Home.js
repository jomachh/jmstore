import { useState, useEffect, useCallback, useMemo } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Section, Dimmer, Modal } from "../components";
import { API_URL, IMAGE_URL } from "../constants";
import { MdShoppingCart, MdDelete } from "react-icons/md";
import { delete_product } from "../redux/actions";

const Home = ({ cart, deleteProduct }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [show, setShow] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const getCategories = useCallback(async () => {
    try {
      const url = `${API_URL}inventory/categories`;
      const req = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const res = await req.json();
      if (res.error === 0) {
        setCategories(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getProducts = useCallback(async () => {
    try {
      const url = `${API_URL}inventory`;
      const req = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const res = await req.json();
      if (res.error === 0) {
        setProducts(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const actions = useMemo(
    () => [
      {
        name: "Cancelar",
        onClick: () => setShow(false),
        negative: true,
      },
      {
        name: "Continuar",
        onClick: () => {
          setShow(false);
          setRedirect(true);
        },
        positive: true,
      },
    ],
    []
  );

  useEffect(() => {
    Promise.all([getCategories(), getProducts()]);
  }, [getCategories, getProducts]);

  useEffect(() => {
    if (cart.length === 0) {
      setShow(false);
    }
  }, [cart]);

  return (
    <>
      {redirect && <Redirect to="/checkout" exact />}
      {categories.length > 0 &&
        categories.map((category, index) => (
          <Section key={index} category={category} products={products} />
        ))}
      <Dimmer show={show}>
        {cart && cart.length > 0 && (
          <Modal title="Carrito de compra" actions={actions}>
            {cart.map((product, index) => (
              <div className="cart-item" key={index}>
                <img
                  src={`${IMAGE_URL + product.imagePath}`}
                  alt={product.name}
                />
                <div>
                  <h2>{product.name}</h2>
                  <h3>Cantidad: {product.qty}</h3>
                  <h3>Total: C${product.total}</h3>
                  <div
                    className="deleteFab"
                    onClick={() => deleteProduct(product)}
                  >
                    <div>
                      <MdDelete color="#ffe4e2" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Modal>
        )}
      </Dimmer>
      {cart && cart.length > 0 && (
        <div className="cartFab" onClick={() => setShow(true)}>
          <div>
            <MdShoppingCart color="#ffe4e2" />
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cartReducer.cart,
});

export default connect(mapStateToProps, {
  deleteProduct: delete_product,
})(Home);
