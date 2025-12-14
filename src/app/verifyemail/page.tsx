'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();

    const onVerifyEmail = async (tokenToVerify: string) => {
        try {
            setLoading(true);
            await axios.post(`/api/users/verifyemail`, { token: tokenToVerify });
            setVerified(true);
            toast.success('Email verified successfully!');
        } catch (err) {
            setError(true);
            toast.error('Failed to verify email. Please try again.');
            console.log("Error verifying email:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
            onVerifyEmail(tokenFromUrl);
        } else {
            setLoading(false);
            setError(true);
        }
    }, [searchParams]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="bg-white rounded-xl shadow-2xl p-8">
                        <div className="text-center">
                            <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                            <h2 className="mt-6 text-2xl font-bold text-gray-900">
                                Verifying Your Email...
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Please wait while we verify your email address.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="bg-white rounded-xl shadow-2xl p-8">
                        <div className="text-center">
                            <div className="mx-auto h-12 w-12 bg-red-600 rounded-full flex items-center justify-center">
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                                Verification Failed
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                We couldn&apos;t verify your email. The link may be invalid or expired.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/signup"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
                                >
                                    Try Again
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (verified) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="bg-white rounded-xl shadow-2xl p-8">
                        <div className="text-center">
                            <div className="mx-auto h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                                Email Verified Successfully!
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Thank you for verifying your email. You can now log in to your account.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/login"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200"
                                >
                                    Go to Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
