"use client";

import { ConceptCard } from "./concept-card";

const concepts = [
  {
    title: "Sombreros y guantes para mujer",
    imageUrl: "/chair.png",
  },
  {
    title: "Anillos",
    imageUrl: "/chair.png",
  },
  {
    title: "Botas y botines para mujer",
    imageUrl: "/chair.png",
  },
  {
    title: "Perro",
    imageUrl: "/chair.png",
  },
  {
    title: "Mocasines para hombre",
    imageUrl: "/chair.png",
  },
  {
    title: "Servicio de mesa",
    imageUrl: "/chair.png",
  },
  {
    title: "Regalos para recién nacidos",
    imageUrl: "/chair.png",
  },
  {
    title: "Mantas y cojines",
    imageUrl: "/chair.png",
  },
];

export const ConceptGrid = () => {
  return (
    <section className="w-full bg-zinc-100 py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {concepts.map((item) => (
            <ConceptCard
              key={item.title}
              title={item.title}
              imageUrl={item.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
