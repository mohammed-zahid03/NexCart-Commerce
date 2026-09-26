import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getImageUrl } from "../../utils/imageUrl";

import {
  Heart,
  ShoppingCart,
  Truck,
  ShieldCheck,
  ChevronRight,
  Minus,
  Plus,
  Maximize2,
  Share2,
  RotateCcw,
  MapPin,
  CheckCircle2,
  Activity,
  LocateFixed,
  BatteryMedium,
  Droplets,
  Moon,
  HeartPulse,
  Smartphone,
  Ruler,
  Tag,
  Boxes,
  Star,
  Check,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  fetchProducts,
  addToCart,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getProductReviews,
  getProductAverageRating,
  getProductReviewCount,
  createProductReview,
  updateProductReview,
  deleteProductReview,
} from "../../store/actions";

import ProductCard from "./cards/ProductCard";

const PRODUCT_CONTENT = {
  "Smartwatch X100": {
    category: "Smart Devices",
    eyebrow: "SMARTWATCH",
    tagline: "Your health, activity and day at a glance.",
    highlights: [
      "Heart-rate monitoring",
      "Built-in GPS",
      "Up to 10-day battery",
      "Sleep tracking",
      "5 ATM water resistance",
      "Android & iOS",
    ],
    specs: [
      ["Display", '1.9" AMOLED'],
      ["Battery", "Up to 10 days"],
      ["GPS", "Built-in"],
      ["Water resistance", "5 ATM"],
      ["Bluetooth", "5.3"],
      ["Compatibility", "Android / iOS"],
    ],
    rating: 4.7,
    ratings: 86,
    reviews: [
      [
        "Great battery life",
        "Rahul S.",
        "2 days ago",
        "The battery easily lasts through a full week for my normal usage. The display is bright and easy to read.",
      ],
      [
        "Good value for the price",
        "Aman K.",
        "1 week ago",
        "GPS works well and the watch feels comfortable. Setup with my phone was straightforward.",
      ],
    ],
  },

  "Wireless Earbuds Pro": {
    category: "Audio",
    eyebrow: "WIRELESS AUDIO",
    tagline: "Clear sound, reliable battery and everyday comfort.",
    highlights: [
      "Active noise cancellation",
      "Up to 32-hour battery",
      "Bluetooth 5.3",
      "IPX4 splash resistance",
      "Low-latency mode",
      "Touch controls",
    ],
    specs: [
      ["Driver", "12 mm dynamic"],
      ["Battery", "Up to 32 hours"],
      ["Noise cancellation", "Active ANC"],
      ["Bluetooth", "5.3"],
      ["Charging", "USB-C"],
      ["Water resistance", "IPX4"],
    ],
    rating: 4.6,
    ratings: 86,
    reviews: [
      [
        "Strong sound for the price",
        "Arjun M.",
        "3 days ago",
        "Bass is punchy without drowning out vocals. The fit is comfortable for long listening sessions.",
      ],
      [
        "ANC is genuinely useful",
        "Priya N.",
        "1 week ago",
        "I mainly use them during commutes and the noise cancellation makes a noticeable difference.",
      ],
    ],
  },

  "NexBook Pro 16": {
    category: "Computers",
    eyebrow: "LAPTOPS",
    tagline: "A capable 16-inch workspace for work, study and creation.",
    highlights: [
      '16" high-resolution display',
      "All-day battery design",
      "Fast SSD storage",
      "Performance-focused cooling",
      "Expandable connectivity",
      "Slim aluminum chassis",
    ],
    specs: [
      ["Display", '16" IPS'],
      ["Storage", "1 TB SSD"],
      ["Memory", "16 GB RAM"],
      ["Connectivity", "Wi-Fi 6 / Bluetooth 5.3"],
      ["Ports", "USB-C / USB-A / HDMI"],
      ["Chassis", "Aluminum"],
    ],
    rating: 4.8,
    ratings: 142,
    reviews: [
      [
        "Excellent everyday laptop",
        "Vikram P.",
        "4 days ago",
        "The 16-inch screen gives me plenty of room for work without making the laptop feel bulky.",
      ],
      [
        "Fast and quiet",
        "Sahil A.",
        "2 weeks ago",
        "Apps open quickly and the keyboard is comfortable for long work sessions.",
      ],
    ],
  },

  "LinkDock 7-in-1 USB-C Hub": {
    category: "Accessories",
    eyebrow: "CONNECTIVITY",
    tagline: "One compact dock for the ports your laptop is missing.",
    highlights: [
      "7 essential ports",
      "4K HDMI output",
      "100W power delivery",
      "USB-C host connection",
      "Plug-and-play setup",
      "Compact aluminum body",
    ],
    specs: [
      ["Ports", "7-in-1"],
      ["Video", "4K HDMI"],
      ["Power delivery", "Up to 100W"],
      ["USB", "USB 3.0"],
      ["Host", "USB-C"],
      ["Body", "Aluminum alloy"],
    ],
    rating: 4.5,
    ratings: 64,
    reviews: [
      [
        "Exactly what I needed",
        "Karthik R.",
        "5 days ago",
        "Small enough to keep in my laptop bag and it handles my monitor, drive and USB accessories without fuss.",
      ],
      [
        "Solid build",
        "Dev S.",
        "2 weeks ago",
        "The aluminum body feels sturdy and the ports are spaced well.",
      ],
    ],
  },

  'AeroView 27" Monitor': {
    category: "Computers",
    eyebrow: "MONITORS",
    tagline: "Sharp visuals for work, play and everything between.",
    highlights: [
      '27" IPS display',
      "High refresh rate",
      "Wide color coverage",
      "Slim-bezel design",
      "HDMI & DisplayPort",
      "Height-adjustable stand",
    ],
    specs: [
      ["Panel", "27-inch IPS"],
      ["Resolution", "2560 × 1440"],
      ["Refresh rate", "165 Hz"],
      ["Response time", "1 ms"],
      ["Ports", "HDMI / DisplayPort"],
      ["Stand", "Height adjustable"],
    ],
    rating: 4.7,
    ratings: 91,
    reviews: [
      [
        "Great work and gaming monitor",
        "Aditya V.",
        "3 days ago",
        "The resolution is a big step up for productivity and the high refresh rate makes everything feel smoother.",
      ],
      [
        "Clean design",
        "Rohan K.",
        "1 week ago",
        "Minimal bezels and a good stand. The panel looks sharp straight out of the box.",
      ],
    ],
  },

  "PulseSound Bluetooth Speaker": {
    category: "Audio",
    eyebrow: "PORTABLE AUDIO",
    tagline: "Room-filling sound in a speaker made to move.",
    highlights: [
      "360° room-filling sound",
      "Up to 18-hour battery",
      "IP67 water resistance",
      "Bluetooth 5.3",
      "Stereo pairing",
      "Portable design",
    ],
    specs: [
      ["Output", "30 W"],
      ["Battery", "Up to 18 hours"],
      ["Bluetooth", "5.3"],
      ["Water resistance", "IP67"],
      ["Charging", "USB-C"],
      ["Pairing", "Stereo mode"],
    ],
    rating: 4.6,
    ratings: 73,
    reviews: [
      [
        "Surprisingly loud",
        "Naveen P.",
        "4 days ago",
        "The speaker gets loud enough for a room and still sounds balanced at lower volume.",
      ],
      [
        "Good for travel",
        "Imran S.",
        "2 weeks ago",
        "Battery life is dependable and the build feels like it can handle outdoor use.",
      ],
    ],
  },

  "AeroTone ANC Headphones": {
    category: "Audio",
    eyebrow: "HEADPHONES",
    tagline: "Immersive sound without the noise around you.",
    highlights: [
      "Adaptive ANC",
      "Up to 45-hour battery",
      "Bluetooth 5.3",
      "Transparency mode",
      "Low-latency mode",
      "Comfort-fit earcups",
    ],
    specs: [
      ["Noise cancellation", "Adaptive ANC"],
      ["Battery", "Up to 45 hours"],
      ["Bluetooth", "5.3"],
      ["Charging", "USB-C fast charge"],
      ["Modes", "ANC / Transparency"],
      ["Microphones", "Dual-mic calls"],
    ],
    rating: 4.7,
    ratings: 118,
    reviews: [
      [
        "Very good noise cancellation",
        "Mohit R.",
        "3 days ago",
        "Good choice for flights and office use. The earcups are comfortable for long sessions.",
      ],
      [
        "Battery is excellent",
        "Faizan A.",
        "10 days ago",
        "I rarely have to think about charging them and the controls are easy to use.",
      ],
    ],
  },

  "NexPoint Wireless Mouse": {
    category: "Accessories",
    eyebrow: "DESKTOP ACCESSORIES",
    tagline: "Quiet, precise control for workdays and long sessions.",
    highlights: [
      "High-precision sensor",
      "Long battery life",
      "Silent-click switches",
      "2.4 GHz wireless",
      "Ergonomic shape",
      "Compact receiver",
    ],
    specs: [
      ["Sensor", "1600 DPI optical"],
      ["Connection", "2.4 GHz wireless"],
      ["Battery", "Up to 12 months"],
      ["Buttons", "6"],
      ["Polling", "125 Hz"],
      ["Compatibility", "Windows / macOS"],
    ],
    rating: 4.5,
    ratings: 57,
    reviews: [
      [
        "Quiet and comfortable",
        "Harish N.",
        "1 week ago",
        "Clicks are noticeably quieter and the shape feels comfortable for office work.",
      ],
      [
        "Simple and reliable",
        "Akash T.",
        "3 weeks ago",
        "No unnecessary setup. Plug in the receiver and it just works.",
      ],
    ],
  },

  "KeyForm Mechanical Keyboard": {
    category: "Accessories",
    eyebrow: "KEYBOARDS",
    tagline: "A precise mechanical keyboard built for long sessions.",
    highlights: [
      "Hot-swappable switches",
      "Per-key backlighting",
      "USB-C connection",
      "Compact 75% layout",
      "Doubleshot keycaps",
      "Detachable cable",
    ],
    specs: [
      ["Layout", "75%"],
      ["Switches", "Hot-swappable mechanical"],
      ["Connection", "USB-C wired"],
      ["Backlight", "Per-key LED"],
      ["Keycaps", "Doubleshot"],
      ["Frame", "Aluminum top plate"],
    ],
    rating: 4.6,
    ratings: 79,
    reviews: [
      [
        "Great typing feel",
        "Siddharth P.",
        "5 days ago",
        "The switches feel consistent and the compact layout leaves more room for the mouse.",
      ],
      [
        "Looks clean on the desk",
        "Yash M.",
        "2 weeks ago",
        "Good build quality and the backlighting is useful without being distracting.",
      ],
    ],
  },
};

