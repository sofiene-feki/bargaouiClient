import React, { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  Disclosure,
  MenuItem,
  MenuItems,
  Menu,
  MenuButton,
  Transition,
} from "@headlessui/react";
import {
  ArrowLeftIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/bragaoui.png";
import logoBlack from "../../assets/bragaouiBlack.png";
import jebba from "../../assets/category/jebba.webp";
import kamis from "../../assets/category/kamis.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { closeCart, openCart } from "../../redux/ui/cartDrawer";
import { signOut } from "firebase/auth";
import { authLogout } from "../../redux/user/userSlice";
import { auth } from "../../service/firebase";
import userImg from "../../assets/user.jpg";
import CustomDialog from "../ui/Dialog";
import {
  ChevronUpIcon,
  CogIcon,
  LockClosedIcon,
  UserIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import UserSettingsContent from "./userSettings";
import UserSettingsLayout from "../UserSettings/UserSettingsLayout";
import Search from "./Search";

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Produits", href: "/shop" },
  { name: "À propos", href: "/about" },
  { name: "Nous Contacter", href: "/contact" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const location = useLocation();
  const currentPath = location.pathname;
  const totalQty = useSelector((state) => state.cart.totalQuantity);
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [serarchMenuOpen, setSearchMenuOpen] = useState(false);

  const { userInfo, isAuthenticated } = useSelector((state) => state.user);
  const userNavigation = [
    { name: "Your Profile", href: "#" },
    { name: "Mes commandes", href: "orders" },
    { name: "Sign out", href: "#" },
  ];

  const categories = {
    Homme: [
      { name: "Jebba", image: jebba },
      { name: "Kamis", image: kamis },
    ],
    Femme: [
      { name: "Robe", image: "/images/robe.jpg" },
      { name: "Chaussures", image: "/images/chaussures.jpg" },
    ],
    Enfants: [
      { name: "Jouets", image: "/images/jouets.jpg" },
      { name: "Vêtements", image: "/images/vetements.jpg" },
    ],
  };

  const [activeCategory, setActiveCategory] = useState(null);

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Firebase logout
      dispatch(authLogout()); // Clear Redux state
      //  navigate("/login"); // Redirect to login
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location.pathname === "/";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled || !isHome ? "bg-white shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="relative mx-auto max-w-7xl">
        {/* ✅ Absolute Centered Text */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-700 pointer-events-none`}
        >
          <p
            className={`transition-all duration-700 transform text-4xl font-medium ${
              isHome
                ? isScrolled
                  ? "text-xl scale-75 text-black translate-x-[-85px] md:translate-x-[-520px]"
                  : "text-4xl md:text-9xl mt-25 drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] md:mt-50 text-white scale-100 translate-x-0"
                : "text-xl text-black scale-75 translate-x-[-70px] md:translate-x-[-500px]"
            }`}
          >
            Artisanat Bargaoui
          </p>
        </div>

        {/* ✅ Navbar Content */}
        <div className="flex md:h-14.5 h-12 px-1 items-center justify-between relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-1">
            <Link to="/" className="md:flex items-center h-9 md:h-16">
              <img
                className="h-full w-auto"
                src={isScrolled || !isHome ? logoBlack : logo}
                alt="Your Company"
                draggable={false}
              />
            </Link>
          </div>

          {/* Cart + User */}
          <div className="flex items-center gap-3 ">
            {isAuthenticated && userInfo ? (
              <>
                <div className="relative inline-block">
                  <img
                    className={`w-6.5 h-6.5 rounded-full transition-colors ${
                      isScrolled || !isHome
                        ? "text-black ring-1 ring-black"
                        : "text-white ring-1 ring-white"
                    }`}
                    src={userImg}
                    alt="profile"
                    onClick={() => setUserMenuOpen(true)}
                  />
                  {/* Online indicator */}
                  <span className="absolute bottom-0 right-0 block w-2 h-2 bg-green-500 rounded-full ring-2 ring-white"></span>
                </div>

                <CustomDialog
                  open={userMenuOpen}
                  onClose={() => setUserMenuOpen(false)}
                  position="right"
                >
                  <UserSettingsLayout
                    setUserMenuOpen={setUserMenuOpen}
                    handleSignOut={handleSignOut}
                  />
                </CustomDialog>
              </>
            ) : (
              <Link to="/login">
                <UserIcon
                  className={`w-6 h-6 transition-colors ${
                    isScrolled || !isHome ? "text-black" : "text-white"
                  }`}
                />
              </Link>
            )}
            <button
              onClick={() => dispatch(openCart())}
              className="relative transition"
            >
              <ShoppingBagIcon
                className={`w-6 h-6 transition-colors ${
                  isScrolled || !isHome ? "text-black" : "text-white"
                }`}
              />
              {totalQty > 0 && (
                <span className="absolute -top-1.5 -right-3 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {totalQty}
                </span>
              )}
            </button>

            <CustomDialog
              open={mobileMenuOpen}
              onClose={() => setMobileMenuOpen(false)}
              position="right"
            >
              <nav className="flex flex-col h-full bg-white shadow-lg p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  {activeCategory ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveCategory(null)}
                        className="p-1 text-gray-600 hover:text-gray-900"
                      >
                        <ArrowLeftIcon className="h-5 w-5" />
                      </button>
                      <h2 className="text-lg font-bold text-gray-800">
                        {activeCategory}
                      </h2>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-lg font-bold text-gray-800">Menu</h2>
                      <button
                        className="p-2 text-gray-600 hover:text-gray-900"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </>
                  )}
                </div>

                {!activeCategory && (
                  <>
                    <ul className="space-y-4">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <Link
                            to={item.href}
                            className="block text-gray-700 hover:text-green-600 font-medium transition"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <div className="border-t border-gray-200 my-6"></div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4">
                        Catégories
                      </h3>
                      <ul className="space-y-3">
                        {Object.keys(categories).map((cat) => (
                          <li key={cat}>
                            <button
                              onClick={() => setActiveCategory(cat)}
                              className="flex items-center gap-3 text-gray-700 hover:text-green-600 font-medium transition w-full text-left"
                            >
                              {cat}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {/* Subcategory view with images */}
                {activeCategory && (
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 mt-4">
                    {categories[activeCategory].map((sub) => (
                      <div
                        key={sub.name}
                        className=" rounded-lg overflow-hidden shadow hover:shadow-lg transition flex flex-col"
                      >
                        {/* Image */}
                        <img
                          src={sub.image}
                          alt={sub.name}
                          className="w-full h-80 object-cover"
                        />

                        {/* Title + Voir tous row */}
                        <div className="p-4 flex items-center justify-between">
                          <h3 className="font-semibold text-gray-700">
                            {sub.name}
                          </h3>
                          <Link
                            to={`/category/${activeCategory.toLowerCase()}/${sub.name.toLowerCase()}`}
                            className="text-green-600 font-medium hover:underline"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Voir tous
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </nav>
            </CustomDialog>

            <CustomDialog
              open={serarchMenuOpen}
              onClose={() => setSearchMenuOpen(false)}
              position="right"
            >
              <Search onClose={() => setSearchMenuOpen(false)} />
            </CustomDialog>

            {/* Mobile Menu Button */}
            <button onClick={() => setSearchMenuOpen(true)}>
              <MagnifyingGlassIcon
                className={`w-6 h-6 transition-colors ${
                  isScrolled || !isHome ? "text-black" : "text-white"
                }`}
              />
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center justify-center focus:outline-none"
              aria-label="Toggle menu"
            >
              <Bars3Icon
                className={`w-8 h-8 transition-colors ${
                  isScrolled || !isHome ? "text-black" : "text-white"
                }`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
