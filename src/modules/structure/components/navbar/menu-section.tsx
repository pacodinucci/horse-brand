import Image from "next/image";
import Link from "next/link";
import type { UrlObject } from "url";

type MegaLink = {
  label: string;
  href: string | UrlObject;
};

type MegaImage = {
  src: string;
  alt: string;
  caption?: string;
};

type MenuSectionProps = {
  title: string;
  image: MegaImage & {
    /** Ancho fijo de la imagen (px). Default: 280 */
    widthPx?: number;
    /** Alto sugerido para Next/Image. Default: 180 */
    heightPx?: number;
    imageClassName?: string;
  };
  links: MegaLink[];
  className?: string;
  /** Desplaza el contenido hacia la derecha (px). Default: 0 */
  contentOffsetPx?: number;
  /** Control de ancho máximo del inner container. Default: 'max-w-6xl' */
  maxWidthClass?: string;
};

export function MenuSection({
  title,
  image,
  links,
  className,
  contentOffsetPx = 0,
  maxWidthClass = "max-w-6xl",
}: MenuSectionProps) {
  const imgW = image.widthPx ?? 280;
  const imgH = image.heightPx ?? 180;

  return (
    <div
      className={[
        "w-screen bg-zinc-50 text-neutral-900 px-8",
        className || "",
      ].join(" ")}
      role="menu"
      aria-label={title}
    >
      <div
        className={[maxWidthClass, "px-6 py-6"].join(" ")}
        style={{ paddingLeft: contentOffsetPx }}
      >
        <header className="mb-4">
          <h3 className="text-[22px] leading-tight tracking-wider uppercase">
            {title}
          </h3>
          <div className="mt-2 h-px w-24 bg-neutral-800" />
        </header>

        <div className="grid grid-cols-12 gap-8 md:grid-cols-[auto_1fr]">
          {/* Imagen izquierda */}
          <div className="col-span-12 md:col-span-1">
            <div
              className="relative overflow-hidden rounded-md"
              style={{ width: imgW }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={imgW}
                height={imgH}
                className={[
                  "h-auto w-full object-cover",
                  image.imageClassName || "",
                ].join(" ")}
                priority
              />
              {image.caption ? (
                <span className="absolute bottom-3 left-3 text-white text-sm tracking-wider font-medium">
                  {image.caption}
                </span>
              ) : null}
            </div>
          </div>

          {/* Links derecha */}
          <nav className="col-span-12 md:col-span-1 flex items-start">
            <ul className="w-full grid gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {links.map((l) => {
                const key =
                  typeof l.href === "string"
                    ? l.href
                    : `${l.href.pathname}-${l.label}`;

                return (
                  <li key={key}>
                    <Link
                      href={l.href}
                      className="
                        block w-fit uppercase tracking-wider
                        text-neutral-700 hover:text-neutral-900
                        relative outline-none
                        after:content-[''] after:absolute after:left-0 after:-bottom-1
                        after:block after:h-px after:w-0 after:bg-neutral-900
                        after:transition-[width] after:duration-200
                        hover:after:w-full focus-visible:after:w-full
                      "
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