const DEFAULT_CONTENT = {
  category: "Electronics",
  eyebrow: "ELECTRONICS",
  tagline: "Designed for everyday use, with the features that matter.",
  highlights: [
    "Quality-focused design",
    "Ready for everyday use",
    "Modern connectivity",
    "Practical design",
  ],
  specs: [
    ["Product", "See product details above"],
    ["Availability", "Current stock shown above"],
  ],
  rating: 4.5,
  ratings: 32,
  reviews: [
    [
      "Good everyday product",
      "Verified customer",
      "Recently",
      "A practical product with a clean design and the features I needed.",
    ],
  ],
};

const getContent = (name) =>
  PRODUCT_CONTENT[name] || DEFAULT_CONTENT;

const getCategoryName = (product) =>
  product?.category?.categoryName ||
  product?.category?.name ||
  getContent(product?.productName).category ||
  "Electronics";

  const videoFiles = {
  1: {
    view360: "smartwatch-360.mp4",
    productVideo: "smartwatch-video.mp4",
  },
  2: {
    view360: "earbuds-360.mp4",
    productVideo: "earbuds-video.mp4",
  },
  3: {
    view360: "laptop-360.mp4",
    productVideo: "laptop-video.mp4",
  },
  4: {
    view360: "usb-hub-360.mp4",
    productVideo: "usb-hub-video.mp4",
  },
  5: {
    view360: "monitor-360.mp4",
    productVideo: "monitor-video.mp4",
  },
  6: {
    view360: "speaker-360.mp4",
    productVideo: "speaker-video.mp4",
  },
  7: {
    view360: "headphones-360.mp4",
    productVideo: "headphones-video.mp4",
  },
  8: {
    view360: "mouse-360.mp4",
    productVideo: "mouse-video.mp4",
  },
  9: {
    view360: "keyboard-360.mp4",
    productVideo: "keyboard-video.mp4",
  },
};


const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeVideo, setActiveVideo] = useState(null);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);

  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

const [reviewModalOpen, setReviewModalOpen] = useState(false);
const [reviewRating, setReviewRating] = useState(0);
const [reviewText, setReviewText] = useState("");

const [editingReviewId, setEditingReviewId] = useState(null);

  const { products } = useSelector((state) => state.products);
  const cartItems = useSelector(
  (state) => state.carts?.cart || []
);
  const { user } = useSelector((state) => state.auth);

  const {
  reviews = [],
  averageRating = 0,
  reviewCount = 0,
} = useSelector((state) => state.reviews || {});

const { wishlist: wishlistItems = [] } = useSelector(
  (state) => state.wishlist || {}
);



