"use client";

import type { CSSProperties } from "react";
import { useRef, useState } from "react";

type RailProduct = {
  slug: string;
  images?: Partial<Record<"angle" | "front", string>>;
  previewKey: string;
  previewName: string;
};

export function CollectionRail({ products }: { products: RailProduct[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const [dragging, setDragging] = useState(false);

  const imageStyle = (images?: RailProduct["images"]) => {
    const frontImage = images?.front || images?.angle || "/images/oogo-product-front.png";
    const angleImage = images?.angle || images?.front || "/images/oogo-product-angle.png";

    return {
      backgroundImage: `url("${frontImage}")`,
      "--hover-image": `url("${angleImage}")`
    } as CSSProperties & Record<"--hover-image", string>;
  };

  function startDrag(clientX: number) {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    dragRef.current = {
      active: true,
      startX: clientX,
      scrollLeft: rail.scrollLeft,
      moved: false
    };
    setDragging(true);
  }

  function moveDrag(clientX: number) {
    const rail = railRef.current;

    if (!rail || !dragRef.current.active) {
      return;
    }

    const distance = clientX - dragRef.current.startX;
    if (Math.abs(distance) > 4) {
      dragRef.current.moved = true;
    }
    rail.scrollLeft = dragRef.current.scrollLeft - distance;
  }

  function stopDrag() {
    dragRef.current.active = false;
    setDragging(false);
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    startDrag(event.clientX);
    railRef.current?.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    moveDrag(event.clientX);
  }

  function endPointerDrag(event: React.PointerEvent<HTMLDivElement>) {
    const rail = railRef.current;
    stopDrag();

    if (rail?.hasPointerCapture(event.pointerId)) {
      rail.releasePointerCapture(event.pointerId);
    }
  }

  function preventClickAfterDrag(event: React.MouseEvent<HTMLAnchorElement>) {
    if (dragRef.current.moved) {
      event.preventDefault();
      dragRef.current.moved = false;
    }
  }

  return (
    <div
      ref={railRef}
      className={`product-grid collection-rail${dragging ? " is-dragging" : ""}`}
      aria-label="Scrollable collection preview"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointerDrag}
      onPointerCancel={endPointerDrag}
      onPointerLeave={(event) => {
        if (dragRef.current.active) {
          endPointerDrag(event);
        }
      }}
      onMouseDown={(event) => startDrag(event.clientX)}
      onMouseMove={(event) => moveDrag(event.clientX)}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
    >
      {products.map((product, index) => (
        <article className="product-tile" key={product.previewKey}>
          <a
            className={`product-visual product-visual-${(index % 2) + 1}`}
            href={`/products/${product.slug}`}
            draggable={false}
            onDragStart={(event) => event.preventDefault()}
            onClick={preventClickAfterDrag}
            style={imageStyle(product.images)}
          >
          </a>
          <div className="product-tile-copy">
            <h3>
              <a
                href={`/products/${product.slug}`}
                draggable={false}
                onDragStart={(event) => event.preventDefault()}
                onClick={preventClickAfterDrag}
              >
                {product.previewName}
              </a>
            </h3>
          </div>
        </article>
      ))}
    </div>
  );
}
