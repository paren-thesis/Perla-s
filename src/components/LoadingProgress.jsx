import React from 'react';

const LoadingProgress = ({
    progress = 0,
    isVisible = true,
    message = "Loading images...",
    showPercentage = true
}) => {
    if (!isVisible) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center space-x-3">
                    {/* Loading spinner */}
                    <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />

                    {/* Progress bar */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">
                                {message}
                            </span>
                            {showPercentage && (
                                <span className="text-sm text-gray-500">
                                    {Math.round(progress)}%
                                </span>
                            )}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingProgress;