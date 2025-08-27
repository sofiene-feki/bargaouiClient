import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  setCurrentPage,
  setProductsPerPage,
  setSortOption,
} from "../redux/shopFilters/pageOptions";
import { useParams } from "react-router-dom";
import Filters from "../components/shop/filters";
import Header from "../components/shop/header";
//import { products } from "../constants/products";
import Product from "../components/product/Product";
import Pagination from "../components/shop/Pagination";
import { getProducts } from "../functions/product";
import { LoadingProduct } from "../components/ui";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState();
  const [totalPages, setTotalPages] = useState();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const params = useParams(); // grabs route params

  const formattedCategory = "";
  const view = useSelector((state) => state.view.view);
  const { currentPage, productsPerPage, sortOption } = useSelector(
    (state) => state.pageOptions
  );
  const filter = useSelector((state) => state.filters);

  const dispatch = useDispatch();
  //const totalProducts = products.length;
  // const pageCount = Math.ceil(totalProducts / productsPerPage);

  // // Sort your products based on sortOption here before slicing
  // //const sortedProducts = sortProducts(products, sortOption);

  // const paginatedProducts = products.slice(
  //   currentPage * productsPerPage,
  //   (currentPage + 1) * productsPerPage
  // );

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const start = currentPage * productsPerPage + 1;
  const end = Math.min((currentPage + 1) * productsPerPage, totalProducts);

  const SERVER_URL = "https://bargaouiserver.onrender.com";

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
        const { data } = await getProducts({
          page: currentPage,
          itemsPerPage: productsPerPage,
          sort: sortOption,
          filters: filter.selected,
        });

        const normalizedProducts = normalizeMediaSrc(data.products); // normalize all products
        setProducts(normalizedProducts);
        setTotalPages(data.totalPages);
        setTotalProducts(data.total);
        console.log("✅ Products fetched and normalized:", normalizedProducts);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, productsPerPage, sortOption, filter]);

  // Reset currentPage when filters change
  useEffect(() => {
    dispatch(setCurrentPage(0));
  }, [filter.selected, dispatch]);

  useEffect(() => {
    console.log(params, "paramssssss");
  }, [params]);

  return (
    <div>
      <div>
        <main className="mx-auto max-w-7xl  px-4 py-10 sm:px-6 lg:px-8">
          <Header
            setMobileFiltersOpen={setMobileFiltersOpen}
            formattedCategory={formattedCategory}
            totalProducts={totalProducts}
          />

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <Filters
                mobileFiltersOpen={mobileFiltersOpen}
                setMobileFiltersOpen={setMobileFiltersOpen}
              />

              {/* Product grid */}
              {loading ? (
                <div className="lg:col-span-3">
                  {" "}
                  <LoadingProduct length={9} cols={3} />
                </div>
              ) : (
                <>
                  {" "}
                  <div className="lg:col-span-3">
                    <div
                      className={
                        view === "list"
                          ? " flex flex-col space-y-4"
                          : " grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 xl:gap-x-8"
                      }
                    >
                      {products?.map((product) => (
                        <Product
                          key={product._id}
                          product={product}
                          loading={loading}
                          productsPerPage={productsPerPage}
                        />
                      ))}
                    </div>{" "}
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
                </>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
