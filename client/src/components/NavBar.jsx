import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import samComMark from "../assets/sam-com-mark.svg";

const WORLD_LOCATIONS = [
  "New York, United States",
  "Los Angeles, United States",
  "Toronto, Canada",
  "Mexico City, Mexico",
  "Sao Paulo, Brazil",
  "London, United Kingdom",
  "Paris, France",
  "Berlin, Germany",
  "Madrid, Spain",
  "Rome, Italy",
  "Lagos, Nigeria",
  "Nairobi, Kenya",
  "Cairo, Egypt",
  "Johannesburg, South Africa",
  "Dubai, United Arab Emirates",
  "Riyadh, Saudi Arabia",
  "Mumbai, India",
  "Delhi, India",
  "Karachi, Pakistan",
  "Bangkok, Thailand",
  "Singapore, Singapore",
  "Kuala Lumpur, Malaysia",
  "Jakarta, Indonesia",
  "Manila, Philippines",
  "Seoul, South Korea",
  "Tokyo, Japan",
  "Beijing, China",
  "Shanghai, China",
  "Sydney, Australia",
  "Melbourne, Australia"
];

const NAV_CATEGORIES = [
  "All",
  "Accessories",
  "Audio",
  "Computers",
  "Home Office",
  "Monitors",
  "Networking",
  "Phones",
  "Storage",
  "Wearables"
];

const LANGUAGE_OPTIONS = [
  { code: "en", label: "EN", country: "United States", flag: "US" },
  { code: "fr", label: "FR", country: "France", flag: "FR" },
  { code: "es", label: "ES", country: "Spain", flag: "ES" },
  { code: "de", label: "DE", country: "Germany", flag: "DE" },
  { code: "it", label: "IT", country: "Italy", flag: "IT" },
  { code: "pt", label: "PT", country: "Brazil", flag: "BR" },
  { code: "ar", label: "AR", country: "UAE", flag: "AE" },
  { code: "hi", label: "HI", country: "India", flag: "IN" },
  { code: "ja", label: "JA", country: "Japan", flag: "JP" }
];

const SUB_MENU_ITEMS = [
  "All",
  "Today's Deals",
  "Prime Video",
  "Registry",
  "Gift Cards",
  "Customer Service",
  "Sell"
];