useEffect(() => {
  const fetchProduct = async () => {
    try {
      setProductLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BACK_END_URL}/api/public/products/${id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      const data = await response.json();

      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      setProduct(null);
    } finally {
      setProductLoading(false);
    }
  };

  fetchProduct();

  if (user) {
    dispatch(getWishlist());
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, [id, dispatch, user]);


useEffect(() => {
  if (!product?.category?.categoryName) {
    setRelatedProducts([]);
    return;
  }

  const fetchRelatedProducts = async () => {
    try {
      const categoryName = product.category.categoryName;

      const response = await fetch(
        `${import.meta.env.VITE_BACK_END_URL}/api/public/products?category=${encodeURIComponent(
          categoryName
        )}&pageNumber=0&pageSize=5`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch related products");
      }

      const data = await response.json();

      const related = (data.content || [])
        .filter(
          (item) =>
            String(item.productId) !== String(product.productId)
        )
        .slice(0, 4);

      setRelatedProducts(related);
    } catch (error) {
      console.error("Error fetching related products:", error);
      setRelatedProducts([]);
    }
  };

  fetchRelatedProducts();
}, [product]);
 
 useEffect(() => {
  setSelectedImage(0);
  setQty(1);

  dispatch({ type: "RESET_REVIEWS" });

  dispatch(getProductReviews(id));
  dispatch(getProductAverageRating(id));
  dispatch(getProductReviewCount(id));
}, [dispatch, id]);


useEffect(() => {
  if (!imageViewerOpen) return;

  const handleKeyDown = (e) => {
    // Close viewer
    if (e.key === "Escape") {
      setImageViewerOpen(false);
      return;
    }

    // Find the currently opened product
   const currentProduct = product;

    if (!currentProduct) return;

    const images = [
      currentProduct.image,
      ...(Array.isArray(currentProduct.galleryImages)
        ? currentProduct.galleryImages
        : []),
    ].filter(Boolean);

    if (images.length <= 1) return;

    // Previous image
    if (e.key === "ArrowLeft") {
      e.preventDefault();

      setSelectedImage((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    }

    // Next image
    if (e.key === "ArrowRight") {
      e.preventDefault();

      setSelectedImage((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [imageViewerOpen, product, id]);



if (productLoading) {
  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <div className="mx-auto w-full max-w-[1480px] px-5 pb-20 sm:px-6 lg:px-8 xl:px-10">

        {/* Breadcrumb skeleton */}
        <div className="py-3 lg:py-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-12 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-2 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-2 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-40 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        {/* Product hero skeleton */}
        <section
          className="
            grid
            items-start
            gap-6
            lg:grid-cols-[64px_minmax(0,0.95fr)_minmax(0,1.05fr)]
            xl:grid-cols-[72px_minmax(560px,0.95fr)_minmax(620px,1.05fr)]
            xl:gap-9
          "
        >
          {/* Thumbnail skeletons */}
          <div className="order-2 flex gap-3 overflow-hidden lg:order-1 lg:flex-col">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-16 w-16 shrink-0 animate-pulse rounded-xl border border-gray-200 bg-gray-200"
              />
            ))}
          </div>

          {/* Main image skeleton */}
          <div className="order-1 min-w-0 lg:order-2">
            <div className="aspect-[4/3.5] w-full animate-pulse rounded-[20px] bg-gray-200" />

            {/* Gallery action skeletons */}
            <div className="mt-3 flex justify-center gap-3">
              <div className="h-10 w-28 animate-pulse rounded-full bg-gray-200" />
              <div className="h-10 w-32 animate-pulse rounded-full bg-gray-200" />
            </div>
          </div>

          {/* Purchase panel skeleton */}
          <div className="order-3 min-w-0 pt-0.5">

            {/* Category */}
            <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />

            {/* Product name */}
            <div className="mt-3 h-10 w-4/5 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-10 w-3/5 animate-pulse rounded bg-gray-200" />

            {/* Category + tagline */}
            <div className="mt-4 h-4 w-full animate-pulse rounded bg-gray-200" />

            {/* Rating */}
            <div className="mt-4 flex items-center gap-3">
              <div className="h-8 w-20 animate-pulse rounded-md bg-gray-200" />
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
            </div>

            {/* Price */}
            <div className="mt-5">
              <div className="h-9 w-36 animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-4 w-24 animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-3 w-32 animate-pulse rounded bg-gray-200" />
            </div>

            <div className="mt-5 border-t border-gray-200" />

            {/* Availability */}
            <div className="mt-4 flex items-center justify-between">
              <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            </div>

            {/* Delivery information */}
            <div className="mt-4 space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="h-5 w-5 animate-pulse rounded-full bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                    <div className="mt-1.5 h-3 w-48 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>

            {/* Location */}
            <div className="mt-4 border-y border-gray-200 py-3">
              <div className="flex items-center justify-between">
                <div className="h-8 w-36 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-4">
              <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
            </div>

            {/* Purchase buttons */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="h-[50px] animate-pulse rounded-lg bg-gray-200" />
              <div className="h-[50px] animate-pulse rounded-lg bg-gray-200" />
            </div>

            {/* Secondary actions */}
            <div className="mt-3 flex gap-3">
              <div className="h-10 flex-1 animate-pulse rounded bg-gray-200" />
              <div className="h-10 flex-1 animate-pulse rounded bg-gray-200" />
            </div>

          </div>
        </section>

        {/* Key features skeleton */}
        <section className="mt-8 border-y border-gray-200 bg-white py-5 sm:mt-10 sm:py-8 lg:mt-16">
          <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-7 w-48 animate-pulse rounded bg-gray-200" />

          <div className="mt-5 grid overflow-hidden rounded-xl border border-gray-200 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse border-b border-gray-100 bg-gray-50"
              />
            ))}
          </div>
        </section>

        {/* Product details skeleton */}
        <section className="border-b border-gray-200 py-8 lg:py-10">
          <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-7 w-48 animate-pulse rounded bg-gray-200" />
          <div className="mt-5 space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-11/12 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200" />
          </div>
        </section>

      </div>
    </main>
  );
}

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f7f8fa]">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Product not found
            </h1>

            <Link
              to="/products"
              className="mt-5 inline-flex rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const wishlist = wishlistItems.some(
  (item) =>
    String(item.productId) === String(product.productId)
);

 
  const content = getContent(product.productName);
const categoryName = getCategoryName(product);

const displayedReviews = reviews;

const totalRatings = reviewCount;

const formattedAverageRating = Number(averageRating || 0).toFixed(1);

// Use API data as the source of truth for product highlights
const productHighlights = Array.isArray(product.highlights)
  ? product.highlights.filter(Boolean)
  : [];

// Convert API specifications object into the array format
// already used by the existing UI.
const productSpecs =
  product.specifications &&
  typeof product.specifications === "object"
    ? Object.entries(product.specifications).filter(
        ([, value]) => value !== null && value !== undefined && value !== ""
      )
    : [];

  const currentPrice = product.specialPrice
    ? Number(product.specialPrice)
    : Number(product.price);

  const originalPrice = Number(product.price);

  const discount =
    product.discount > 0
      ? Number(product.discount)
      : originalPrice > currentPrice
        ? Math.round(
            ((originalPrice - currentPrice) / originalPrice) * 100
          )
        : 0;

  const savings = Math.max(
    0,
    originalPrice - currentPrice
  );

  const isAvailable = Number(product.quantity) > 0;

  const productImages = [
  product.image,
  ...(Array.isArray(product.galleryImages)
    ? product.galleryImages
    : []),
].filter(Boolean);

  const activeImage =
    productImages[selectedImage] ||
    productImages[0] ||
    product.image;


  const handleWishlist = () => {
  if (!user) {
    toast.error("Please login to use your wishlist");
    navigate("/login");
    return;
  }

  if (wishlist) {
    dispatch(
      removeFromWishlist(
        product.productId,
        toast
      )
    );
    return;
  }

  dispatch(
    addToWishlist(
      product.productId,
      toast
    )
  );
};

  const addToCartHandler = () => {
    if (!isAvailable) {
      toast.error("Product is out of stock");
      return;
    }

    dispatch(
      addToCart(
        {
          image: product.image,
          productName: product.productName,
          description: product.description,
          specialPrice: product.specialPrice,
          price: product.price,
          productId: product.productId,
          quantity: product.quantity,
        },
        qty,
        toast
      )
    );
  };

  const decreaseQuantity = () => {
    setQty((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQty((prev) =>
      Math.min(Number(product.quantity), prev + 1)
    );
  };

const handleBuyNow = () => {
  if (!isAvailable) {
    toast.error("Product is out of stock");
    return;
  }

  const existingProduct = cartItems.some(
    (item) =>
      String(item.productId) ===
      String(product.productId)
  );

  // If product is already in cart, don't call addToCart.
  // Just go directly to checkout.
  if (existingProduct) {
    navigate("/checkout");
    return;
  }

  // Product isn't in cart, so add it first.
  dispatch(
    addToCart(
      {
        image: product.image,
        productName: product.productName,
        description: product.description,
        specialPrice: product.specialPrice,
        price: product.price,
        productId: product.productId,
        quantity: product.quantity,
      },
      qty,
      toast
    )
  );

  // Go directly to checkout.
  navigate("/checkout");
};

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.productName,
          text: content.tagline,
          url: window.location.href,
        });

        return;
      }

      await navigator.clipboard.writeText(
        window.location.href
      );

      toast.success("Product link copied");
    } catch {
      toast.error("Unable to share this product");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <div className="mx-auto w-full max-w-[1480px] px-5 pb-20 sm:px-6 lg:px-8 xl:px-10">

        {/* =====================================================
            BREADCRUMB
        ====================================================== */}
        <div className="py-3 lg:py-4">
          <div className="flex items-center gap-2 text-[13px] text-gray-500">
            <Link
              to="/"
              className="transition hover:text-gray-950"
            >
              Home
            </Link>

            <ChevronRight
              size={14}
              className="text-gray-300"
            />

            <Link
              to="/products"
              className="transition hover:text-gray-950"
            >
              Products
            </Link>

            <ChevronRight
              size={14}
              className="text-gray-300"
            />

            <span className="max-w-[450px] truncate font-medium text-gray-900">
              {product.productName}
            </span>
          </div>
        </div>

        {/* =====================================================
            PRODUCT HERO
        ====================================================== */}
        <section
          className="
            grid
            items-start
            gap-6
            lg:grid-cols-[64px_minmax(0,0.95fr)_minmax(0,1.05fr)]
            xl:grid-cols-[72px_minmax(560px,0.95fr)_minmax(620px,1.05fr)]
            xl:gap-9
          "
        >

          {/* =================================================
              THUMBNAILS
          ================================================== */}
          <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">
            {productImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(index)}
                aria-label={`View product image ${index + 1}`}
                className={`
                  flex h-[64px] w-[64px] shrink-0
                  items-center justify-center
                  overflow-hidden rounded-xl
                  border bg-white p-1.5
                  transition-all duration-200
                  ${
                    selectedImage === index
                      ? "border-gray-950 shadow-[0_4px_14px_rgba(15,23,42,0.08)]"
                      : "border-gray-200 hover:border-gray-400"
                  }
                `}
              >
                <img
                  src={getImageUrl(image)}
                  alt={`${product.productName} ${index + 1}`}
                  className="h-full w-full object-contain"
                />
              </button>
            ))}
          </div>

          {/* =================================================
              MAIN IMAGE
          ================================================== */}
          <div className="order-1 min-w-0 lg:order-2">

            {/* IMPORTANT:
                No white outer card.
                No border.
                No inner padding around image.
            */}
            <div
              className="
                relative
                w-full
                overflow-hidden
                rounded-[20px]
                bg-[#f5f2ed]
              "
            >
              {discount > 0 && (
                <span
                  className="
                    absolute
                    left-5
                    top-5
                    z-10
                    rounded-md
                    bg-white
                    px-3
                    py-1.5
                    text-[11px]
                    font-bold
                    text-orange-600
                    shadow-[0_3px_12px_rgba(15,23,42,0.08)]
                  "
                >
                  {discount}% OFF
                </span>
              )}

             <button
  type="button"
  onClick={() => setImageViewerOpen(true)}
  aria-label="Expand product image"
  className="
    absolute
    right-5
    top-5
    z-10
    flex
    h-10
    w-10
    items-center
    justify-center
    rounded-full
    bg-white/95
    text-gray-700
    shadow-[0_3px_12px_rgba(15,23,42,0.08)]
    transition
    hover:bg-white
  "
>
  <Maximize2 size={17} />
</button>

              <img
                src={getImageUrl(activeImage)}
  alt={product.productName}
                className="
                  block
                  aspect-[4/3.5]
                  w-full
                  object-cover
                  transition-transform
                  duration-500
                  hover:scale-[1.015]
                "
              />
            </div>

         {/* Gallery actions */}
<div className="mt-3 flex justify-center gap-3">
  <button
  type="button"
  onClick={() => {
  const video = videoFiles[product.productId]?.view360;

  if (video) {
    setActiveVideo({
      title: `${product.productName} — 360° View`,
      src: `http://localhost:8080/videos/${video}`,
    });
  }
}}
  className="
    inline-flex
    h-10
    items-center
    gap-2
    rounded-full
    border
    border-gray-200
    bg-white
    px-5
    text-[12px]
    font-medium
    text-gray-700
    transition
    hover:border-gray-300
    hover:bg-gray-50
  "
>
  <Maximize2 size={14} />
  360° VIEW
</button>



 <button
  type="button"
  onClick={() => {
  const video = videoFiles[product.productId]?.productVideo;

  if (video) {
    setActiveVideo({
      title: `${product.productName} — Product Video`,
      src: `http://localhost:8080/videos/${video}`,
    });
  }
}}
  className="
    inline-flex
    h-10
    items-center
    gap-2
    rounded-full
    border
    border-gray-200
    bg-white
    px-5
    text-[12px]
    font-medium
    text-gray-700
    transition
    hover:border-gray-300
    hover:bg-gray-50
  "
>
  <span className="text-[10px]">▶</span>
  PLAY VIDEO
</button>
</div>
</div>

          {/* =====================================================
    RIGHT — PURCHASE PANEL
===================================================== */}
<div className="order-3 min-w-0 pt-0.5">
  
  {/* Category */}
  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">
    {content.eyebrow}
  </p>

  {/* Product name */}
 <h1
  className="
    mt-2
    text-[34px]
    font-semibold
    leading-[1.05]
    tracking-[-0.045em]
    text-gray-950
    sm:text-[38px]
    xl:text-[40px]
  "
>
  {product.productName}
</h1>

  {/* Category + tagline */}
  <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px]">
    <span className="font-medium text-gray-800">
      {categoryName}
    </span>

    <span className="text-gray-300">•</span>

    <span className="text-gray-500">
      {content.tagline}
    </span>
  </div>

  {/* Rating */}
  <div className="mt-3 flex flex-wrap items-center gap-3">

    <span
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-md
        bg-green-600
        px-2.5
        py-1.5
        text-[13px]
        font-semibold
        text-white
      "
    >
      {formattedAverageRating}
      <Star
  size={13}
  fill="currentColor"
  strokeWidth={1.5}
