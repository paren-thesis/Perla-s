import React, { useState } from "react";
import { FaEnvelope, FaCheckCircle, FaExclamationTriangle, FaSpinner } from "react-icons/fa";

const EmailVerificationDialog = ({
    isOpen,
    onClose,
    userEmail,
    onResendVerification,
    onCheckVerification,
    onSignOut
}) => {
    const [isResending, setIsResending] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // success, error, info

    if (!isOpen) return null;

    const handleResendVerification = async () => {
        setIsResending(true);
        setMessage("");

        try {
            const result = await onResendVerification();
            setMessage(result.message);
            setMessageType(result.success ? "success" : "error");
        } catch (error) {
            setMessage(error.message || "Failed to resend verification email. Please try again.");
            setMessageType("error");
        } finally {
            setIsResending(false);
        }
    };

    const handleCheckVerification = async () => {
        setIsChecking(true);
        setMessage("");

        try {
            const isVerified = await onCheckVerification();
            if (isVerified) {
                setMessage("Email verified successfully! You can now access all features.");
                setMessageType("success");
                // Close dialog after a short delay
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                setMessage("Email not yet verified. Please check your inbox and click the verification link.");
                setMessageType("info");
            }
        } catch (error) {
            setMessage("Failed to check verification status. Please try again.");
            setMessageType("error");
        } finally {
            setIsChecking(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await onSignOut();
            onClose();
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

    const getMessageIcon = () => {
        switch (messageType) {
            case "success":
                return <FaCheckCircle className="text-green-500" />;
            case "error":
                return <FaExclamationTriangle className="text-red-500" />;
            case "info":
                return <FaEnvelope className="text-blue-500" />;
            default:
                return null;
        }
    };

    const getMessageBgColor = () => {
        switch (messageType) {
            case "success":
                return "bg-green-50 text-green-800 border-green-200";
            case "error":
                return "bg-red-50 text-red-800 border-red-200";
            case "info":
                return "bg-blue-50 text-blue-800 border-blue-200";
            default:
                return "";
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                        <FaEnvelope className="w-8 h-8 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Verify Your Email
                    </h2>
                    <p className="text-gray-600">
                        We sent a verification link to:
                    </p>
                    <p className="font-semibold text-gray-900 mt-1">
                        {userEmail}
                    </p>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-4 p-3 rounded-lg border flex items-start space-x-2 ${getMessageBgColor()}`}>
                        {getMessageIcon()}
                        <p className="text-sm flex-1">{message}</p>
                    </div>
                )}

                {/* Instructions */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Next Steps:</h3>
                    <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                        <li>Check your email inbox (including spam/junk folder)</li>
                        <li>Click the verification link in the email</li>
                        <li>Return here and click "I've Verified My Email"</li>
                    </ol>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={handleCheckVerification}
                        disabled={isChecking}
                        className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isChecking ? (
                            <>
                                <FaSpinner className="animate-spin mr-2" />
                                Checking...
                            </>
                        ) : (
                            "I've Verified My Email"
                        )}
                    </button>

                    <button
                        onClick={handleResendVerification}
                        disabled={isResending}
                        className="w-full bg-white border-2 border-primary-500 text-primary-600 py-3 px-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isResending ? (
                            <>
                                <FaSpinner className="animate-spin mr-2" />
                                Sending...
                            </>
                        ) : (
                            "Resend Verification Email"
                        )}
                    </button>

                    <div className="flex space-x-3">
                        <button
                            onClick={handleSignOut}
                            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                        >
                            Sign Out
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                        >
                            Close
                        </button>
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
                        Didn't receive the email? Check your spam folder or try resending.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EmailVerificationDialog;