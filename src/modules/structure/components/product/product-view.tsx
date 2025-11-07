"use client";

import { Navbar } from "../navbar/navbar";
import { Footer } from "../footer/footer";
import { useState } from "react";
import { ProductImagesStrip } from "./product-image-strip";
import { ProductDetail } from "./product-detail";

const stripImages = [
  { src: "/bag.png", alt: "Vista frontal" },
  { src: "/cat8.png", alt: "Vista lateral" },
  { src: "/cat9.png", alt: "Detalle hebilla" },
  { src: "/cat10.png", alt: "Vista detrás" },
];

export default function ProductView() {
  const [navFixed, setNavFixed] = useState(false);
  const [navMainScrollUpVisible, setNavMainScrollUpVisible] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar
        onFixedChange={(isFixed) => {
          setNavFixed(isFixed);
        }}
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
                -mt-240
                ${navMainScrollUpVisible ? "top-[128px]" : "top-[48px]"}
                self-start
                space-y-4
                max-w-[400px]
              `}
            >
              <ProductDetail />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