/>
    </span>

    <span className="text-[13px] font-medium text-gray-800">
  {totalRatings} ratings
</span>

    <span className="h-1 w-1 rounded-full bg-gray-300" />

    <span className="text-[13px] text-gray-500">
      Customer ratings
    </span>

  </div>

  {/* Price */}
  <div className="mt-3">

    <div className="flex flex-wrap items-baseline gap-3">

      <span
        className="
          text-[29px]
          font-semibold
          leading-none
          tracking-[-0.04em]
          text-gray-950
        "
      >
        ₹{currentPrice.toLocaleString("en-IN")}
      </span>

      {originalPrice > currentPrice && (
        <span className="text-[15px] text-gray-400 line-through">
          ₹{originalPrice.toLocaleString("en-IN")}
        </span>
      )}

      {discount > 0 && (
        <span
          className="
            rounded-full
            bg-green-50
            px-2.5
            py-1
            text-[11px]
            font-semibold
            text-green-600
          "
        >
          {discount}% OFF
        </span>
      )}

    </div>

    {originalPrice > currentPrice && (
      <p className="mt-1.5 text-[13px] font-semibold text-green-600">
        You save ₹{(originalPrice - currentPrice).toLocaleString("en-IN")}
      </p>
    )}

    <p className="mt-1 text-[12px] text-gray-400">
      Inclusive of all taxes
    </p>

  </div>

  {/* Divider */}
  <div className="mt-4 border-t border-gray-200" />

  {/* Availability */}
  <div className="mt-3 flex items-center justify-between">

    <div className="flex items-center gap-2">

      <span
        className={`h-2.5 w-2.5 rounded-full ${
          isAvailable
            ? "bg-green-500"
            : "bg-red-500"
        }`}
      />

      <span
        className={`text-[14px] font-semibold ${
          isAvailable
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {isAvailable ? "In Stock" : "Out of Stock"}
      </span>

      {isAvailable &&
        Number(product.quantity) <= 10 && (
          <>
            <span className="text-gray-300">•</span>

            <span className="text-[12px] font-medium text-orange-600">
              Only {product.quantity} left
            </span>
          </>
        )}

    </div>

    {isAvailable && (
      <span className="text-[12px] text-gray-400">
        {product.quantity} available
      </span>
    )}

  </div>

  {/* Delivery information */}
  <div className="mt-2 space-y-2">

    <div className="flex items-center gap-3">

      <Truck
        size={17}
        strokeWidth={1.7}
        className="shrink-0 text-gray-600"
      />

      <div>
        <p className="text-[13px] font-medium text-gray-900">
          Free delivery
        </p>

        <p className="text-[11px] text-gray-400">
          Estimated delivery: Tomorrow
        </p>
      </div>

    </div>

    <div className="flex items-center gap-3">

      <RotateCcw
        size={17}
        strokeWidth={1.7}
        className="shrink-0 text-gray-600"
      />

      <div>
        <p className="text-[13px] font-medium text-gray-900">
          30-day easy returns
        </p>

        <p className="text-[11px] text-gray-400">
          Return eligible items within 30 days
        </p>
      </div>

    </div>

    <div className="flex items-center gap-3">

      <ShieldCheck
        size={17}
        strokeWidth={1.7}
        className="shrink-0 text-gray-600"
      />

      <div>
        <p className="text-[13px] font-medium text-gray-900">
          2-year warranty
        </p>

        <p className="text-[11px] text-gray-400">
          Product protection included
        </p>
      </div>

    </div>

  </div>

  {/* Location */}
  <div
    className="
      mt-3
      border-y
      border-gray-200
      py-2.5
    "
  >

    <div className="flex items-center justify-between gap-4">

      <div className="flex min-w-0 items-center gap-2.5">

        <MapPin
          size={16}
          strokeWidth={1.7}
          className="shrink-0 text-gray-600"
        />

        <div className="min-w-0">

          <p className="text-[12px] text-gray-400">
            Deliver to
          </p>

          <p className="truncate text-[13px] font-medium text-gray-800">
            Your location
          </p>

        </div>

      </div>

      <button
        type="button"
        onClick={() =>
          toast(
            "Location selection can be connected to your address flow."
          )
        }
        className="
          shrink-0
          text-[12px]
          font-medium
          text-gray-800
          underline
          underline-offset-2
          transition
          hover:text-black
        "
      >
        Change
      </button>

    </div>

  </div>

  {/* Short description */}

  {/* Quantity + available */}
  <div className="mt-3">

    <div className="flex items-center justify-between">

      <p className="text-[13px] font-medium text-gray-900">
        Quantity
      </p>

      {isAvailable && (
        <span className="text-[11px] text-gray-400">
          {product.quantity} available
        </span>
      )}

    </div>

    <div className="mt-2 flex w-fit items-center overflow-hidden rounded-lg border border-gray-200">

      <button
        type="button"
        disabled={qty <= 1}
        onClick={decreaseQuantity}
        aria-label="Decrease quantity"
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          bg-white
          text-gray-700
          transition
          hover:bg-gray-50
          disabled:cursor-not-allowed
          disabled:text-gray-300
        "
      >
        <Minus size={14} />
      </button>

      <div
        className="
          flex
          h-10
          w-12
          items-center
          justify-center
          border-x
          border-gray-200
          bg-white
          text-[13px]
          font-medium
          text-gray-900
        "
      >
        {qty}
      </div>

      <button
        type="button"
        disabled={
          !isAvailable ||
          Number(product.quantity) <= qty
        }
        onClick={increaseQuantity}
        aria-label="Increase quantity"
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          bg-white
          text-gray-700
          transition
          hover:bg-gray-50
          disabled:cursor-not-allowed
          disabled:text-gray-300
        "
      >
        <Plus size={14} />
      </button>

    </div>

  </div>

  {/* Primary purchase actions */}
  <div className="mt-2 grid grid-cols-2 gap-3">

    <button
      type="button"
      disabled={!isAvailable}
      onClick={addToCartHandler}
      className="
        flex
        h-[50px]
        items-center
        justify-center
        gap-2
        rounded-lg
        bg-gray-950
        px-4
        text-[14px]
        font-semibold
        text-white
        transition
        hover:bg-gray-800
        active:scale-[0.99]
        disabled:cursor-not-allowed
        disabled:bg-gray-200
        disabled:text-gray-400
      "
    >
      <ShoppingCart
        size={18}
        strokeWidth={1.8}
      />

      {isAvailable
        ? "Add to Cart"
        : "Out of Stock"}
    </button>

    <button
      type="button"
      disabled={!isAvailable}
      onClick={handleBuyNow}
      className="
        h-[50px]
        rounded-lg
        border
        border-gray-300
        bg-white
        px-4
        text-[14px]
        font-semibold
        text-gray-900
        transition
        hover:border-gray-400
        hover:bg-gray-50
        active:scale-[0.99]
        disabled:cursor-not-allowed
        disabled:text-gray-400
      "
    >
      Buy Now
    </button>

  </div>

  {/* Secondary actions */}
  <div className="mt-2 flex items-center divide-x divide-gray-200">

  <button
  type="button"
  onClick={handleWishlist}
  className="
    flex
    flex-1
    items-center
    justify-center
    gap-2
    py-2.5
    text-[12px]
    font-medium
    text-gray-600
    transition
      hover:text-gray-950
"
>
  <Heart
    size={16}
    fill={wishlist ? "currentColor" : "none"}
    strokeWidth={1.8}
    className={wishlist ? "text-red-500" : "text-gray-600"}
  />

  {wishlist ? "Wishlisted" : "Add to Wishlist"}
</button>

    <button
      type="button"
      onClick={handleShare}
      className="
  flex
  flex-1
  items-center
  justify-center
  gap-2
  py-2.5
  text-[12px]
  font-medium
  text-gray-600
  transition
  hover:text-gray-950
"
    >
      <Share2
        size={16}
        strokeWidth={1.7}
      />

      Share
    </button>

  </div>

  {/* Secure checkout */}
  <div
    className="
      mt-2
      flex
      items-center
      justify-between
      gap-4
      border-t
      border-gray-200
      pt-3
    "
  >

    <span className="text-[11px] text-gray-400">
      Secure checkout
    </span>

    <div className="flex items-center gap-3 text-[10px] font-semibold text-gray-600">
      <span>VISA</span>
      <span>Mastercard</span>
      <span>UPI</span>
      <span>G Pay</span>
    </div>

  </div>

        </div>
        </section>

       {/* =====================================================
    KEY FEATURES
===================================================== */}
<section className="mt-8 border-y border-gray-200 bg-white py-5 sm:mt-10 sm:py-8 lg:mt-16">
  <div>
    <div className="flex items-end justify-between gap-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400 sm:text-[11px]">
          Key features
        </p>

        <h2 className="mt-1 text-[21px] font-semibold tracking-[-0.025em] text-gray-950 sm:mt-1.5 sm:text-[24px]">
          What you should know
        </h2>
      </div>
    </div>

    <div className="mt-4 grid overflow-hidden rounded-xl border border-gray-200 bg-white sm:mt-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {productHighlights.map((text, index) => {
        const icons = [
          Activity,
          LocateFixed,
          BatteryMedium,
          Moon,
          Droplets,
          Check,
        ];

        const Icon = icons[index % icons.length];

        return (
          <div
            key={text}
            className="
              flex
              min-h-[58px]
              items-center
              gap-3
              border-b
              border-gray-100
              px-3
              py-2.5

              last:border-b-0

              sm:min-h-[84px]
              sm:px-4
              sm:py-4

              sm:[&:nth-child(even)]:border-l

              lg:border-l
              lg:border-b-0

              xl:px-5
              xl:first:border-l-0
            "
          >
            <span
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                border
                border-gray-200
                bg-gray-50

                sm:h-9
                sm:w-9
              "
            >
              <Icon
                size={15}
                strokeWidth={1.7}
                className="text-gray-700"
              />
            </span>

            <span
              className="
                text-[11px]
                font-medium
                leading-4
                text-gray-800

                sm:text-[12px]
                sm:leading-5
              "
            >
              {text}
            </span>
          </div>
        );
      })}
    </div>
  </div>
</section>

     {/* =====================================================
    ABOUT THIS ITEM
===================================================== */}

<section className="border-b border-gray-200 py-8 lg:py-10">
  <div className="max-w-3xl">
    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">
      Product details
    </p>

    <h2 className="mt-1.5 text-[24px] font-semibold tracking-[-0.03em] text-gray-950">
      About this item
    </h2>

    <p className="mt-4 text-[14px] leading-6 text-gray-600">
      {product.description}
    </p>
  </div>
</section>

        {/* =====================================================
    PRODUCT INFORMATION
====================================================== */}

<section className="py-6 lg:py-10">

  <div className="flex items-end justify-between gap-6">
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">
        Specifications
      </p>

     <h2 className="mt-1 text-[22px] font-semibold tracking-[-0.03em] text-gray-950 sm:text-[25px]">
        Product information
      </h2>
    </div>

    <span className="hidden text-[12px] text-gray-400 sm:block">
      {productSpecs.length + 2} specifications
    </span>
  </div>

  <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white">

    <div className="border-b border-gray-200 bg-gray-50 px-5 py-2.5">
      <h3 className="text-[13px] font-semibold text-gray-900">
        General
      </h3>
    </div>

    <div className="grid md:grid-cols-2 md:divide-x md:divide-gray-200">

      <div className="divide-y divide-gray-100">
        <InfoRow
          label="Category"
          value={categoryName}
        />

        <InfoRow
          label="Availability"
          value={isAvailable ? "In Stock" : "Out of Stock"}
        />

        {productSpecs.slice(0, 3).map(([label, value]) => (
          <InfoRow
            key={label}
            label={label}
            value={value}
          />
        ))}
      </div>

      <div className="divide-y divide-gray-100">
        <InfoRow
          label="Model"
          value={product.productName}
        />

        <InfoRow
          label="Quantity"
          value={`${Number(product.quantity || 0)} units`}
        />

        {productSpecs.slice(3).map(([label, value]) => (
          <InfoRow
            key={label}
            label={label}
            value={value}
          />
        ))}
      </div>

    </div>
  </div>

</section>



     {/* =====================================================
    CUSTOMER REVIEWS
===================================================== */}
<section className="border-t border-gray-200 py-8 lg:py-8">

  {/* Header */}
  <div className="flex items-center justify-between gap-6">
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">
        Customer reviews
      </p>

      <h2 className="mt-1.5 text-[25px] font-semibold tracking-[-0.03em] text-gray-950">
        Customer feedback
      </h2>
    </div>

    <button
      type="button"
      onClick={() => {
  if (!user) {
    navigate("/login");
    return;
  }

  setEditingReviewId(null);
  setReviewModalOpen(true);
  setReviewRating(0);
  setReviewText("");
}}
      className="
        inline-flex
        h-10
        shrink-0
        items-center
        justify-center
        rounded-lg
        border
        border-gray-300
        bg-white
        px-5
        text-[13px]
        font-semibold
        text-gray-900
        transition
        hover:border-gray-900
        hover:bg-gray-50
      "
    >
      {editingReviewId ? "Edit your review" : "Write a review"}
    </button>
  </div>

  {/* Reviews content */}
  <div className="mt-4 grid items-start gap-5 lg:mt-6 lg:gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">

    {/* Rating summary */}
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">

      <div className="flex items-end gap-3">

       <span className="text-[46px] font-semibold leading-none tracking-[-0.055em] text-gray-950 sm:text-[52px]">
          {formattedAverageRating}
        </span>

        <div className="pb-1">
          <div className="flex items-center gap-1 text-orange-500">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={16}
                fill={
  index < Math.round(Number(averageRating))
    ? "currentColor"
    : "none"
}
                strokeWidth={1.5}
              />
            ))}
          </div>

          <p className="mt-1 text-[12px] text-gray-500">
            {totalRatings} ratings
          </p>
        </div>

      </div>

     <div className="mt-4 border-t border-gray-100 pt-3 sm:mt-5 sm:pt-4">

        <p className="text-[12px] font-medium text-gray-900">
          Overall customer rating
        </p>

        <p className="mt-1 text-[12px] leading-5 text-gray-500">
  Based on ratings and reviews from our customers.
</p>

      </div>

    </div>

    {/* Review cards */}
    <div className="grid items-start gap-4 md:grid-cols-2">

     {displayedReviews.length > 0 ? (
  displayedReviews.map((review, index) => (
    <ReviewCard
      key={review.reviewId}
      review={review}
      reviewNumber={index + 1}
      currentUser={user}
      onEdit={(review) => {
        setEditingReviewId(review.reviewId);
        setReviewRating(Number(review.rating));
        setReviewText(review.comment || "");
        setReviewModalOpen(true);
      }}
     onDelete={async (reviewId) => {
  const result = await dispatch(
    deleteProductReview(reviewId, toast)
  );

  if (!result) {
    return;
  }

  dispatch(getProductReviews(id));
  dispatch(getProductAverageRating(id));
  dispatch(getProductReviewCount(id));
}}
    />
  ))
) : (
  <div className="rounded-xl border border-gray-200 bg-white p-6 text-center md:col-span-2">
    <p className="text-sm font-medium text-gray-900">
      No reviews yet
    </p>

    <p className="mt-1 text-xs text-gray-500">
      Be the first customer to review this product.
    </p>
  </div>
)}

    </div>

  </div>

</section>

        {/* =====================================================
    RELATED PRODUCTS
===================================================== */}
{relatedProducts.length > 0 && (
  <section className="mt-8 border-t border-gray-200 pt-8 pb-12">

    {/* Section heading */}
<div className="flex items-end justify-between gap-6">
  <div>
    <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-gray-400">
      Related products
    </p>

    <h2 className="mt-1.5 text-[24px] font-semibold tracking-[-0.03em] text-gray-950">
      You may also like
    </h2>
  </div>

      <Link
        to="/products"
        className="flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-gray-600 transition-colors hover:text-gray-950"
      >
        View all
        <span className="text-[15px]">→</span>
      </Link>
    </div>

    {/* Product rail */}
    <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">

      {relatedProducts.map((item) => (
        <article
          key={item.productId}
          className="group min-w-0"
        >

          {/* Product image */}
          <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f7f7f5]">

            {/* Discount */}
            {item.discount > 0 && (
              <span className="absolute left-3 top-3 z-10 rounded-md bg-white px-2 py-1 text-[10px] font-bold tracking-wide text-orange-600 shadow-sm">
                {Math.round(item.discount)}% OFF
              </span>
            )}

         {/* Wishlist */}
<button
  type="button"
  aria-label={
    wishlistItems.some(
      (wishlistItem) =>
        String(wishlistItem.productId) ===
        String(item.productId)
    )
      ? `Remove ${item.productName} from wishlist`
      : `Add ${item.productName} to wishlist`
  }
  onClick={() => {
  if (!user) {
    toast.error("Please login to use your wishlist");
    navigate("/login");
    return;
  }

  const isWishlisted = wishlistItems.some(
    (wishlistItem) =>
      String(wishlistItem.productId) ===
      String(item.productId)
  );

  if (isWishlisted) {
    dispatch(
      removeFromWishlist(
        item.productId,
        toast
      )
    );
  } else {
    dispatch(
      addToWishlist(
        item.productId,
        toast
      )
    );
  }
}}
  className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-all hover:shadow-md ${
    wishlistItems.some(
      (wishlistItem) =>
        String(wishlistItem.productId) ===
        String(item.productId)
    )
      ? "text-red-500"
      : "text-gray-500 hover:text-gray-950"
  }`}
