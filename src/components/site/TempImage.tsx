import { tempImages, tempImageSrc, type TempImageId } from "@/content/tempImages";
import { cn } from "@/lib/utils";

/** Self-hosted temporary image (see docs/temp-images.md), served at 1x and 2x via srcset. */
export function TempImage({
  id,
  sizes,
  eager = false,
  className,
}: {
  id: TempImageId;
  sizes: string;
  eager?: boolean;
  className?: string;
}) {
  const { widths, w, h, alt } = tempImages[id];
  const smallest = widths[0] ?? 300;
  return (
    <img
      src={tempImageSrc(id, smallest)}
      srcSet={widths.map((width) => `${tempImageSrc(id, width)} ${width}w`).join(", ")}
      sizes={sizes}
      alt={alt}
      width={w}
      height={h}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={cn("size-full object-cover", className)}
    />
  );
}
