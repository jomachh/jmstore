import "../styles/section.scss";
import { IMAGE_URL } from "../constants";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { MdExposurePlus1, MdExposureNeg1 } from "react-icons/md";
import { ProductCard, Dimmer, Modal } from "../components";
import { add_product } from "../redux/actions";

const Section = ({ category, products, addToCart }) => {
  const [show, setShow] = useState(false);

  const [productInfo, setProductInfo] = useState(null);
  const [qty, setQty] = useState(0);

  const hideModal = () => setShow(false);
  const showModal = () => setShow(true);

  const selectProduct = (product) => {
    showModal();
    setProductInfo(product);
  };

  const addOne = () => setQty(qty + 1);

  const subsOne = () => setQty(qty - 1);

  useEffect(() => {
    if (productInfo) {
      if (qty > productInfo.stock) {
        setQty(productInfo.stock);
      } else if (qty < 0) {
        setQty(0);
      }
    }
  }, [qty, productInfo]);

  return (
    <div className="section">
      <div className="sectionHeader">
        <h3>{category.name}</h3>
        <Link to={`/products/${category.name}`}>Ver más</Link>
      </div>
      <div className="sectionBody">
        {products &&
          products.map((product, index) => {
            return (
              product.category === category.id && (
                <ProductCard
                  key={index}
                  product={product}
                  action={() => selectProduct(product)}
                />
              )
            );
          })}
        <div className="space">|</div>
        <Dimmer show={show}>
          {productInfo && (
            <Modal>
              <div className="product-selected">
                <img
                  className="modal-img"
                  src={`${IMAGE_URL + productInfo.imagePath}`}
                  alt={productInfo.name}
                />
                <div>
                  <div>
                    <h2>{productInfo.name}</h2>
                    <h3>Precio: C${productInfo.price}</h3>
                    <h5>Stock: {productInfo.stock} unidades</h5>
                    <div className="qty-container">
                      <div className="btn" onClick={subsOne}>
                        <MdExposureNeg1 />
                      </div>
                      <input
                        type="number"
                        min={0}
                        value={qty}
                        onChange={(e) => setQty(parseInt(e.target.value))}
                      />
                      <div className="btn" onClick={addOne}>
                        <MdExposurePlus1 />
                      </div>
                    </div>
                  </div>
                  <div className="actions">
                    <button className="cancel-btn" onClick={hideModal}>
                      Cancelar
                    </button>
                    <button
                      className="confirm-btn"
                      onClick={() => {
                        addToCart({
                          id: productInfo.id,
                          name: productInfo.name,
                          qty,
                          total: productInfo.price * qty,
                          imagePath: productInfo.imagePath,
                        });
                        setShow(false);
                        setQty(0);
                      }}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </Modal>
          )}
        </Dimmer>
      </div>
    </div>
  );
};

export default connect(null, { addToCart: add_product })(Section);
