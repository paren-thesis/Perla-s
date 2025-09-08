import { useState, useEffect, useMemo } from "react";
import { preloadImages } from "../utils/imageUtils";

/**
 * Custom hook for preloading images with priority and loading states
 */
export const useImagePreloader = (imageSources = [], options = {}) => {
	const {
		priority = [],
		enablePreload = true,
		batchSize = 5,
		delay = 100,
	} = options;

	const [loadedImages, setLoadedImages] = useState(new Set());
	const [failedImages, setFailedImages] = useState(new Set());
	const [isLoading, setIsLoading] = useState(false);

	// Separate priority and regular images
	const { priorityImages, regularImages } = useMemo(() => {
		const prioritySet = new Set(priority);
		const priorityImages = imageSources.filter((src) => prioritySet.has(src));
		const regularImages = imageSources.filter((src) => !prioritySet.has(src));

		return { priorityImages, regularImages };
	}, [imageSources, priority]);

	// Load images in batches
	const loadImageBatch = async (sources, startIndex = 0) => {
		const batch = sources.slice(startIndex, startIndex + batchSize);
		if (batch.length === 0) return;

		const promises = batch.map((src) => {
			return new Promise((resolve) => {
				const img = new Image();

				img.onload = () => {
					setLoadedImages((prev) => new Set([...prev, src]));
					resolve({ src, success: true });
				};

				img.onerror = () => {
					setFailedImages((prev) => new Set([...prev, src]));
					resolve({ src, success: false });
				};

				img.src = src;
			});
		});

		await Promise.allSettled(promises);

		// Load next batch with delay
		if (startIndex + batchSize < sources.length) {
			setTimeout(() => {
				loadImageBatch(sources, startIndex + batchSize);
			}, delay);
		}
	};

	useEffect(() => {
		if (!enablePreload || imageSources.length === 0) return;

		setIsLoading(true);

		const loadImages = async () => {
			// Load priority images first
			if (priorityImages.length > 0) {
				await loadImageBatch(priorityImages);
			}

			// Then load regular images
			if (regularImages.length > 0) {
				await loadImageBatch(regularImages);
			}

			setIsLoading(false);
		};

		loadImages();
	}, [
		imageSources,
		priorityImages,
		regularImages,
		enablePreload,
		batchSize,
		delay,
	]);

	const getImageStatus = (src) => {
		if (loadedImages.has(src)) return "loaded";
		if (failedImages.has(src)) return "failed";
		return "loading";
	};

	const isImageLoaded = (src) => loadedImages.has(src);
	const isImageFailed = (src) => failedImages.has(src);

	const stats = {
		total: imageSources.length,
		loaded: loadedImages.size,
		failed: failedImages.size,
		pending: imageSources.length - loadedImages.size - failedImages.size,
		progress:
			imageSources.length > 0
				? (loadedImages.size / imageSources.length) * 100
				: 0,
	};

	return {
		loadedImages,
		failedImages,
		isLoading,
		getImageStatus,
		isImageLoaded,
		isImageFailed,
		stats,
	};
};

/**
 * Hook for progressive image loading with intersection observer
 */
export const useProgressiveImageLoader = (src, options = {}) => {
	const { threshold = 0.1, rootMargin = "50px", priority = false } = options;

	const [imageState, setImageState] = useState({
		isInView: priority,
		isLoaded: false,
		isError: false,
		isLoading: false,
	});

	const [elementRef, setElementRef] = useState(null);

	useEffect(() => {
		if (priority) {
			setImageState((prev) => ({ ...prev, isInView: true }));
			return;
		}

		if (!elementRef) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setImageState((prev) => ({ ...prev, isInView: true }));
					observer.unobserve(entry.target);
				}
			},
			{ threshold, rootMargin }
		);

		observer.observe(elementRef);

		return () => {
			observer.disconnect();
		};
	}, [elementRef, threshold, rootMargin, priority]);

	useEffect(() => {
		if (!imageState.isInView || !src) return;

		setImageState((prev) => ({ ...prev, isLoading: true }));

		const img = new Image();

		img.onload = () => {
			setImageState((prev) => ({
				...prev,
				isLoaded: true,
				isLoading: false,
				isError: false,
			}));
		};

		img.onerror = () => {
			setImageState((prev) => ({
				...prev,
				isError: true,
				isLoading: false,
				isLoaded: false,
			}));
		};

		img.src = src;
	}, [src, imageState.isInView]);

	return {
		...imageState,
		ref: setElementRef,
	};
};

export default useImagePreloader;
