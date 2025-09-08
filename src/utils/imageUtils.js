// Generate a placeholder image data URL
export const generatePlaceholderImage = (
	width = 400,
	height = 300,
	text = "Image",
	bgColor = "#f3f4f6",
	textColor = "#6b7280"
) => {
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");

	// Background
	ctx.fillStyle = bgColor;
	ctx.fillRect(0, 0, width, height);

	// Border
	ctx.strokeStyle = "#d1d5db";
	ctx.lineWidth = 2;
	ctx.strokeRect(1, 1, width - 2, height - 2);

	// Text
	ctx.fillStyle = textColor;
	ctx.font = `${Math.min(width, height) / 10}px sans-serif`;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(text, width / 2, height / 2);

	return canvas.toDataURL();
};

// Generate a blur placeholder from an image
export const generateBlurPlaceholder = (imageSrc, quality = 10) => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";

		img.onload = () => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");

			// Small canvas for blur effect
			canvas.width = quality;
			canvas.height = (img.height / img.width) * quality;

			// Draw small version
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

			resolve(canvas.toDataURL());
		};

		img.onerror = reject;
		img.src = imageSrc;
	});
};

// Preload images
export const preloadImage = (src) => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
};

// Preload multiple images
export const preloadImages = async (sources) => {
	const promises = sources.map((src) => preloadImage(src).catch(() => null));
	return Promise.allSettled(promises);
};

// Check if image exists
export const imageExists = async (src) => {
	try {
		await preloadImage(src);
		return true;
	} catch {
		return false;
	}
};

// Generate responsive image sources
export const generateResponsiveSources = (
	baseSrc,
	sizes = [400, 800, 1200]
) => {
	// This would typically work with a CDN or image service
	// For now, return the base source for all sizes
	return sizes.map((size) => ({
		src: baseSrc,
		width: size,
		media: `(max-width: ${size}px)`,
	}));
};

// Common fallback images
export const FALLBACK_IMAGES = {
	food: generatePlaceholderImage(400, 300, "Food Image"),
	hero: generatePlaceholderImage(600, 600, "Hero Image"),
	team: generatePlaceholderImage(300, 400, "Team Member"),
	general: generatePlaceholderImage(400, 300, "Image"),
};

// Image optimization settings
export const IMAGE_QUALITY = {
	low: 60,
	medium: 75,
	high: 85,
	max: 95,
};

// Common image sizes
export const IMAGE_SIZES = {
	thumbnail: { width: 150, height: 150 },
	small: { width: 300, height: 200 },
	medium: { width: 600, height: 400 },
	large: { width: 1200, height: 800 },
	hero: { width: 1920, height: 1080 },
};

// Check if browser supports WebP
export const supportsWebP = () => {
	const canvas = document.createElement("canvas");
	canvas.width = 1;
	canvas.height = 1;
	return canvas.toDataURL("image/webp").indexOf("image/webp") === 5;
};

// Check if browser supports AVIF
export const supportsAVIF = () => {
	const canvas = document.createElement("canvas");
	canvas.width = 1;
	canvas.height = 1;
	return canvas.toDataURL("image/avif").indexOf("image/avif") === 5;
};

// Get optimal image format
export const getOptimalImageFormat = (originalFormat = "jpg") => {
	if (supportsAVIF()) return "avif";
	if (supportsWebP()) return "webp";
	return originalFormat;
};