>
  <Heart
    size={16}
    strokeWidth={1.7}
    fill={
      wishlistItems.some(
        (wishlistItem) =>
          String(wishlistItem.productId) ===
          String(item.productId)
      )
        ? "currentColor"
        : "none"
    }
  />
</button>
            {/* Image */}
            <Link
              to={`/product/${item.productId}`}
              className="block h-full w-full"
            >
              <img
                src={getImageUrl(item.image)}
                alt={item.productName}
                className="h-full w-full object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-[1.035]"
              />
            </Link>

          </div>

          {/* Product information */}
          <div className="pt-2.5">

            {/* Category */}
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
              {item.category?.categoryName || "Electronics"}
            </p>

            {/* Product name */}
            <Link
  to={`/product/${item.productId}`}
  className="
    mt-1
    block
    text-[15px]
    font-semibold
    leading-5
    tracking-[-0.01em]
    text-gray-950
    transition-colors
    hover:text-gray-600
  "
>
  {item.productName}
</Link>

           {/* Rating */}
{(() => {
  const relatedContent = getContent(item.productName);
  const rating = relatedContent.rating;

  return (
    <div className="mt-1 flex items-center gap-2">
      <div className="flex items-center gap-0.5 text-orange-500">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={12}
            fill={index < Math.round(rating) ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
        ))}
      </div>

      <span className="text-[11px] text-gray-500">
        {rating.toFixed(1)}
      </span>
    </div>
  );
})()}

            {/* Price */}
            <div className="mt-2 flex items-baseline gap-2">

              <span className="text-[18px] font-bold tracking-[-0.02em] text-gray-950">
                ₹
                {Number(
                  item.specialPrice || item.price
                ).toLocaleString("en-IN")}
              </span>

              {item.price &&
                item.specialPrice &&
                item.price > item.specialPrice && (
                  <span className="text-[11px] text-gray-400 line-through">
                    ₹{Number(item.price).toLocaleString("en-IN")}
                  </span>
                )}

            </div>

            {/* Savings */}
          

          
            {/* Delivery */}
           <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-gray-500">
  <Truck
    size={13}
    strokeWidth={1.6}
    className="shrink-0 text-gray-400"
  />
  <span>Free delivery</span>
