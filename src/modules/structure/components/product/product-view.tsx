"use client";

import { Navbar } from "../navbar/navbar";
import { Footer } from "../footer/footer";
import { useMemo, useState } from "react";
import { ProductImagesStrip } from "./product-image-strip";
import { ProductDetail } from "./product-detail";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

const PRODUCT_PLACEHOLDER_IMAGES = [
  "/cat1.png",
  "/cat2.png",
  "/cat3.png",
  "/cat4.png",
  "/cat5.png",
  "/cat6.png",
  "/cat7.png",
  "/cat8.png",
  "/cat9.png",
  "/cat10.png",
  "/cat11.png",
  "/cat12.png",
];

// random “estable” (determinístico) por id
function hashStringToNumber(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickStableImages(seedKey: string, pool: string[], count = 4) {
  if (!pool.length) return [];
  const seed = hashStringToNumber(seedKey);
  const out: string[] = [];
  const used = new Set<number>();

  // garantiza unicidad si el pool lo permite
  for (let i = 0; out.length < count && out.length < pool.length; i++) {
    const idx = (seed + i * 31) % pool.length;
    if (used.has(idx)) continue;
    used.add(idx);
    out.push(pool[idx]);
  }
  return out;
}

type ProductViewProps = {
  productId: string;
};

export default function ProductView({ productId }: ProductViewProps) {
  const trpc = useTRPC();
  const { data: product } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ id: productId })
  );

  console.log("PRODUCT --> ", product);

  const [navFixed, setNavFixed] = useState(false);
  const [navMainScrollUpVisible, setNavMainScrollUpVisible] = useState(false);

  // armamos 4 imágenes para el strip
  const stripImages = useMemo(() => {
    const imgs =
      product.images && product.images.length > 0
        ? product.images
        : pickStableImages(product.id, PRODUCT_PLACEHOLDER_IMAGES, 4);

    return imgs.slice(0, 4).map((src, i) => ({
      src,
      alt: `${product.name} ${i + 1}`,
    }));
  }, [product]);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar
        onFixedChange={(isFixed) => setNavFixed(isFixed)}
        onMainVisibleChange={(isVisibleByScrollUp) =>
          setNavMainScrollUpVisible(isVisibleByScrollUp)
        }
      />

      <main className={`relative flex-1 ${navFixed && "mt-32"}`}>
        <ProductImagesStrip images={stripImages} />

        <div className="max-w-screen mx-auto px-12 md:px-6 pt-[120px] pb-24">
          <div className="grid gap-32 lg:grid-cols-[minmax(0,1.7fr)_minmax(400px,1fr)] items-start justify-items-end mr-2">
            <section className="space-y-6 justify-self-stretch">
              <h1 className="uppercase text-2xl tracking-wide">
                Productos Relacionados
              </h1>

              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-40 rounded-[2rem] bg-gradient-to-br from-slate-400 via-neutral-500 to-zinc-900"
                />
              ))}
            </section>

            <aside
              className={`
                sticky
                -mt-225
                ${navMainScrollUpVisible ? "top-[17.5vh]" : "top-[5.9vh]"}
                self-start
                space-y-4
                max-w-[400px]
              `}
            >
              {/* pasale el producto */}
              <ProductDetail
                product={product}
                heroImage={stripImages[0]?.src}
              />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
