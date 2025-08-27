import { useState } from "react";
import React, { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import logo from "./assets/logo_supersiesta.png";
import logoBlack from "./assets/bragaouiBlack.png";

import About from "./pages/about";
import Shop from "./pages/shop";
import Header from "./components/header/Header";
import HeaderBottom from "./components/header/HeaderBottom";
import Cart from "./components/cart/Cart";
import ProductDetails from "./pages/productDetails";
import Home from "./pages/home";
import CheckoutPage from "./pages/checkout";
import Footer from "./components/footer/Footer";
import Category from "./pages/catrgory";
import Contact from "./pages/contact";
import Login from "./pages/login";

const LazyHome = lazy(() => import("./pages/home"));
const LazyShop = lazy(() => import("./pages/shop"));
const LazyAbout = lazy(() => import("./pages/about"));
const LazyContact = lazy(() => import("./pages/contact"));
const LazyCheckoutPage = lazy(() => import("./pages/checkout"));
const LazyProductDetails = lazy(() => import("./pages/productDetails"));
const LazyCategory = lazy(() => import("./pages/catrgory"));
const LazyLogin = lazy(() => import("./pages/login"));
const LazyOrders = lazy(() => import("./pages/Orders"));
const LazyOrderDetail = lazy(() => import("./pages/OrderDetail"));

function App() {
  const location = useLocation();

  // Pages where we DON'T want the header and headerBottom to show
  const hideHeaderPaths = ["/login"];
  const shouldShowHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <>
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh", // 100% of the viewport height
            }}
          >
            <div>
              <img
                src={logoBlack}
                alt="Loading"
                style={{ width: "auto", height: "100px" }}
              />
            </div>
            <p style={{ marginTop: "10px" }}>Artisanat Bargaoui</p>
          </div>
        }
      >
        {shouldShowHeader && <Header />}
        <Cart />

        <Routes>
          <Route path="/" element={<LazyHome />} />
          <Route path="login" element={<LazyLogin />} />
          <Route path="about" element={<LazyAbout />} />
          <Route path="contact" element={<LazyContact />} />
          <Route path="shop" element={<LazyShop />} />
          <Route path="orders" element={<LazyOrders />} />
          <Route path="category/:Category" element={<LazyCategory />} />
          <Route path="Checkout" element={<LazyCheckoutPage />} />
          <Route path="/product/:slug" element={<LazyProductDetails />} />
          <Route path="/order/:id" element={<LazyOrderDetail />} />

          <Route path="/*" element={"rawa7"} />
        </Routes>

        <Footer />
      </Suspense>
    </>
  );
}

export default App;