</div>

           {/* Add to cart */}
<button
  type="button"
  onClick={() => {
    if (Number(item.quantity) <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    dispatch(
      addToCart(
        {
          image: item.image,
          productName: item.productName,
          description: item.description,
          specialPrice: item.specialPrice,
          price: item.price,
          productId: item.productId,
          quantity: item.quantity,
        },
        1,
        toast
      )
    );
  }}
              className="
  mt-3
  flex
  h-10
  w-full
  items-center
  justify-center
  gap-2
  rounded-lg
  bg-gray-950
  text-[12px]
  font-semibold
  text-white
  transition-colors
  hover:bg-gray-800
"
            >
              <ShoppingCart
                size={14}
                strokeWidth={1.8}
              />

              Add to cart
            </button>

          </div>
        </article>
      ))}

    </div>
  </section>



)}


{/* =====================================================
    REVIEW MODAL
===================================================== */}

{reviewModalOpen && (
  <div
    className="
      fixed
      inset-0
      z-[120]
      flex
      items-center
      justify-center
      bg-black/60
      p-4
      backdrop-blur-sm
    "
    onClick={() => setReviewModalOpen(false)}
  >
    <div
      className="
        relative
        w-full
        max-w-lg
        rounded-2xl
        bg-white
        p-6
        shadow-2xl
        sm:p-7
      "
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close */}
      <button
        type="button"
        onClick={() => setReviewModalOpen(false)}
        aria-label="Close review form"
        className="
          absolute
          right-4
          top-4
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          text-xl
          text-gray-500
          transition
          hover:bg-gray-100
          hover:text-gray-900
        "
      >
        ×
      </button>

      {/* Header */}
      <div className="pr-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">
          Customer review
        </p>

        <h2 className="mt-1.5 text-[24px] font-semibold tracking-[-0.03em] text-gray-950">
          Write a review
        </h2>

        <p className="mt-1 text-[13px] leading-5 text-gray-500">
          Share your experience with this product.
        </p>
      </div>

      {/* Rating */}
      <div className="mt-6">
        <p className="text-[13px] font-semibold text-gray-900">
          Your rating
        </p>

        <div className="mt-2 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => {
            const rating = index + 1;

            return (
              <button
                key={rating}
                type="button"
                onClick={() => setReviewRating(rating)}
                aria-label={`Rate ${rating} out of 5`}
                className="rounded-md p-1 transition hover:bg-orange-50"
              >
                <Star
                  size={24}
                  strokeWidth={1.7}
                  className={
                    rating <= reviewRating
                      ? "text-orange-500"
                      : "text-gray-300"
                  }
                  fill={
                    rating <= reviewRating
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>
            );
          })}
        </div>
      </div>

      

      {/* Review text */}
      <div className="mt-5">
        <label
          htmlFor="review-text"
          className="text-[13px] font-semibold text-gray-900"
        >
          Your review
        </label>

        <textarea
          id="review-text"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Tell other customers about your experience..."
          rows={5}
          className="
            mt-2
            w-full
            resize-none
            rounded-lg
            border
            border-gray-200
            bg-white
            px-3.5
            py-3
            text-[13px]
            leading-5
            text-gray-900
            outline-none
            transition
            placeholder:text-gray-400
            focus:border-gray-900
          "
        />
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => setReviewModalOpen(false)}
          className="
            h-10
            rounded-lg
            border
            border-gray-200
            bg-white
            px-5
            text-[13px]
            font-semibold
            text-gray-700
            transition
            hover:border-gray-300
            hover:bg-gray-50
          "
        >
          Cancel
        </button>

        <button
          type="button"
         onClick={async () => {
  if (!reviewRating) {
    toast.error("Please select a rating");
    return;
  }

  if (!reviewText.trim()) {
    toast.error("Please write your review");
    return;
  }

  const reviewData = {
    rating: reviewRating,
    comment: reviewText.trim(),
  };

  let result;

  if (editingReviewId) {
    result = await dispatch(
      updateProductReview(
        editingReviewId,
        reviewData,
        toast
      )
    );
  } else {
    result = await dispatch(
      createProductReview(
        id,
        reviewData,
        toast
      )
    );
  }

  if (!result) {
    return;
  }

  setReviewModalOpen(false);
  setReviewRating(0);
  setReviewText("");
  setEditingReviewId(null);

  dispatch(getProductReviews(id));
  dispatch(getProductAverageRating(id));
  dispatch(getProductReviewCount(id));
}}
          className="
            h-10
            rounded-lg
            bg-gray-950
            px-5
            text-[13px]
            font-semibold
            text-white
            transition
            hover:bg-gray-800
          "
        >
          {editingReviewId ? "Update review" : "Submit review"}
        </button>
      </div>
    </div>
  </div>
)}



