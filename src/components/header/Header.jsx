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
  Bars3Icon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/bragaoui.png";
import logoBlack from "../../assets/bragaouiBlack.png";
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
  const [user, setUser] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [view, setView] = useState("main"); // 'main' | 'pixel' | 'google'

  const goBack = () => setView("main");

  const { userInfo, isAuthenticated } = useSelector((state) => state.user);
  const userNavigation = [
    { name: "Your Profile", href: "#" },
    { name: "Mes commandes", href: "orders" },
    { name: "Sign out", href: "#" },
  ];
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
            className={`transition-all duration-700 transform font-bold font-serif ${
              isHome
                ? isScrolled
                  ? "text-xl scale-75 text-black translate-x-[-70px] md:translate-x-[-500px]"
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
                <img
                  className="w-9 h-9 rounded-full"
                  src={userImg}
                  alt="profile"
                  onClick={() => setUserMenuOpen(true)}
                />
                <CustomDialog
                  open={userMenuOpen}
                  onClose={() => setUserMenuOpen(false)}
                  position="right"
                >
                  <UserSettingsContent />
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
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {totalQty}
                </span>
              )}
            </button>

            <CustomDialog
              open={mobileMenuOpen}
              onClose={() => setMobileMenuOpen(false)}
              position="right"
            >
              <nav className="flex flex-col h-full bg-white shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-800">Menu</h2>

                  <button
                    className="p-2 text-gray-600 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Main Navigation */}
                <ul className="space-y-4">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="block text-gray-700 hover:text-green-600 font-medium transition"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>

                {/* Divider */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Categories Section */}
                <div>
                  <h3 className="text-md font-semibold text-gray-800 mb-4">
                    Catégories
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="/category/imprimante"
                        className="flex items-center gap-3 text-gray-700 hover:text-green-600 font-medium transition"
                      >
                        <img
                          src="/icons/printer.svg"
                          alt="Imprimante"
                          className="w-5 h-5"
                        />
                        Imprimantes
                      </a>
                    </li>
                    <li>
                      <a
                        href="/category/photocopieur"
                        className="flex items-center gap-3 text-gray-700 hover:text-green-600 font-medium transition"
                      >
                        <img
                          src="/icons/copier.svg"
                          alt="Photocopieur"
                          className="w-5 h-5"
                        />
                        Photocopieurs
                      </a>
                    </li>
                    <li>
                      <a
                        href="/category/consommable"
                        className="flex items-center gap-3 text-gray-700 hover:text-green-600 font-medium transition"
                      >
                        <img
                          src="/icons/ink.svg"
                          alt="Consommable"
                          className="w-5 h-5"
                        />
                        Consommables
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Bottom CTA */}
                <div className="mt-auto pt-6">
                  <a
                    href="/contact"
                    className="block text-center bg-green-600 text-white py-3 rounded-lg shadow hover:bg-green-700 transition"
                  >
                    Nous Contacter
                  </a>
                </div>
              </nav>
            </CustomDialog>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center justify-center focus:outline-none"
              aria-label="Toggle menu"
            >
              <Bars3Icon
                className={`w-7 h-7 transition-colors ${
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
