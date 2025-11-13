import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

/**
 * Login.jsx
 * A responsive login page using React + Tailwind CSS.
 * Fields: email, password.
 * Simple client-side validation and visual feedback.
 */

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState("");
    const { login } = useAuth();

    function validate() {
        const errs = {};
        if (!email.trim()) errs.email = "Email is required.";
        else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email.";
        if (!password) errs.password = "Password is required.";
        return errs;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSuccess("");
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length) return;

        setSubmitting(true);
        try {
            const { authService } = await import("../services/authService.js");
            const response = await authService.login(email, password);

            // Store token and user data if login successful
            if (response.token) {
                localStorage.setItem('token', response.token);
                if (response.user) {
                    localStorage.setItem('user', JSON.stringify(response.user));
                    login(response.user); // Update context
                }
            }

            setSuccess("Login successful!");
            setEmail("");
            setPassword("");

            // Redirect to home or admin dashboard
            setTimeout(() => {
                window.location.href = response.user?.role === 'admin' ? '/admin' : '/';
            }, 1000);
        } catch (err) {
            console.error("Login error:", err);
            setErrors({ form: err.response?.data?.message || "Login failed. Please try again." });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white shadow-lg rounded-2xl overflow-hidden">
                <div className="p-8">
                    <h2 className="text-2xl font-semibold mb-1">Sign in</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Welcome back! Please sign in to your account.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="you@example.com"
                            />
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your password"
                            />
                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                        </div>

                        {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}
                        {success && <p className="text-sm text-green-600">{success}</p>}

                        <div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-black rounded-md shadow hover:bg-indigo-700 disabled:opacity-60"
                            >
                                {submitting ? "Signing in..." : "Sign in"}
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 text-center">
                            Don't have an account? <a href="/register" className="text-indigo-600 hover:underline">Sign up</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