{/* =====================================================
    IMAGE VIEWER
===================================================== */}

{imageViewerOpen && (
  <div
    className="
      fixed
      inset-0
      z-[110]
      flex
      items-center
      justify-center
      bg-black/90
      p-4
      backdrop-blur-sm
    "
    onClick={() => setImageViewerOpen(false)}
  >
    <div
      className="
        relative
        flex
        h-full
        w-full
        max-w-7xl
        flex-col
        overflow-hidden
        rounded-2xl
        bg-[#111111]
        shadow-2xl
      "
      onClick={(e) => e.stopPropagation()}
    >

      {/* =================================================
          TOP BAR
      ================================================== */}

      <div
        className="
          flex
          shrink-0
          items-center
          justify-between
          border-b
          border-white/10
          px-5
          py-4
        "
      >

        {/* Product name */}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">
            {product.productName}
          </p>

          <p className="mt-0.5 text-[11px] text-white/50">
            {selectedImage + 1} / {productImages.length}
          </p>
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={() => setImageViewerOpen(false)}
          aria-label="Close image viewer"
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-white/10
            text-2xl
            leading-none
            text-white
            transition
            hover:bg-white/20
          "
        >
          ×
        </button>

      </div>


      {/* =================================================
          MAIN IMAGE AREA
      ================================================== */}

      <div className="relative flex min-h-0 flex-1 items-center justify-center p-5 sm:p-8">

        {/* Previous image */}
        {productImages.length > 1 && (
          <button
            type="button"
            onClick={() =>
              setSelectedImage((prev) =>
                prev === 0
                  ? productImages.length - 1
                  : prev - 1
              )
            }
            aria-label="Previous image"
            className="
              absolute
              left-4
              top-1/2
              z-10
              flex
              h-11
              w-11
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              bg-white/10
              text-white
              backdrop-blur-sm
              transition
              hover:bg-white/20
              sm:left-6
            "
          >
            <ChevronRight
              size={21}
              className="rotate-180"
              strokeWidth={1.8}
            />
          </button>
        )}


        {/* Main viewer image */}
        <img
          src={getImageUrl(activeImage)}
          alt={product.productName}
          className="
            max-h-full
            max-w-full
            object-contain
            select-none
          "
        />


        {/* Next image */}
        {productImages.length > 1 && (
          <button
            type="button"
            onClick={() =>
              setSelectedImage((prev) =>
                prev === productImages.length - 1
                  ? 0
                  : prev + 1
              )
            }
            aria-label="Next image"
            className="
              absolute
              right-4
              top-1/2
              z-10
              flex
              h-11
              w-11
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              bg-white/10
              text-white
              backdrop-blur-sm
              transition
              hover:bg-white/20
              sm:right-6
            "
          >
            <ChevronRight
              size={21}
              strokeWidth={1.8}
            />
          </button>
        )}

      </div>


      {/* =================================================
          THUMBNAILS
      ================================================== */}

      {productImages.length > 1 && (
        <div
          className="
            shrink-0
            border-t
            border-white/10
            px-4
            py-4
          "
        >
          <div className="flex justify-center gap-2 overflow-x-auto">

            {productImages.map((image, index) => (
              <button
                key={`${image}-viewer-${index}`}
                type="button"
                onClick={() => setSelectedImage(index)}
                aria-label={`View product image ${index + 1}`}
                className={`
                  flex
                  h-16
                  w-16
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-lg
                  border
                  bg-white
                  p-1
                  transition
                  ${
                    selectedImage === index
                      ? "border-white ring-2 ring-white/30"
                      : "border-white/20 opacity-60 hover:opacity-100"
                  }
                `}
              >
                <img
                  src={getImageUrl(image)}
                  alt={`${product.productName} ${index + 1}`}
                  className="h-full w-full object-contain"
                />
              </button>
            ))}

          </div>
        </div>
      )}

    </div>
  </div>
)}



{/* =====================================================
    VIDEO MODAL
===================================================== */}
{activeVideo && (
  <div
    className="
      fixed
      inset-0
      z-[100]
      flex
      items-center
      justify-center
      bg-black/80
      p-4
      backdrop-blur-sm
    "
    onClick={() => setActiveVideo(null)}
  >
    <div
      className="
        relative
        w-full
        max-w-5xl
        overflow-hidden
        rounded-2xl
        bg-black
        shadow-2xl
      "
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={() => setActiveVideo(null)}
        className="
          absolute
          right-4
          top-4
          z-10
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          bg-black/60
          text-xl
          text-white
          backdrop-blur-sm
          transition
          hover:bg-black/80
        "
        aria-label="Close video"
      >
        ×
      </button>

      {/* Video title */}
      <div className="absolute left-5 top-5 z-10">
        <p className="text-sm font-medium text-white">
          {activeVideo.title}
        </p>
      </div>

      {/* Video */}
      <video
        key={activeVideo.src}
        className="block max-h-[85vh] w-full object-contain"
        src={activeVideo.src}
        controls
        autoPlay
        playsInline
      />
    </div>
  </div>
)}

      </div>
    </main>
  );
};

