import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getProductsByCategory } from "../functions/product";
import Header from "../components/shop/header";
import Filters from "../components/shop/filters";
import Product from "../components/product/Product";
import Pagination from "../components/shop/Pagination";
import { setCurrentPage } from "../redux/shopFilters/pageOptions";
import { LoadingProduct } from "../components/ui";

export default function Category() {
  const { Category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { currentPage, productsPerPage, sortOption } = useSelector(
    (state) => state.pageOptions
  );
  const view = useSelector((state) => state.view.view);
  const dispatch = useDispatch();

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const SERVER_URL = "https://supersiesta-server-i63m.onrender.com";

  // Normalize single product or array of products
  const normalizeMediaSrc = (input) => {
    if (!input) return input;

    if (Array.isArray(input)) {
      return input.map((product) => normalizeMediaSrc(product));
    }

    if (!input.media) return input;

    const normalizedMedia = input.media.map((m) => ({
      ...m,
      src: m.src.startsWith("http") ? m.src : SERVER_URL + m.src,
    }));

    return { ...input, media: normalizedMedia };
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProductsByCategory({
          category: Category,
          page: currentPage,
          itemsPerPage: productsPerPage,
          sort: sortOption,
        });

        const normalizedProducts = normalizeMediaSrc(data.products || []);
        setProducts(normalizedProducts);
        setTotalProducts(data.total);
        setTotalPages(data.totalPages);

        console.log("✅ Products fetched and normalized:", normalizedProducts);
      } catch (error) {
        console.error("❌ Error fetching products by category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [Category, currentPage, productsPerPage, sortOption]);

  const start = currentPage * productsPerPage + 1;
  const end = Math.min((currentPage + 1) * productsPerPage, totalProducts);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Header
        setMobileFiltersOpen={setMobileFiltersOpen}
        formattedCategory={Category}
        totalProducts={totalProducts}
      />

      <section aria-labelledby="products-heading" className="pt-6 pb-24">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          <Filters
            mobileFiltersOpen={mobileFiltersOpen}
            setMobileFiltersOpen={setMobileFiltersOpen}
          />
          {loading ? (
            <div className="lg:col-span-3">
              {" "}
              <LoadingProduct length={3} cols={3} />
            </div>
          ) : (
            <div className="lg:col-span-3">
              <div
                className={
                  view === "list"
                    ? "flex flex-col space-y-4"
                    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 xl:gap-x-8"
                }
              >
                {products.map((product) => (
                  <Product
                    key={product._id}
                    product={product}
                    loading={loading}
                    productsPerPage={productsPerPage}
                  />
                ))}
              </div>
              <div className="flex justify-between items-center mt-8">
                <Pagination
                  currentPage={currentPage}
                  pageCount={totalPages}
                  onPageChange={handlePageChange}
                />
                <p className="text-gray-500 mt-8">
                  {start} à {end} sur {totalProducts} produits
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
