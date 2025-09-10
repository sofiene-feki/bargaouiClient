import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  HiOutlineX,
  HiOutlineCheck,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import ProductMediaGallery from "../components/product/ProductMediaGallery";
import { FaShippingFast } from "react-icons/fa";
import { createPack, getPack } from "../functions/pack";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/cart/cartSlice";
import { openCart } from "../redux/ui/cartDrawer";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Field,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { getAllProductTitles } from "../functions/product";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { Input, Textarea } from "../components/ui";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PackDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const modeFromState = location.state?.mode || "view";
  const [currentMode, setCurrentMode] = useState(modeFromState);
  const isEdit = currentMode === "edit";
  const isView = currentMode === "view";
  const isCreate = currentMode === "create";

  const API_BASE_URL_MEDIA = import.meta.env.VITE_API_BASE_URL_MEDIA;

  const emptyPack = {
    title: "",
    description: "",
    products: [], // will hold [{ _id, Title, slug, colors, sizes }]
    price: 0,
    media: [],
  };

  const [pack, setPack] = useState(isCreate ? emptyPack : null);
  const [loading, setLoading] = useState(true);

  // gallery
  const [selectedMedia, setSelectedMedia] = useState(null);

  // per-product user choices in VIEW mode
  // { [idx]: { color: <colorObj|null>, size: <string|null> } }
  const [selectedChoices, setSelectedChoices] = useState({});
  const dispatch = useDispatch();

  // media handlers
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const newMedia = {
      src: url,
      alt: file.name,
      type: file.type.includes("video") ? "video" : "image",
      file,
    };
    setPack((prev) => ({ ...prev, media: [...(prev.media || []), newMedia] }));
    setSelectedMedia(newMedia);
  };

  const deleteMedia = (idx) => {
    const updated = (pack.media || []).filter((_, i) => i !== idx);
    setPack((prev) => ({ ...prev, media: updated }));
    setSelectedMedia(updated[0] || null);
  };

  const handleBasicChange = (key, value) => {
    setPack((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", pack.title);
      formData.append("price", pack.price);
      formData.append("description", pack.description);
      formData.append("products", JSON.stringify(pack.products));

      if (pack.media && pack.media.length > 0) {
        pack.media.forEach((m) => formData.append("mediaFiles", m.file));
      }

      const { data } = await createPack(formData);
      console.log("✅ Pack created:", data);
    } catch (err) {
      console.error(
        "❌ Error creating pack:",
        err.response?.data || err.message
      );
    }
  };

  const normalizeMediaSrc = (pack) => {
    if (!pack) return pack;

    // Normalize pack media
    const normalizedMedia = (pack.media || []).map((m) => ({
      ...m,
      src: m.src.startsWith("http") ? m.src : API_BASE_URL_MEDIA + m.src,
    }));

    // Normalize each product's media
    const normalizedProducts = (pack.products || []).map((p) => {
      const normalizedProductMedia = (p.media || []).map((m) => ({
        ...m,
        src: m.src.startsWith("http") ? m.src : API_BASE_URL_MEDIA + m.src,
      }));

      return { ...p, media: normalizedProductMedia };
    });

    return { ...pack, media: normalizedMedia, products: normalizedProducts };
  };

  useEffect(() => {
    if (isCreate) {
      setLoading(false);
      return;
    }

    const fetchPack = async () => {
      try {
        setLoading(true);
        const { data } = await getPack(slug); // Axios call to /pack/:slug
        const normalizedPack = normalizeMediaSrc(data);
        setPack(normalizedPack);
        setSelectedMedia(normalizedPack.media?.[0]?.src || "");
        console.log("✅ Pack fetched:", normalizedPack);
      } catch (error) {
        console.error("❌ Error fetching pack:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPack();
  }, [slug, isCreate]);

  // update/edit
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", pack.title || "");
      formData.append("description", pack.description || "");
      formData.append("price", Number(pack.price) || 0);
      formData.append(
        "products",
        JSON.stringify(
          (pack.products || []).map((p) => ({
            title: p.title,
            color: p.color || [],
            sizes: p.sizes || [],
          }))
        )
      );

      const existingMedia = (pack.media || [])
        .filter((m) => !m.file && m.src)
        .map((m) => m.src);
      existingMedia.forEach((src) => formData.append("existingMedia[]", src));

      (pack.media || []).forEach(
        (m) => m?.file && formData.append("mediaFiles", m.file)
      );

      await updatePack(slug, formData);
      setCurrentMode("view");
    } catch (err) {
      console.error("❌ Error updating pack:", err);
    }
  };

  // delete
  const handleDelete = async () => {
    if (!window.confirm("Supprimer ce pack ?")) return;
    try {
      await removePack(slug);
      navigate("/packs");
    } catch (err) {
      console.error("❌ Error deleting pack:", err);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
      minimumFractionDigits: 3,
    }).format(price || 0);

  // selection helpers (VIEW mode)
  const selectColor = (prodIdx, colorObj) => {
    setSelectedChoices((prev) => ({
      ...prev,
      [prodIdx]: { ...(prev[prodIdx] || {}), color: colorObj },
    }));
  };
  const selectSize = (prodIdx, sizeStr) => {
    setSelectedChoices((prev) => ({
      ...prev,
      [prodIdx]: { ...(prev[prodIdx] || {}), size: sizeStr },
    }));
  };

  // ✅ require a color if that product has colors; require a size if it has sizes
  const allSelected =
    Array.isArray(pack?.products) &&
    pack.products.length > 0 &&
    pack.products.every((p, idx) => {
      const choice = selectedChoices[idx] || {};
      const colorOk =
        !Array.isArray(p.color) || p.color.length === 0 || !!choice.color;
      const sizeOk =
        !Array.isArray(p.sizes) || p.sizes.length === 0 || !!choice.size;
      return colorOk && sizeOk;
    });

  const handleAddPackToCart = () => {
    const cartPayload = {
      type: "pack", // helpful flag for your cart UI
      title: pack?.title || "",
      price: Number(pack?.price) || 0,
      description: pack?.description || "",
      media: {
        src: selectedMedia?.src || pack?.media?.[0]?.src || "", // a safe fallback
      },
      products: (pack?.products || []).map((p, idx) => {
        const choice = selectedChoices[idx] || {};
        return {
          title: p.title,
          // send the selected color; keep the whole object so you have name/value/src if needed
          color: choice.color
            ? {
                name: choice.color.name || "",
                // value: choice.color.value || "",
                // src: choice.color.src || "",
                // _id: choice.color._id ?? null,
                // type: choice.color.type || "image",
                // alt: choice.color.alt || ""
              }
            : null,
          // send the selected size string (if any)
          size: choice.size || null,
        };
      }),
    };

    // Send to cart
    dispatch(addItem(cartPayload));
    dispatch(openCart());
  };
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]); // all fetched titles
  const [selectedTitles, setSelectedTitles] = useState([]); // selected values

  // Fetch all product titles once
  useEffect(() => {
    setLoading(true);
    const fetchTitles = async () => {
      try {
        const res = await getAllProductTitles();
        setOptions(res);
      } catch (err) {
        console.error("❌ Error fetching titles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTitles();
  }, []);

  return (
    <div className="py-15 md:py-20 px-2">
      {/* Header actions */}
      <div className="flex bg-white max-w-7xl mx-auto items-center justify-between border-b border-gray-200 pb-2 mb-6">
        <h1 className="md:text-xl text-base font-semibold text-gray-800">
          {isCreate ? "Créer un pack" : isEdit ? "Modifier pack" : ""}
        </h1>
        <div className="flex gap-2">
          {isCreate || isEdit ? (
            <>
              <button
                onClick={() => {
                  if (currentMode === "create") navigate(-1);
                  if (currentMode === "edit") setCurrentMode("view");
                }}
                className="flex md:text-base text-xs items-center gap-1 md:px-4 px-2 md:py-2 py-1 
                  bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition
                  focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
              >
                <HiOutlineX className="h-5 w-5" />
                <span>Annuler</span>
              </button>

              <button
                onClick={handleSubmit}
                className="flex md:text-base text-xs items-center md:gap-2 gap-1 md:px-4 px-2 md:py-2 py-1 bg-green-50 text-green-600  
                  focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-400 
                  rounded-xl shadow-sm hover:bg-green-100 transition"
              >
                <HiOutlineCheck className="h-5 w-5" />
                <span>Enregistrer</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setCurrentMode("edit")}
                className="flex items-center md:text-base text-xs md:gap-2 gap-1 md:px-4 px-2 md:py-2 py-1 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-sm transition  focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400"
              >
                <HiOutlinePencil className="h-5 w-5" />
                <span>Modifier</span>
              </button>
              <button
                onClick={() => console.log(selectedMedia)}
                className="flex items-center md:text-base text-xs md:gap-2 gap-1 md:px-4 px-2 md:py-2 py-1 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 shadow-sm transition  focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400"
              >
                <HiOutlineTrash className="h-5 w-5" />
                <span>Supprimer</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto lg:flex lg:gap-12">
        {/* LEFT: Media gallery */}
        {loading ? (
          <div className="w-full h-[400px] lg:w-1/2 md:mb-6 lg:mb-0 bg-gray-200 rounded-lg animate-pulse" />
        ) : (
          <ProductMediaGallery
            media={pack?.media || []}
            selectedMedia={selectedMedia}
            onSelectMedia={setSelectedMedia}
            onAddMedia={handleFileUpload}
            onDeleteMedia={deleteMedia}
            isEditable={isEdit || isCreate}
          />
        )}

        {/* RIGHT: Pack Info */}
        <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
          {/* Title / Price / Desc */}
          {isEdit || isCreate ? (
            <>
              <Input
                label="Titre"
                type="text"
                value={pack?.title || ""}
                onChange={(e) => handleBasicChange("title", e.target.value)}
              />

              <Input
                label="Price"
                type="number"
                min="0"
                step="1"
                value={pack?.price || 0}
                onChange={(e) => handleBasicChange("price", e.target.value)}
              />

              <Textarea
                label="Description"
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                value={pack?.description || ""}
                onChange={(e) =>
                  handleBasicChange("description", e.target.value)
                }
              />
              <Field>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Produits
                </Label>
                <Listbox
                  value={selectedTitles}
                  onChange={(values) => {
                    setSelectedTitles(values);

                    // Only store the _id of selected products
                    const productIds = values.map((p) => p._id);

                    handleBasicChange("products", productIds);
                  }}
                  multiple
                >
                  {({ open }) => (
                    <div className="relative">
                      <ListboxButton className="relative w-full py-2 pl-3 pr-10 text-left transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <span
                          className={`block truncate ${
                            selectedTitles.length === 0 ? "text-gray-400" : ""
                          }`}
                        >
                          {selectedTitles.length === 0
                            ? "Please select an option"
                            : selectedTitles
                                .map((t) => t.Title || t.name)
                                .join(", ")}
                        </span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronUpDownIcon
                            className="w-5 h-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </ListboxButton>

                      {open && (
                        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
                          <ListboxOptions className="py-1 overflow-auto text-base leading-6 rounded-md shadow-xs max-h-60 focus:outline-none sm:text-sm sm:leading-5">
                            {options.map((title) => (
                              <ListboxOption key={title._id} value={title}>
                                {({ selected, active }) => (
                                  <div
                                    className={`${
                                      selected && active
                                        ? "bg-gray-700 text-white"
                                        : selected
                                        ? "bg-gray-200 text-gray-900"
                                        : active
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-900"
                                    } cursor-default select-none relative py-2 pl-3 pr-9`}
                                  >
                                    <span
                                      className={`${
                                        selected
                                          ? "font-semibold"
                                          : "font-normal"
                                      } block truncate`}
                                    >
                                      {title.Title || title.name}
                                    </span>

                                    {selected && (
                                      <span
                                        className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                          active
                                            ? "text-white"
                                            : "text-indigo-600"
                                        }`}
                                      >
                                        <CheckIcon
                                          className="w-5 h-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    )}
                                  </div>
                                )}
                              </ListboxOption>
                            ))}
                          </ListboxOptions>
                        </div>
                      )}
                    </div>
                  )}
                </Listbox>
              </Field>
            </>
          ) : (
            <>
              <>
                {loading ? (
                  <div className="h-8 mb-2 w-3/4 bg-gray-200 rounded-lg animate-pulse"></div>
                ) : (
                  <h1 className="text-2xl break-words bg-clip-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] font-bold text-gray-900 sm:text-3xl mb-2">
                    {pack?.title}
                  </h1>
                )}

                {loading ? (
                  <div className="h-8 mb-2 w-1/4 bg-gray-200 rounded-lg animate-pulse"></div>
                ) : (
                  <p className="text-3xl flex border-b border-gray-200 justify-between font-bold break-words bg-clip-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] text-gray-900 mb-3">
                    <span>{formatPrice(pack?.price)}</span>
                    <span className="flex items-center gap-2">
                      {pack?.price > 0 ? (
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
              </>
              {pack?.products?.map((product, pi) => (
                <div
                  key={pi}
                  className="flex flex-col md:flex-row gap-4 items-start mb-6"
                >
                  {/* Media column: only first image */}
                  {product.media?.[0] && (
                    <img
                      src={product.media[0].src}
                      alt={product.media[0].alt || "media"}
                      className="w-auto h-52 object-cover rounded-md"
                    />
                  )}

                  {/* Info column */}
                  <div className="flex-1 flex flex-col gap-2">
                    {/* Product title */}
                    <h2 className="text-lg font-semibold">{product.Title}</h2>

                    {/* Product colors */}
                    {product.colors?.length > 0 && (
                      <div className="flex gap-3">
                        {product.colors.map((c, ci) => (
                          <button
                            key={ci}
                            className="w-12 h-12 rounded-full border overflow-hidden flex-shrink-0"
                            style={{ borderColor: c.value ?? "#000" }}
                          >
                            {c.src ? (
                              <img
                                src={c.src}
                                alt={c.alt || c.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <div
                                className="w-full h-full rounded-full"
                                style={{ backgroundColor: c.value ?? "#000" }}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Product sizes */}
                    {product.sizes?.length > 0 && (
                      <div className="grid md:grid-cols-4 grid-cols-3 gap-2 mt-2">
                        {product.sizes.map((s, si) => (
                          <button
                            key={si}
                            className="border rounded-md px-2 py-1 text-xs font-medium hover:border-[#87a736]"
                          >
                            {s.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