const InfoRow = ({ label, value }) => (
  <div
    className="
      grid
      min-h-[40px]
      grid-cols-[minmax(0,1fr)_minmax(100px,1.2fr)]
      items-center
      gap-3
      px-3
      py-1.5

      sm:min-h-[58px]
      sm:grid-cols-[minmax(0,1fr)_minmax(120px,1.2fr)]
      sm:gap-6
      sm:px-5
      sm:py-3
    "
  >
    <span className="text-[11px] text-gray-500 sm:text-[13px]">
      {label}
    </span>

    <span className="break-words text-right text-[11px] font-medium leading-4 text-gray-900 sm:text-[13px] sm:leading-5">
      {value}
    </span>
  </div>
);


/* =============================================================
   REVIEW CARD
============================================================= */

const ReviewCard = ({
  review,
  reviewNumber,
  currentUser,
  onEdit,
  onDelete,
}) => {
  const isOwner =
  currentUser?.id &&
  review?.userId &&
  String(currentUser.id) === String(review.userId);

  return (
    <article
      className="
        rounded-xl
        border
        border-gray-200
        bg-white
        p-4
        sm:p-5
        transition
        hover:border-gray-300
        hover:shadow-[0_6px_20px_rgba(15,23,42,0.04)]
      "
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 text-orange-500">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={14}
              fill={
                index < Number(review.rating)
                  ? "currentColor"
                  : "none"
              }
              strokeWidth={1.5}
            />
          ))}
        </div>

        <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-400">
          Review {reviewNumber}
        </span>
      </div>

      <p className="mt-3 text-[14px] leading-6 text-gray-700">
        {review.comment}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-400">
        <span className="font-medium text-gray-700">
          {review.userName || "Customer"}
        </span>

        {review.createdAt && (
          <>
            <span>•</span>

            <span>
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </>
        )}
      </div>

      {isOwner && (
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(review)}
            className="
              rounded-md
              border
              border-gray-200
              px-3
              py-1.5
              text-xs
              font-medium
              text-gray-700
              hover:bg-gray-50
            "
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(review.reviewId)}
            className="
              rounded-md
              border
              border-red-200
              px-3
              py-1.5
              text-xs
              font-medium
              text-red-600
              hover:bg-red-50
            "
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
};

export default ProductDetails;