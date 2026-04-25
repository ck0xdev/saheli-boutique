import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { Link } from "react-router-dom";
import { getCloudinaryUrl } from "../utils/cloudinary";

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white border border-borderSoft rounded-soft overflow-hidden shadow-card">
      <div className="aspect-[3/4] skeleton" />
      <div className="p-6 space-y-3">
        <div className="h-4 skeleton rounded-soft w-3/4 mx-auto" />
        <div className="h-3 skeleton rounded-soft w-1/2 mx-auto" />
      </div>
    </div>
  );
}

function TagBadge({ tag }) {
  if (!tag || tag === "Regular Product") return null;
  return (
    <span className="bg-white/90 backdrop-blur-sm text-[9px] font-sans font-bold uppercase tracking-widest px-3 py-1 rounded-soft shadow-sm text-accent">
      {tag}
    </span>
  );
}

async function fetchProducts() {
  const snap = await getDocs(collection(db, "products_saheli"));
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export default function Shop() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [specialTag, setSpecialTag] = useState("all");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const filtered = products.filter((p) => {
    const matchCat = category === "all" || p.category === category;
    const matchPrice = (p.priceValue || 0) <= Number(maxPrice);
    const matchTag = specialTag === "all" || p.tag === specialTag;
    return matchCat && matchPrice && matchTag;
  });

  const resetFilters = () => {
    setCategory("all");
    setMaxPrice(10000);
    setSpecialTag("all");
  };
  const categories = ["all", "art", "extensions", "academy"];
  const tags = ["all", "Best Seller", "Selling of the Month", "New Arrival"];
  const categoryLabels = {
    all: "Everything",
    art: "Nail Art",
    extensions: "Nail Extensions",
    academy: "Academy",
  };

  return (
    <div className="bg-bgBase min-h-screen font-sans">
      <header className="py-20 border-b border-borderSoft/40 bg-white text-center animate-fade-in">
        <span className="label text-accent mb-4">The Collection</span>
        <h1 className="text-4xl md:text-5xl font-serif text-textMain tracking-tight leading-tight">
          Product Collection
        </h1>
        <p className="mt-4 text-textMuted font-light text-sm">
          {products.length > 0 ? `${products.length} products available` : ""}
        </p>
      </header>

      <div className="w-[90%] max-w-[1400px] mx-auto py-12 flex flex-col lg:flex-row gap-12">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden w-full card p-4 text-[10px] font-bold uppercase tracking-widest text-textMain flex items-center justify-center gap-2"
        >
          {isSidebarOpen ? "Hide Filters" : "Show Filters"}
        </button>

        <aside
          className={`lg:w-72 space-y-6 ${isSidebarOpen ? "block" : "hidden"} lg:block flex-shrink-0`}
        >
          <div className="card p-8">
            <h3 className="label border-b border-borderSoft pb-3 mb-5">
              Category
            </h3>
            <div className="flex flex-col gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-sm text-left capitalize transition-colors font-sans ${category === cat ? "text-accent font-semibold" : "text-textMuted hover:text-textMain"}`}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>
          <div className="card p-8">
            <h3 className="label border-b border-borderSoft pb-3 mb-5">
              Max Price
            </h3>
            <input
              type="range"
              min="500"
              max="10000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full accent-accent cursor-pointer mb-4"
            />
            <div className="flex justify-between text-xs text-textMuted font-sans">
              <span>₹500</span>
              <span className="text-accent font-bold">
                ₹{Number(maxPrice).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          <div className="card p-8">
            <h3 className="label border-b border-borderSoft pb-3 mb-5">
              Collections
            </h3>
            <div className="flex flex-col gap-3">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSpecialTag(tag)}
                  className={`text-sm text-left transition-colors font-sans ${specialTag === tag ? "text-accent font-semibold" : "text-textMuted hover:text-textMain"}`}
                >
                  {tag === "all" ? "Everything" : tag}
                </button>
              ))}
            </div>
          </div>
          {(category !== "all" ||
            Number(maxPrice) < 10000 ||
            specialTag !== "all") && (
            <button
              onClick={resetFilters}
              className="w-full text-xs text-status-error font-sans font-bold uppercase tracking-widest border border-status-error/20 bg-status-error/5 py-3 rounded-soft hover:bg-status-error/10 transition-colors"
            >
              Reset All Filters
            </button>
          )}
        </aside>

        <main className="flex-1 animate-fade-in">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="card group flex flex-col overflow-hidden"
                >
                  <Link
                    to={`/product/${p.id}`}
                    className="block aspect-[3/4] overflow-hidden relative bg-bgBase"
                  >
                    <div className="absolute top-4 left-4 z-10">
                      <TagBadge tag={p.tag} />
                    </div>
                    <img
                      src={getCloudinaryUrl(p.thumbnail || p.images?.[0], 480)}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </Link>
                  <div className="p-6 flex flex-col flex-grow text-center">
                    <Link to={`/product/${p.id}`} className="no-underline">
                      <h3 className="font-serif text-[18px] font-medium text-textMain mb-2 group-hover:text-accent transition-colors line-clamp-1">
                        {p.name}
                      </h3>
                    </Link>

                    <p className="text-textMain font-sans font-bold text-[14px] mb-4 tracking-widest">
                      {p.priceDisplay}
                    </p>
                    <a
                      href={`https://wa.me/919265466420?text=Hi, I would like to inquire about the product: ${encodeURIComponent(p.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto w-full btn-primary text-[11px]"
                    >
                      Inquire on WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-40 text-center bg-white border border-dashed border-borderSoft rounded-soft">
              <p className="text-textMuted font-serif italic text-lg mb-4">
                No products match your selection.
              </p>
              <button onClick={resetFilters} className="btn-ghost">
                Reset all filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
