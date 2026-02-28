import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const PROMO_SLIDES = [
  {
    title: "Weekend Electronics Deals",
    subtitle: "Save up to 40% on selected tech essentials",
    image:
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Work & Study Setup",
    subtitle: "Monitors, laptops, and accessories for peak productivity",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Gaming Room Upgrades",
    subtitle: "Chairs, audio, and displays for immersive play",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80"
  }
];

function renderStars(rating = 0) {
  const rounded = Math.round(Number(rating));
  return "★★★★★".split("").map((star, index) => (
    <span key={`${star}-${index}`} className={index < rounded ? "star filled" : "star"}>
      {star}
    </span>
  ));
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [activeSlide, setActiveSlide] = useState(0);
  const { token } = useAuth();
  const [searchParams] = useSearchParams();

  const navQuery = searchParams.get("q") || "";
  const navCategory = searchParams.get("category") || "";

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api("/products", {}, token);
        setProducts(data.products);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % PROMO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const addToCart = async (productId) => {
    try {
      await api(
        "/cart",
        {
          method: "POST",
          body: JSON.stringify({ productId, quantity: 1 })
        },
        token
      );
      alert("Added to cart");
    } catch (e) {
      alert(e.message);
    }
  };

  const filteredProducts = useMemo(() => {
    const query = navQuery.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const inCategory = !navCategory || product.category === navCategory;
      const text = `${product.name} ${product.description} ${product.brand} ${product.category}`.toLowerCase();
      const matchesSearch = !query || text.includes(query);
      return inCategory && matchesSearch;
    });

    if (sortBy === "price-asc") {
      return filtered.sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (sortBy === "price-desc") {
      return filtered.sort((a, b) => Number(b.price) - Number(a.price));
    }
    if (sortBy === "rating-desc") {
      return filtered.sort((a, b) => Number(b.rating) - Number(a.rating));
    }
    if (sortBy === "reviews-desc") {
      return filtered.sort((a, b) => Number(b.review_count) - Number(a.review_count));
    }

    return filtered;
  }, [products, navQuery, navCategory, sortBy]);

  const promoProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => Number(b.review_count || 0) - Number(a.review_count || 0))
      .slice(0, 4);
  }, [products]);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length);
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % PROMO_SLIDES.length);
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section className="products-page">
      <section className="promo-hero">
        <div
          className="promo-bg"
          style={{ backgroundImage: `url(${PROMO_SLIDES[activeSlide].image})` }}
        >
          <div className="promo-overlay">
            <h2>{PROMO_SLIDES[activeSlide].title}</h2>
            <p>{PROMO_SLIDES[activeSlide].subtitle}</p>
          </div>
          <button className="promo-nav prev" onClick={handlePrevSlide} type="button">
            &#10094;
          </button>
          <button className="promo-nav next" onClick={handleNextSlide} type="button">
            &#10095;
          </button>
        </div>
        <div className="promo-cards">
          {promoProducts.map((product) => (
            <article key={`promo-${product.id}`} className="promo-card">
              <img
                src={product.image_url || "https://via.placeholder.com/400x280?text=Promo"}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src = `https://picsum.photos/seed/promo-${product.id}/400/280`;
                }}
              />
              <div>
                <h3>{product.name}</h3>
                <p>${Number(product.price).toFixed(2)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="catalog-header catalog-top">
        <div>
          <h1>sam-com Catalog</h1>
          <p>{filteredProducts.length} results</p>
        </div>
        <div className="catalog-controls">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Top Rated</option>
            <option value="reviews-desc">Most Reviewed</option>
          </select>
        </div>
      </div>
      <div className="catalog-grid">
        {filteredProducts.map((product) => (
          <article key={product.id} className="card product-card amazon-card">
            <div className="product-image-wrap">
              <img
                className="product-image"
                src={product.image_url || "https://via.placeholder.com/600x450?text=Product"}
                alt={product.name}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = `https://picsum.photos/seed/samcom-${product.id}/600/450`;
                }}
              />
            </div>
            <p className="meta-text">
              {product.brand} · {product.category}
            </p>
            <h3 className="product-title">{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <div className="rating-row">
              <div>{renderStars(product.rating)}</div>
              <span className="review-count">({product.review_count || 0})</span>
            </div>
            <p className="price amazon-price">${Number(product.price).toFixed(2)}</p>
            <p className="stock-text">{product.stock > 0 ? "In Stock" : "Out of Stock"}</p>
            <button onClick={() => addToCart(product.id)} disabled={product.stock < 1}>
              {product.stock > 0 ? "Add to Cart" : "Unavailable"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
