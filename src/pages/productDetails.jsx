import React, { useEffect, useState } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { products } from "../constants/products";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../redux/cart/cartSlice";
import { openCart } from "../redux/ui/cartDrawer";
import {
  HiOutlineX,
  HiOutlineCheck,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import ProductMediaGallery from "../components/product/ProductMediaGallery";
import ProductInfoForm from "../components/product/ProductInfoForm";
import ProductSizesEditor from "../components/product/ProductSizesEditor";
import ProductColorsEditor from "../components/product/ProductColorsEditor";
import {
  getProduct,
  productCreate,
  removeProduct,
  updateProduct,
} from "../functions/product";
import { FormatDescription } from "../components/ui"; // Assuming you have this utility function
import { FaShippingFast } from "react-icons/fa";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetails() {
  const { slug } = useParams(); // 👈 make sure your route param is `:slug`
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);
  const navigate = useNavigate();
  const location = useLocation();

  const modeFromState = location.state?.mode || "view"; // default is view
  const [currentMode, setCurrentMode] = useState(modeFromState);

  const isEdit = currentMode === "edit";
  const isView = currentMode === "view";
  const isCreate = currentMode === "create";

  const emptyProduct = {
    Title: "",
    price: 0,
    promotion: 0,
    Quantity: 0,
    sold: 0,
    Description: "",
    category: "",
    subCategory: "",
    media: [],
    colors: [],
    sizes: [],
  };

  const [product, setProduct] = useState(isCreate ? emptyProduct : null);
  const [loading, setLoading] = useState(true);

  const SERVER_URL = "http://localhost:8000";

  // Normalize both media and colors
  const normalizeMediaSrc = (product) => {
    if (!product) return product;

    const normalizedMedia = (product.media || []).map((m) => ({
      ...m,
      src: m.src.startsWith("http") ? m.src : SERVER_URL + m.src,
    }));

    const normalizedColors = (product.colors || []).map((c) => ({
      ...c,
      src: c.src && !c.src.startsWith("http") ? SERVER_URL + c.src : c.src,
    }));

    return { ...product, media: normalizedMedia, colors: normalizedColors };
  };

  useEffect(() => {
    setLoading(true);

    const fetchProduct = async () => {
      try {
        if (!isCreate) {
          const { data } = await getProduct(slug);
          const normalizedProduct = normalizeMediaSrc(data);
          setProduct(normalizedProduct);

          // Default selections
          setSelectedColor(normalizedProduct.colors?.[0] || null);
          setSelectedMedia(
            normalizedProduct.colors?.[0]?.src ||
              normalizedProduct.media?.[0]?.src ||
              ""
          );

          console.log("✅ Product fetched:", normalizedProduct);
        }
      } catch (error) {
        console.error("❌ Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [isCreate, slug]);

  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Keep selections in sync when product changes
  useEffect(() => {
    if (product) {
      setSelectedMedia(product?.media?.[0] || null);
      setSelectedColor(product?.colors?.[0] || null);
      setSelectedSize(product?.sizes?.[0] || null);
    }
  }, [product]);

  const handleAddToCart = () => {
    dispatch(
      addItem({
        productId: product._id,
        name: product.Title,
        price: selectedSize?.price ?? product.Price,
        image: selectedMedia?.src,
        selectedSize: selectedSize?.name ?? null,
        selectedSizePrice: selectedSize?.price ?? null,
        selectedColor: selectedColor?.name ?? null,
        colors: product.colors,
        sizes: product.sizes,
      })
    );
    dispatch(openCart());
  };

  // Media functions
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    const newMedia = {
      src: url, // preview for UI
      alt: file.name,
      type: file.type.includes("video") ? "video" : "image",
      file: file, // ✅ store actual File object
    };

    setProduct((prev) => ({ ...prev, media: [...prev.media, newMedia] }));
    setSelectedMedia(newMedia);
  };

  const deleteMedia = (idx) => {
    const updatedMedia = product.media.filter((_, i) => i !== idx);
    setProduct((prev) => ({ ...prev, media: updatedMedia }));
    setSelectedMedia(updatedMedia[0] || null);
  };

  // Generic handler for colors/sizes
  const handleChangeProduct = (e, idx, key, type) => {
    const value = e.target.value;
    setProduct((prev) => ({
      ...prev,
      [type]: prev[type].map((item, i) =>
        i === idx ? { ...item, [key]: value } : item
      ),
    }));
    console.log(`Updated `, product);
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("Title", product.Title);
    formData.append("Price", Number(product.price));
    formData.append("Promotion", Number(product.promotion));
    formData.append("Description", product.Description);
    formData.append("Category", product.category);
    formData.append("subCategory", product.subCategory);
    formData.append("Quantity", product.Quantity);
    formData.append("sold", product.sold);

    // Prepare colors without src (server will set it)
    const colorsPayload = product.colors.map((c) => ({
      name: c.name,
      value: c.value,
      type: c.type || "image",
      alt: c.alt || "",
    }));
    formData.append("colors", JSON.stringify(colorsPayload));

    // Append files for each color
    product.colors.forEach((c) => {
      if (c.file) formData.append("colorFiles", c.file);
    });

    // Append media files if any
    product.media?.forEach((m) => {
      if (m.file) formData.append("mediaFiles", m.file);
    });

    await productCreate(formData);
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      // -------------------------
      // Basic fields
      // -------------------------
      formData.append("Title", product.Title || "");
      formData.append("Price", Number(product.Price) || 0);
      formData.append("promotion", Number(product.promotion) || 0);
      formData.append("Description", product.Description || "");
      formData.append("Quantity", product.Quantity);
      formData.append("sold", product.sold);
      if (product.category) formData.append("Category", product.category);

      // -------------------------
      // Colors (send as indexed fields)
      // -------------------------
      if (Array.isArray(product.colors)) {
        product.colors.forEach((c, i) => {
          if (c.name) formData.append(`colors[${i}][name]`, c.name);
          if (c.value) formData.append(`colors[${i}][value]`, c.value);
        });
      }

      // -------------------------
      // Sizes (send as indexed fields)
      // -------------------------
      if (Array.isArray(product.sizes)) {
        product.sizes.forEach((s, i) => {
          if (s.name) formData.append(`sizes[${i}][name]`, s.name);
          if (s.price !== undefined)
            formData.append(`sizes[${i}][price]`, Number(s.price));
        });
      }

      // -------------------------
      // Media handling
      // -------------------------
      const existingMediaIds = product.media
        .filter((m) => m._id && !m.file) // keep only DB media
        .map((m) => m._id);

      const newFiles = product.media.filter((m) => m.file); // new uploads

      console.log("🖼️ Full media array:", product.media);
      console.log("📌 Existing media IDs to keep:", existingMediaIds);
      console.log("🆕 New media files to upload:", newFiles);

      // Append new files
      newFiles.forEach((m, idx) => {
        console.log(`✅ Appending new media file ${idx}:`, m.file.name);
        formData.append("mediaFiles", m.file);
      });

      // Append existing media IDs as repeated fields
      existingMediaIds.forEach((id) =>
        formData.append("existingMediaIds[]", id)
      );

      // -------------------------
      // Optional single files
      // -------------------------
      if (product.imageFile) formData.append("imageFile", product.imageFile);
      if (product.pdf) formData.append("pdf", product.pdf);
      if (product.video) formData.append("video", product.video);

      // -------------------------
      // Debug FormData contents
      // -------------------------
      console.log("📦 FormData contents before sending:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      }

      // -------------------------
      // Send to server
      // -------------------------
      const res = await updateProduct(slug, formData);
      console.log("✅ Product updated:", res.data);

      setCurrentMode("view");
    } catch (err) {
      console.error(
        "❌ Error updating product:",
        err.response?.data || err.message
      );
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await removeProduct(slug);

      // update UI by filtering out deleted product
      //  setProducts((prev) => prev.filter((p) => p.slug !== slug));

      alert("✅ Product deleted successfully");
    } catch (error) {
      console.error("❌ Failed to delete product:", error);
      alert("Failed to delete product");
    }
    navigate("/shop"); // redirect to shop page
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
      minimumFractionDigits: 3,
    }).format(price);
  };

  return (
    <div className="py-4 md:py-10 px-4 sm:px-6 lg:px-8">
      {user && (
        <div className="flex  bg-white max-w-7xl mx-auto items-center justify-between border-b border-gray-200 pb-4 mb-6">
          {/* Center title */}
          <h1 className="md:text-xl text-base font-semibold text-gray-800">
            {isCreate ? "Créer un produit" : isEdit ? "Modifier produit" : ""}
          </h1>

          {/* Right actions (only if user is logged in) */}

          <div className="flex gap-2">
            {isCreate || isEdit ? (
              <>
                {/* Cancel */}
                <button
                  onClick={() => {
                    if (currentMode === "create") {
                      navigate(-1);
                    } else if (currentMode === "edit") {
                      setCurrentMode("view");
                    }
                  }}
                  className="flex items-center gap-1 md:px-4 px-2 md:py-2 py-1 
                       bg-gray-200 text-gray-700 rounded-lg 
                       hover:bg-gray-300 transition 
                       focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
                >
                  <HiOutlineX className="h-5 w-5" />
                  <span>Annuler</span>
                </button>

                {/* Save */}
                {/* Save */}
                <button
                  onClick={() => {
                    if (currentMode === "create") {
                      handleSubmit(); // 👉 create product
                    } else if (currentMode === "edit") {
                      handleUpdate(); // 👉 update product
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600  
             focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-400 
             rounded-xl shadow-sm hover:bg-green-100 transition"
                >
                  <HiOutlineCheck className="h-5 w-5" />
                  <span>Enregistrer</span>
                </button>
              </>
            ) : (
              <>
                {/* Edit */}
                <button
                  onClick={() => setCurrentMode("edit")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-sm transition  focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400"
                >
                  <HiOutlinePencil className="h-5 w-5" />
                  <span>Modifier</span>
                </button>

                {/* Delete */}
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 shadow-sm transition  focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400"
                >
                  <HiOutlineTrash className="h-5 w-5" />
                  <span>Supprimer</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto lg:flex lg:gap-12">
        {/* LEFT: Media gallery */}
        {loading ? (
          <div className=" w-full h-[400px] lg:w-1/2 md:mb-6  lg:mb-0 bg-gray-200 rounded-lg animate-pulse"></div>
        ) : (
          <ProductMediaGallery
            media={product?.media} // pass media array directly
            selectedMedia={selectedMedia} // currently selected
            onSelectMedia={setSelectedMedia} // when clicking thumbnail
            onAddMedia={handleFileUpload} // upload handler
            onDeleteMedia={deleteMedia} // delete handler
            isEditable={isEdit || isCreate} // edit/create flag
          />
        )}

        {/* RIGHT: Product Info */}
        <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
          {/* Name, Price, Description */}
          {isEdit || isCreate ? (
            <>
              <ProductInfoForm product={product} setProduct={setProduct} />
            </>
          ) : (
            <>
              {loading ? (
                <div className=" h-8 mb-2 w-3/4 bg-gray-200 rounded-lg animate-pulse"></div>
              ) : (
                <h1 className="text-2xl  break-words bg-clip-text  drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] font-bold text-gray-900 sm:text-3xl mb-2">
                  {product.Title}
                </h1>
              )}

              {loading ? (
                <div className=" h-8 mb-2 w-1/4 bg-gray-200 rounded-lg animate-pulse"></div>
              ) : (
                <p className="text-3xl md:flex border-b border-gray-200  justify-between font-bold break-words bg-clip-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] text-gray-900 mb-3">
                  <span>
                    {formatPrice(selectedSize?.price ?? product.Price)}
                  </span>
                  <span className="flex items-center gap-2">
                    {product.Quantity > 0 ? (
                      <span className="text-green-600 text-xs font-semibold">
                        En stock
                      </span>
                    ) : (
                      <span className="text-red-500 text-xs line-through">
                        Rupture de stock
                      </span>
                    )}
                    <FaShippingFast className="text-[#2c2d84] md:w-6 md:h-6 w-5 h-5 ml-3" />
                    <span className="text-xs text-[#2c2d84]">
                      Livraison rapide
                    </span>
                  </span>
                </p>
              )}

              <div className="mb-4">
                {" "}
                <h3 className="font-semibold  break-words bg-clip-text  drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  Description :
                </h3>
                {loading ? (
                  <div className=" h-16 md:h-24 mb-2  w-full bg-gray-200 rounded-lg animate-pulse"></div>
                ) : (
                  <p
                    className=" text-[16px] text-gray-500 whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: FormatDescription(product.Description),
                    }}
                  />
                )}
              </div>
            </>
          )}

          {/* Sizes */}
          <div className="mb-4">
            {product?.sizes && product.sizes.length > 0 && (
              <h3 className="font-semibold  break-words bg-clip-text  drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] mb-1">
                Tailles & Prix
              </h3>
            )}
            <h3 className="font-semibold  break-words bg-clip-text  drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]  mb-1"></h3>
            {isEdit || isCreate ? (
              <ProductSizesEditor
                product={product}
                setProduct={setProduct}
                handleChangeProduct={handleChangeProduct}
              />
            ) : loading ? (
              <div className="h-16 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            ) : (
              <div className="grid md:grid-cols-4 grid-cols-3 gap-2 mt-2">
                {product.sizes.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(s)}
                    className={classNames(
                      selectedSize?.name === s.name
                        ? "border-[#87a736] bg-[#87a736] text-white"
                        : "border-gray-300 bg-white text-gray-900",
                      "border rounded-md px-2 py-2 text-xs font-medium hover:border-[#87a736]"
                    )}
                  >
                    {s.name} - {s.price ?? product.price} DT
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Colors */}
          <div className="mb-6">
            {product?.colors && product.colors.length > 0 && (
              <h3 className="font-semibold  break-words bg-clip-text  drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] mb-1">
                Couleurs
              </h3>
            )}

            {isEdit || isCreate ? (
              <ProductColorsEditor
                product={product}
                setProduct={setProduct}
                handleChangeProduct={handleChangeProduct}
              />
            ) : loading ? (
              <div className="h-16 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            ) : (
              <div className="flex gap-3 mt-2">
                {product.colors?.map((c, i) => (
                  <button
                    key={i}
                    style={{ backgroundColor: c.value ?? "#000" }}
                    className={classNames(
                      selectedColor?.name === c.name
                        ? "ring-2 ring-[#87a736] ring-offset-2"
                        : "ring-1 ring-gray-300",
                      "w-8 h-8 rounded-full border border-gray-200"
                    )}
                    onClick={() => {
                      setSelectedColor(c); // select color
                      if (c?.src) setSelectedMedia(c); // update gallery to color image
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Add to Cart */}
          {isView && (
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-4 rounded-md bg-[#87a736] px-6 py-3 text-white font-semibold hover:bg-[#87a736] transition"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              Ajouter au panier
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
