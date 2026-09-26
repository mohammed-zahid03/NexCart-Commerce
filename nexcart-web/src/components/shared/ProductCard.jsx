import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import ProductViewModal from "./ProductViewModal";
import truncateText from "../../utils/truncateText";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/actions";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../store/actions";

const ProductCard = ({
  productId,
  productName,
  image,
  description,
  quantity,
  price,
  discount,
  specialPrice,
  about = false,
}) => {
  const [openProductViewModal, setOpenProductViewModal] = useState(false);
  const btnLoader = false;
  const [selectedViewProduct, setSelectedViewProduct] = useState("");
  const isAvailable = quantity && Number(quantity) > 0;
  const dispatch = useDispatch();

  const addToWishlistHandler = () => {
    console.log("Wishlist Clicked");
    dispatch(
      addToWishlist({
        productId,
        productName,
        image,
        description,
        quantity,
        price,
        discount,
        specialPrice,
      }),
    );

    toast.success("Added to Wishlist ❤️");
  };

  const handleProductView = (product) => {
    if (!about) {
      setSelectedViewProduct(product);
      setOpenProductViewModal(true);
    }
  };

  const addToCartHandler = (cartItems) => {
    dispatch(addToCart(cartItems, 1, toast));
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2 transition-all duration-300">
      {" "}
      <div
        onClick={() => {
          handleProductView({
            id: productId,
            productName,
            image,
            description,
            quantity,
            price,
            discount,
            specialPrice,
          });
        }}
        className="
relative
w-full
h-[300px]
overflow-hidden
bg-gradient-to-b
from-slate-50
to-white
"
      >
        {discount > 0 && (
          <div
            className="
      absolute
      top-4
      left-4
      bg-gradient-to-r
      from-red-500
      to-pink-500
      text-white
      text-xs
      font-bold
      px-3
      py-1
      rounded-full
      z-10
      shadow-lg
    "
          >
            {discount}% OFF
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            addToWishlistHandler();
          }}
          className="
absolute
top-4
right-4
bg-white
opacity-0
group-hover:opacity-100
backdrop-blur-md
p-3
rounded-full
shadow-lg
hover:scale-125
transition-all
duration-300
z-10
"
        >
          <FaHeart className="text-red-500" />
        </button>

        <div
          className="
  absolute
  bottom-4
  left-1/2
  translate-y-4
  -translate-x-1/2
  bg-white
  text-slate-800
  px-5
  py-2
  rounded-full
  font-medium
  shadow-lg
  opacity-0
  group-hover:opacity-100
  group-hover:translate-y-0
  transition-all
  duration-300
  z-10
  "
        >
          Quick View
        </div>

        <img
          className="
w-full
h-full
object-contain
p-4
cursor-pointer
transition-all
duration-500
group-hover:scale-110
"
          src={image}
          alt={productName}
        ></img>
      </div>
      <div className="p-4">
        <h2
          onClick={() => {
            handleProductView({
              id: productId,
              productName,
              image,
              description,
              quantity,
              price,
              discount,
              specialPrice,
            });
          }}
          className="
text-lg
font-bold
text-slate-900
mb-3
cursor-pointer
hover:text-purple-600
transition
"
        >
          {truncateText(productName, 50)}
        </h2>

        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>

          <span className="ml-2 text-sm text-slate-500">4.9 (124)</span>
        </div>

        <div className="mb-3">
          {isAvailable ? (
            <span className="inline-flex items-center bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
              ✓ In Stock
            </span>
          ) : (
            <span className="inline-flex items-center bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
              ✕ Out of Stock
            </span>
          )}
        </div>

        <div className="min-h-[60px]">
          <p className="text-gray-600 text-sm">
            {truncateText(description, 80)}
          </p>
        </div>

        {!about && (
          <div className="flex items-center justify-between">
            {specialPrice ? (
              <div className="flex flex-col">
                <span className="text-gray-400 line-through">
                  ${Number(price).toFixed(2)}
                </span>
                <span className="text-2xl font-extrabold text-slate-900">
                  ${Number(specialPrice).toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-2xl font-extrabold text-slate-900">
                ${Number(price).toFixed(2)}
              </span>
            )}

            <button
              disabled={!isAvailable || btnLoader}
              onClick={() =>
                addToCartHandler({
                  image,
                  productName,
                  description,
                  specialPrice,
                  price,
                  productId,
                  quantity,
                })
              }
              className={`
bg-gradient-to-r
from-purple-600
to-purple-500
hover:from-purple-700
hover:to-purple-600
text-white
font-semibold
py-3
px-4
rounded-xl
transition-all
duration-300
w-full mt-4
flex
justify-center
items-center
shadow-lg
`}
            >
              <FaShoppingCart className="mr-2" />
              {isAvailable ? "Add to Cart" : "Stock Out"}
            </button>
          </div>
        )}
      </div>
      <ProductViewModal
        open={openProductViewModal}
        setOpen={setOpenProductViewModal}
        product={selectedViewProduct}
        isAvailable={isAvailable}
      />
    </div>
  );
};

export default ProductCard;
