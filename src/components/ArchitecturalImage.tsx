import { useState } from 'react';

interface ArchitecturalImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ArchitecturalImage({
  src,
  alt,
  className = '',
  fallbackTitle,
}: ArchitecturalImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#F4F4F4] border border-black/15 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-[#595959] mb-3"
          aria-hidden="true"
        >
          <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
        </svg>
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#595959]">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
