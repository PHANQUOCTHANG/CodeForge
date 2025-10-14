import React, { useState } from "react";
import "./ImageWithFallback.scss";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

export function ImageWithFallback(
  props: React.ImgHTMLAttributes<HTMLImageElement>
) {
  const [didError, setDidError] = useState(false);
  const { src, alt, className = "", ...rest } = props;

  const handleError = () => setDidError(true);

  return didError ? (
    <div className={`image-fallback ${className}`}>
      <img
        src={ERROR_IMG_SRC}
        alt="Error loading image"
        className="image-fallback__error-icon"
        {...rest}
        data-original-url={src}
      />
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={`image-fallback__img ${className}`}
      onError={handleError}
      {...rest}
    />
  );
}
