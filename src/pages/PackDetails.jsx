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
import { getPack, packCreate, updatePack, removePack } from "../functions/pack";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/cart/cartSlice";
import { openCart } from "../redux/ui/cartDrawer";

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

  const SERVER_URL = "";

  const emptyPack = {
    title: "",
    description: "",
    products: [], // [{ title, color: [objects], sizes: [strings] }]
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

  const normalizeMediaSrc = (p) => {
    if (!p) return p;

    const rawMedia = Array.isArray(p.media)
      ? p.media
      : p.media
      ? [p.media]
      : [];
    const normalizedMedia = rawMedia.map((m) => ({
      ...m,
      src: m?.src?.startsWith("http")
        ? m.src
        : m?.src
        ? SERVER_URL + m.src
        : m?.src,
    }));

    const normalizedProducts = (p.products || []).map((prod) => {
      const normColors = (prod.color || []).map((c) => ({
        ...c,
        src: c?.src && !c.src.startsWith("http") ? SERVER_URL + c.src : c?.src,
      }));
      return { ...prod, color: normColors };
    });

    return { ...p, media: normalizedMedia, products: normalizedProducts };
  };

  useEffect(() => {
    const fetchPack = async () => {
      try {
        setLoading(true);
        if (!isCreate) {
          const { data } = await getPack(slug);
          const normalized = normalizeMediaSrc(data);
          setPack(normalized);
          setSelectedMedia(normalized.media?.[0] || null);
          setSelectedChoices({}); // ✅ reset selections on load
        } else {
          setPack(emptyPack);
          setSelectedMedia(null);
          setSelectedChoices({});
        }
      } catch (err) {
        console.error("❌ Error fetching pack:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreate, slug]);

  useEffect(() => {
    if (pack) setSelectedMedia(pack.media?.[0] || null);
  }, [pack]);

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

  // basic inputs
  const handleBasicChange = (key, value) => {
    setPack((prev) => ({ ...prev, [key]: value }));
  };

  // submit/create
  const handleSubmit = async () => {
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
      (pack.media || []).forEach(
        (m) => m?.file && formData.append("mediaFiles", m.file)
      );

      const existingMedia = (pack.media || [])
        .filter((m) => !m.file && m.src)
        .map((m) => m.src);
      existingMedia.forEach((src) => formData.append("existingMedia[]", src));

      const res = await packCreate(formData);
      navigate(`/packs/${res.data.slug}`, { replace: true });
    } catch (err) {
      console.error("❌ Error creating pack:", err);
    }
  };

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
                onClick={() => (isCreate ? handleSubmit() : handleUpdate())}
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
                onClick={handleDelete}
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
              <label className="block text-sm font-medium text-gray-700">
                Titre
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2 mt-1 mb-3"
                value={pack?.title || ""}
                onChange={(e) => handleBasicChange("title", e.target.value)}
              />

              <label className="block text-sm font-medium text-gray-700">
                Prix (TND)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                className="w-full border border-gray-300 rounded-lg p-2 mt-1 mb-3"
                value={pack?.price || 0}
                onChange={(e) => handleBasicChange("price", e.target.value)}
              />

              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                value={pack?.description || ""}
                onChange={(e) =>
                  handleBasicChange("description", e.target.value)
                }
              />
            </>
          ) : (
            <>
              {loading ? (
                <div className="h-8 mb-2 w-3/4 bg-gray-200 rounded-lg animate-pulse" />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-2">
                  {pack?.title}
                </h1>
              )}

              <p className="text-3xl md:flex border-b border-gray-200 justify-between font-bold text-gray-900 mb-3">
                <span>{formatPrice(pack?.price)}</span>
                <span className="flex items-center gap-2">
                  <FaShippingFast className="text-[#2c2d84] md:w-6 md:h-6 w-5 h-5 ml-3" />
                  <span className="text-xs text-[#2c2d84]">
                    Livraison rapide
                  </span>
                </span>
              </p>

              <div className="mb-4">
                <h3 className="font-semibold">Description :</h3>
                <p className="text-[16px] text-gray-500 whitespace-pre-line">
                  {pack?.description || ""}
                </p>
              </div>
            </>
          )}

          {/* Products inside the pack */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Produits du pack</h3>

            {loading ? (
              <div className="h-20 w-full bg-gray-200 rounded-lg animate-pulse" />
            ) : (pack?.products || []).length === 0 ? (
              <p className="text-gray-500 text-sm">
                Aucun produit dans ce pack.
              </p>
            ) : (
              <div className="space-y-4">
                {(pack.products || []).map((p, idx) => {
                  const choice = selectedChoices[idx] || {
                    color: null,
                    size: null,
                  };

                  return (
                    <div
                      key={idx}
                      className="rounded-lg border border-gray-200 p-3"
                    >
                      <div className="font-medium">{p.title}</div>

                      {/* VIEW MODE: selectable colors */}
                      {!isEdit &&
                        !isCreate &&
                        Array.isArray(p.color) &&
                        p.color.length > 0 && (
                          <>
                            <div className="text-sm text-gray-600 mt-2 mb-1">
                              Couleurs
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {p.color.map((c, i) => {
                                const hasImg = !!c.src;
                                const bg = c.value || "#000";
                                const isActive = choice.color
                                  ? choice.color._id && c._id
                                    ? choice.color._id === c._id
                                    : (choice.color.name || "") ===
                                      (c.name || "")
                                  : false;

                                return (
                                  <button
                                    type="button"
                                    key={i}
                                    title={c.name}
                                    onClick={() => selectColor(idx, c)}
                                    className={classNames(
                                      "inline-flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full ring-1 ring-gray-300 overflow-hidden",
                                      isActive
                                        ? "outline outline-2 outline-[#87a736] outline-offset-2"
                                        : ""
                                    )}
                                    style={{
                                      backgroundColor: hasImg ? c.value : bg,
                                    }}
                                  >
                                    {hasImg ? (
                                      <img
                                        src={c.src}
                                        alt={c.alt || c.name || "color"}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : null}
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        )}

                      {/* EDIT/CREATE: display-only chips */}
                      {(isEdit || isCreate) &&
                        Array.isArray(p.color) &&
                        p.color.length > 0 && (
                          <>
                            <div className="text-sm text-gray-600 mt-2 mb-1">
                              Couleurs
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {p.color.map((c, i) => {
                                const hasImg = !!c.src;
                                const bg = c.value || "#000";
                                return (
                                  <div
                                    key={i}
                                    className="flex items-center gap-2"
                                  >
                                    <span
                                      title={c.name}
                                      style={{
                                        backgroundColor: hasImg
                                          ? undefined
                                          : bg,
                                      }}
                                      className="inline-flex items-center justify-center w-7 h-7 rounded-full ring-1 ring-gray-300 overflow-hidden"
                                    >
                                      {hasImg ? (
                                        <img
                                          src={c.src}
                                          alt={c.alt || c.name || "color"}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : null}
                                    </span>
                                    <span className="text-xs text-gray-700">
                                      {c.name}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        )}

                      {/* VIEW MODE: selectable sizes */}
                      {!isEdit &&
                        !isCreate &&
                        Array.isArray(p.sizes) &&
                        p.sizes.length > 0 && (
                          <>
                            <div className="text-sm text-gray-600 mt-3 mb-1">
                              Tailles
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {p.sizes.map((s, i) => {
                                const active = choice.size === s;
                                return (
                                  <button
                                    type="button"
                                    key={i}
                                    onClick={() => selectSize(idx, s)}
                                    className={classNames(
                                      "border rounded-md px-2 py-1 text-xs",
                                      active
                                        ? "border-[#87a736] bg-[#87a736] text-white"
                                        : "border-gray-300 bg-white text-gray-900 hover:border-[#87a736]"
                                    )}
                                  >
                                    {s}
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        )}

                      {/* EDIT/CREATE: display-only sizes */}
                      {(isEdit || isCreate) &&
                        Array.isArray(p.sizes) &&
                        p.sizes.length > 0 && (
                          <>
                            <div className="text-sm text-gray-600 mt-3 mb-1">
                              Tailles
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {p.sizes.map((s, i) => (
                                <span
                                  key={i}
                                  className="border border-gray-300 bg-white text-gray-900 rounded-md px-2 py-1 text-xs"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ✅ View mode: Add Pack to Cart (enabled only when all selections are done) */}
          {isView && (pack?.products || []).length > 0 && (
            <button
              type="button"
              onClick={handleAddPackToCart}
              disabled={!allSelected}
              className={classNames(
                "w-full mt-6 flex items-center justify-center gap-4 rounded-md px-6 py-3 font-semibold transition",
                allSelected
                  ? "bg-[#87a736] text-white hover:bg-[#6d8a2b]"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              )}
              title={
                allSelected
                  ? "Ajouter ce pack au panier"
                  : "Sélectionnez une couleur et une taille pour chaque produit (si disponibles)"
              }
            >
              Ajouter le pack au panier
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