export default function NavBar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchCategory, setSearchCategory] = useState("All");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLanguageCode, setSelectedLanguageCode] = useState("en");

  useEffect(() => {
    if (!token) {
      setPickerOpen(false);
      setLanguageOpen(false);
      return;
    }

    const locationKey = `sam_com_delivery_location_${user?.id || "guest"}`;
    const savedLocation = localStorage.getItem(locationKey);
    setDeliveryLocation(savedLocation || "India");
    setLocationInput(savedLocation || "India");

    const languageKey = `sam_com_language_${user?.id || "guest"}`;
    const savedLanguage = localStorage.getItem(languageKey);
    if (savedLanguage && LANGUAGE_OPTIONS.some((option) => option.code === savedLanguage)) {
      setSelectedLanguageCode(savedLanguage);
    }
  }, [token, user?.id]);

  const handleSaveLocation = () => {
    const nextValue = locationInput.trim();
    const key = `sam_com_delivery_location_${user?.id || "guest"}`;
    if (!nextValue) {
      localStorage.removeItem(key);
      setDeliveryLocation("India");
      setLocationInput("India");
      setPickerOpen(false);
      return;
    }
    localStorage.setItem(key, nextValue);
    setDeliveryLocation(nextValue);
    setPickerOpen(false);
  };

  const handleQuickPick = (value) => {
    setLocationInput(value);
  };

  const handleLogout = () => {
    logout();
    setPickerOpen(false);
    setLanguageOpen(false);
    navigate("/login");
  };

  const selectedLanguage =
    LANGUAGE_OPTIONS.find((option) => option.code === selectedLanguageCode) || LANGUAGE_OPTIONS[0];

  const handleLanguagePick = (code) => {
    setSelectedLanguageCode(code);
    const key = `sam_com_language_${user?.id || "guest"}`;
    localStorage.setItem(key, code);
    setLanguageOpen(false);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchText.trim();
    const params = new URLSearchParams();
    if (query) {
      params.set("q", query);
    }
    if (searchCategory !== "All") {
      params.set("category", searchCategory);
    }
    const queryString = params.toString();
    navigate(queryString ? `/products?${queryString}` : "/products");
  };

  return (
    <header className="nav amazon-nav">
      <div className="nav-main-row container">
        <Link className="amazon-brand" to="/products">
          <img src={samComMark} alt="sam-com" className="amazon-brand-mark" />
          <span className="amazon-brand-text">sam-com</span>
        </Link>

        {token ? (
          <div className="deliver-wrapper amazon-deliver-wrapper">
            <button
              onClick={() => setPickerOpen((open) => !open)}
              className="deliver-btn amazon-deliver-btn"
              type="button"
            >
              <span className="deliver-label">Deliver to</span>
              <span className="deliver-value">{deliveryLocation || "India"}</span>
            </button>
            {pickerOpen ? (
              <div className="deliver-picker">
                <label htmlFor="location-input">Choose from world locations</label>
                <select
                  id="location-select"
                  value={WORLD_LOCATIONS.includes(locationInput) ? locationInput : ""}
                  onChange={(e) => handleQuickPick(e.target.value)}
                >
                  <option value="">Select a location</option>
                  {WORLD_LOCATIONS.map((place) => (
                    <option key={place} value={place}>
                      {place}
                    </option>
                  ))}
                </select>
                <input
                  id="location-input"
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="Or type any city, state, country"
                />
                <div className="deliver-actions">
                  <button type="button" className="btn-muted" onClick={() => setPickerOpen(false)}>
                    Cancel
                  </button>
                  <button type="button" onClick={handleSaveLocation}>
                    Save
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        <form className="amazon-search" onSubmit={handleSearchSubmit}>
          <select
            aria-label="Search category"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          >
            {NAV_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search sam-com"
          />
          <button type="submit" aria-label="Search products" className="amazon-search-btn">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M10.5 3.5a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm8.15 11.74 2.85 2.85-1.41 1.41-2.85-2.85 1.41-1.41Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </form>

        {token ? (
          <>
            <div className="language-wrapper amazon-language-wrapper">
              <button
                type="button"
                className="language-btn amazon-language-btn"
                onClick={() => setLanguageOpen((open) => !open)}
              >
                <span className="language-flag">{selectedLanguage.flag}</span>
                <span>{selectedLanguage.label}</span>
              </button>
              {languageOpen ? (
                <div className="language-menu">
                  {LANGUAGE_OPTIONS.map((option) => (
                    <button
                      key={option.code}
                      type="button"
                      className={`language-option ${option.code === selectedLanguageCode ? "active" : ""}`}
                      onClick={() => handleLanguagePick(option.code)}
                    >
                      <span className="language-flag">{option.flag}</span>
                      <span>
                        {option.label} ({option.country})
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="amazon-account-wrapper">
              <button type="button" className="amazon-account-btn" onClick={() => navigate("/orders")}>
                <span>Hello, {user?.name ? user.name.split(" ")[0] : "sign in"}</span>
                <strong>Account & Lists</strong>
              </button>
              <div className="amazon-account-menu">
                <div className="account-menu-top">
                  <button type="button" className="account-signin-btn" onClick={() => navigate("/login")}>
                    Sign in
                  </button>
                  <p>
                    New customer? <a href="#start-here">Start here.</a>
                  </p>
                </div>
                <div className="account-menu-grid">
                  <div>
                    <h4>Your Lists</h4>
                    <a href="#create-list">Create a List</a>
                    <a href="#find-registry">Find a List or Registry</a>
                  </div>
                  <div>
                    <h4>Your Account</h4>
                    <a href="#account">Account</a>
                    <a href="#orders">Orders</a>
                    <a href="#recommendations">Recommendations</a>
                    <a href="#browsing-history">Browsing History</a>
                    <a href="#shopping-preferences">Your Shopping preferences</a>
                    <a href="#watchlist">Watchlist</a>
                    <a href="#video-purchases">Video Purchases & Rentals</a>
                    <a href="#kindle">Kindle Unlimited</a>
                    <a href="#content-devices">Content & Devices</a>
                    <a href="#subscribe-save">Subscribe & Save Items</a>
                    <a href="#memberships">Memberships & Subscriptions</a>
                    <a href="#music-library">Music Library</a>
                  </div>
                </div>
              </div>
            </div>

            <button type="button" className="amazon-orders-btn" onClick={() => navigate("/orders")}>
              <span>Returns</span>
              <strong>& Orders</strong>
            </button>

            <button type="button" className="amazon-cart-btn" onClick={() => navigate("/cart")}>
              <span className="amazon-cart-count">0</span>
              <span className="amazon-cart-text">Cart</span>
            </button>

            <button onClick={handleLogout} className="btn-muted amazon-logout-btn" type="button">
              Logout
            </button>
          </>
        ) : null}
      </div>

      <div className="nav-sub-row">
        <div className="container nav-sub-inner">
          {SUB_MENU_ITEMS.map((item) => (
            <Link key={item} to="/products" className={`sub-link ${item === "All" ? "all-link" : ""}`}>
              {item}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
