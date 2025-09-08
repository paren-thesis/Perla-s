import React, { useState, useRef, useEffect } from "react";

const OptimizedImage = ({
    src,
    alt,
    className = "",
    fallbackSrc = "/images/placeholder.jpg",
    blurDataURL,
    priority = false,
    quality = 75,
    sizes = "100vw",
    onLoad,
    onError,
    ...props
}) => {
    const [imageState, setImageState] = useState({
        loaded: false,
        error: false,
        inView: false,
    });
    const [currentSrc, setCurrentSrc] = useState(priority ? src : null);
    const imgRef = useRef(null);
    const containerRef = useRef(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (priority) {
            setImageState(prev => ({ ...prev, inView: true }));
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setImageState(prev => ({ ...prev, inView: true }));
                    setCurrentSrc(src);
                    observer.unobserve(entry.target);
                }
            },
            {
                rootMargin: "50px",
                threshold: 0.1,
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, [src, priority]);

    // Handle image load
    const handleLoad = (e) => {
        setImageState(prev => ({ ...prev, loaded: true, error: false }));
        if (onLoad) onLoad(e);
    };

    // Handle image error
    const handleError = (e) => {
        console.warn(`Failed to load image: ${src}`);
        setImageState(prev => ({ ...prev, error: true, loaded: true }));
        setCurrentSrc(fallbackSrc);
        if (onError) onError(e);
    };

    // Check if image is already cached
    useEffect(() => {
        if (imgRef.current && imgRef.current.complete && currentSrc) {
            setImageState(prev => ({ ...prev, loaded: true }));
        }
    }, [currentSrc]);

    // Generate optimized image URL (placeholder for future CDN integration)
    const getOptimizedSrc = (originalSrc, width, quality) => {
        // This could be extended to work with image CDNs like Cloudinary, ImageKit, etc.
        // For now, return the original source
        return originalSrc;
    };

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${className}`}
            {...props}
        >
            {/* Blur placeholder */}
            {blurDataURL && !imageState.loaded && (
                <div
                    className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110"
                    style={{
                        backgroundImage: `url(${blurDataURL})`,
                    }}
                />
            )}

            {/* Loading skeleton */}
            {!imageState.loaded && !blurDataURL && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
            )}

            {/* Main image */}
            {currentSrc && (
                <img
                    ref={imgRef}
                    src={currentSrc}
                    alt={alt}
                    className={`w-full h-full object-cover transition-all duration-700 ease-out ${imageState.loaded
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-105"
                        }`}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading={priority ? "eager" : "lazy"}
                    decoding="async"
                />
            )}

            {/* Loading spinner */}
            {!imageState.loaded && imageState.inView && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Error state */}
            {imageState.error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500">
                    <svg
                        className="w-12 h-12 mb-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <span className="text-xs text-center px-2">Image unavailable</span>
                </div>
            )}
        </div>
    );
};

// Higher-order component for specific image types
export const HeroImage = ({ src, alt, className, ...props }) => (
    <OptimizedImage
        src={src}
        alt={alt}
        className={`rounded-full shadow-2xl ${className}`}
        priority={true}
        quality={85}
        {...props}
    />
);

export const MenuItemImage = ({ src, alt, className, ...props }) => (
    <OptimizedImage
        src={src}
        alt={alt}
        className={`aspect-[4/3] ${className}`}
        quality={80}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        {...props}
    />
);

export const TeamMemberImage = ({ src, alt, className, ...props }) => (
    <OptimizedImage
        src={src}
        alt={alt}
        className={`rounded-lg ${className}`}
        quality={85}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        {...props}
    />
);

// Utility function to generate blur data URL (placeholder)
export const generateBlurDataURL = (width = 10, height = 10) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    // Create a simple gradient blur placeholder
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#f3f4f6");
    gradient.addColorStop(1, "#e5e7eb");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    return canvas.toDataURL();
};

// Hook for preloading images
export const useImagePreloader = (imageSources) => {
    const [loadedImages, setLoadedImages] = useState(new Set());

    useEffect(() => {
        const preloadImages = async () => {
            const promises = imageSources.map((src) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => {
                        setLoadedImages(prev => new Set([...prev, src]));
                        resolve(src);
                    };
                    img.onerror = reject;
                    img.src = src;
                });
            });

            try {
                await Promise.allSettled(promises);
            } catch (error) {
                console.warn("Some images failed to preload:", error);
            }
        };

        if (imageSources.length > 0) {
            preloadImages();
        }
    }, [imageSources]);

    return loadedImages;
};

export default OptimizedImage;