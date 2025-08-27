import React, { useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/cart/cartSlice";
import { createOrder } from "../functions/order";

export default function CheckoutPage() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isOpen, setIsOpen] = useState(false);

  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc +
      (item.selectedSizePrice != null ? item.selectedSizePrice : item.price) *
        item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      customer: formData,
      items: cartItems,
      subtotal,
      shipping,
      paymentMethod,
      total,
    };

    try {
      // Send order to server
      const response = await createOrder(orderData);
      console.log("✅ Order placed successfully:", response);

      // Open success dialog
      setIsOpen(true);

      // Optionally clear cart and form
      // clearCart();
      // setFormData({ fullName: "", phone: "", address: "" });
    } catch (error) {
      console.error("❌ Error placing order:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  return (
    <>
      {/* Welcome Dialog */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center shadow-xl transition-all">
                  <Dialog.Title className="text-2xl font-bold text-[#87a736]">
                    😊 Bienvenue {formData.fullName} !
                  </Dialog.Title>
                  <p className="mt-4 text-gray-600">
                    Merci pour votre commande. Nous vous confirmerons votre
                    commande par téléphone sous peu.
                  </p>
                  <button
                    className="mt-6 px-6 py-2 bg-[#87a736] text-white rounded-lg hover:bg-[#769030] transition"
                    onClick={() => {
                      // Clear the cart
                      dispatch(clearCart());
                      // Close the dialog
                      setIsOpen(false);
                      // Navigate to home page
                      navigate("/");
                    }}
                  >
                    Fermer
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Checkout Layout */}
      <div className="max-w-7xl mx-auto p-2 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ORDER FORM */}
        <div className="md:col-span-1 bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Informations de livraison</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom et Prénom
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse de livraison
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">
                Mode de paiement
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="flex items-center space-x-2">
                    <CreditCardIcon className="h-4 w-4" />
                    <span>Paiement à la livraison</span>
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#87a736] text-white py-3 rounded font-medium hover:bg-[#769030] transition"
            >
              Confirmer la commande
            </button>
          </form>
        </div>

        {/* CART SUMMARY */}
        <div className="md:col-span-1 bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Votre panier</h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Votre panier est vide.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`}
                className="border-b border-gray-200 py-2"
              >
                <div className="flex justify-between items-center pb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold line-clamp-2">
                        {item.name} x {item.quantity}
                      </p>{" "}
                      {item.selectedColor && (
                        <p className="text-sm text-gray-500">
                          Couleur: {item.selectedColor}
                        </p>
                      )}
                      {item.selectedSize && (
                        <p className="text-sm text-gray-500">
                          Taille: {item.selectedSize}
                        </p>
                      )}
                      <p className="text-gray-800 font-semibold">
                        {item.selectedSizePrice != null
                          ? item.selectedSizePrice
                          : item.price}{" "}
                        DT
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <div className="mt-4 py-4 bg-white rounded-lg max-w-full mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Sous-total</span>
                <span className="text-gray-600">{subtotal} DT</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Livraison</span>
                <span className="text-gray-600">{shipping} DT</span>
              </div>
              <div className="flex justify-between py-3 text-lg text-gray-900">
                <span>Total</span>
                <span>{total} DT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
