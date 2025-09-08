/**
 * Image optimization utilities for better performance
 */

/**
 * Convert canvas to WebP if supported, otherwise fallback to JPEG
 */
export const canvasToOptimizedBlob = (canvas, quality = 0.8) => {
	return new Promise((resolve) => {
		// Try WebP first
		canvas.toBlob(
			(webpBlob) => {
				if (webpBlob) {
					resolve(webpBlob);
				} else {
					// Fallback to JPEG
					canvas.toBlob(resolve, "image/jpeg", quality);
				}
			},
			"image/webp",
			quality
		);
	});
};

/**
 * Resize image to specific dimensions
 */
export const resizeImage = (imageFile, maxWidth, maxHeight, quality = 0.8) => {
	return new Promise((resolve, reject) => {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const img = new Image();

		img.onload = async () => {
			// Calculate new dimensions
			let { width, height } = img;

			if (width > height) {
				if (width > maxWidth) {
					height = (height * maxWidth) / width;
					width = maxWidth;
				}
			} else {
				if (height > maxHeight) {
					width = (width * maxHeight) / height;
					height = maxHeight;
				}
			}

			// Set canvas dimensions
			canvas.width = width;
			canvas.height = height;

			// Draw and resize image
			ctx.drawImage(img, 0, 0, width, height);

			// Convert to optimized blob
			const blob = await canvasToOptimizedBlob(canvas, quality);
			resolve(blob);
		};

		img.onerror = reject;
		img.src = URL.createObjectURL(imageFile);
	});
};

/**
 * Generate multiple sizes of an image
 */
export const generateResponsiveImages = async (
	imageFile,
	sizes = [400, 800, 1200]
) => {
	const results = {};

	for (const size of sizes) {
		try {
			const resizedBlob = await resizeImage(imageFile, size, size);
			results[size] = URL.createObjectURL(resizedBlob);
		} catch (error) {
			console.warn(`Failed to generate ${size}px version:`, error);
		}
	}

	return results;
};

/**
 * Create a low-quality placeholder from an image
 */
export const createLowQualityPlaceholder = (imageFile, size = 20) => {
	return resizeImage(imageFile, size, size, 0.1);
};

/**
 * Compress image file
 */
export const compressImage = (imageFile, quality = 0.8, maxSize = 1024) => {
	return new Promise((resolve, reject) => {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const img = new Image();

		img.onload = async () => {
			const { width, height } = img;

			// Calculate compression ratio
			const ratio = Math.min(maxSize / width, maxSize / height);
			const newWidth = width * ratio;
			const newHeight = height * ratio;

			canvas.width = newWidth;
			canvas.height = newHeight;

			// Draw compressed image
			ctx.drawImage(img, 0, 0, newWidth, newHeight);

			// Convert to blob
			const blob = await canvasToOptimizedBlob(canvas, quality);
			resolve(blob);
		};

		img.onerror = reject;
		img.src = URL.createObjectURL(imageFile);
	});
};

/**
 * Get image metadata
 */
export const getImageMetadata = (imageFile) => {
	return new Promise((resolve, reject) => {
		const img = new Image();

		img.onload = () => {
			resolve({
				width: img.naturalWidth,
				height: img.naturalHeight,
				aspectRatio: img.naturalWidth / img.naturalHeight,
				size: imageFile.size,
				type: imageFile.type,
				name: imageFile.name,
			});
		};

		img.onerror = reject;
		img.src = URL.createObjectURL(imageFile);
	});
};

/**
 * Optimize image for web use
 */
export const optimizeImageForWeb = async (imageFile, options = {}) => {
	const {
		maxWidth = 1200,
		maxHeight = 1200,
		quality = 0.85,
		generatePlaceholder = true,
		generateResponsive = false,
	} = options;

	const results = {
		original: imageFile,
		metadata: await getImageMetadata(imageFile),
	};

	try {
		// Main optimized image
		results.optimized = await resizeImage(
			imageFile,
			maxWidth,
			maxHeight,
			quality
		);

		// Low-quality placeholder
		if (generatePlaceholder) {
			results.placeholder = await createLowQualityPlaceholder(imageFile);
		}

		// Responsive versions
		if (generateResponsive) {
			results.responsive = await generateResponsiveImages(imageFile);
		}

		return results;
	} catch (error) {
		console.error("Image optimization failed:", error);
		return { original: imageFile, error };
	}
};

export default {
	resizeImage,
	compressImage,
	generateResponsiveImages,
	createLowQualityPlaceholder,
	getImageMetadata,
	optimizeImageForWeb,
};
