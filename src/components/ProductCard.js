import "../styles/productCard.scss";
import { IMAGE_URL } from "../constants";
import { MdAddShoppingCart } from "react-icons/md";

const ProductCard = ({ product, action }) => {
  return (
    <div className="productCard" onClick={action}>
      <img src={`${IMAGE_URL + product.imagePath}`} alt={product.name} />
      <div>
        <div className="productInfo">
          <h3>{product.name}</h3>
          <h4>C${product.price}</h4>
        </div>
        <div className="fab">
          <div>
            <MdAddShoppingCart color="#ffe4e2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
