import React, { useState, useEffect } from "react";

/**
 * Register.jsx
 * A responsive registration page using React + Tailwind CSS.
 * Fields: avatar (image upload with preview), fullName, phone, address, email, password, confirmPassword.
 * Simple client-side validation and visual feedback.
 */

export default function Register() {
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!avatarFile) {
            setAvatarPreview("");
            return;
        }
        const objectUrl = URL.createObjectURL(avatarFile);
        setAvatarPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [avatarFile]);

    function validate() {
        const errs = {};
        if (!fullName.trim()) errs.fullName = "Full name is required.";
        if (!phone.trim()) errs.phone = "Phone number is required.";
        if (!address.trim()) errs.address = "Address is required.";
        if (!email.trim()) errs.email = "Email is required.";
        else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email.";
        if (!password) errs.password = "Password is required.";
        else if (password.length < 6) errs.password = "Password must be at least 6 characters.";
        if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match.";
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
            await authService.register({
                fullName,
                phone,
                address,
                email,
                password,
                avatar: avatarFile,
            });

            setSuccess("Registration successful!");
            setFullName("");
            setPhone("");
            setAddress("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setAvatarFile(null);

            // Redirect to login after successful registration
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
        } catch (err) {
            console.error("Registration error:", err);
            setErrors({ form: err.response?.data?.message || "Registration failed. Please try again." });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
            <div className="max-w-4xl w-full bg-white shadow-lg rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
                {/* Left: Illustration / Branding */}
                <div className="hidden lg:flex flex-col items-center justify-center p-10 bg-linear-to-br from-indigo-600 to-cyan-500 text-white">
                    <div className="text-3xl font-bold mb-3">Create your account</div>
                    <p className="text-sky-100 mb-6 text-center">
                        Join WorldLaptopCare — manage devices, warranties, and more.
                    </p>
                    <div className="w-48 h-48 rounded-xl bg-white/10 flex items-center justify-center">
                        <svg
                            className="w-20 h-20 opacity-90"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 11c2.21 0 4-1.79 4-4S14.21 3 12 3 8 4.79 8 7s1.79 4 4 4zM6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"
                            />
                        </svg>
                    </div>
                    <p className="mt-6 text-sm text-white/90 text-center px-4">
                        Responsive, accessible and minimal by design.
                    </p>
                </div>

                {/* Right: Form */}
                <div className="p-8 lg:p-10">
                    <h2 className="text-2xl font-semibold mb-1">Sign up</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Create an account to get started. It's free and takes a minute.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Avatar upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt="avatar preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M12 12a5 5 0 100-10 5 5 0 000 10zM2 22a10 10 0 0120 0"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="text-gray-300"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                    <input
                                        id="avatar"
                                        name="avatar"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) setAvatarFile(file);
                                        }}
                                        className="sr-only"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label
                                        htmlFor="avatar"
                                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm cursor-pointer shadow-sm hover:bg-gray-50"
                                    >
                                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M12 5v14M5 12h14"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        Choose Image
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1">
                                        JPG, PNG or GIF. Max 2MB.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Full name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Jane Doe"
                            />
                            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="+1 (555) 123-4567"
                            />
                            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows="3"
                                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Your full address"
                            />
                            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                        </div>

                        {/* Email */}
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

                        {/* Passwords */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="At least 6 characters"
                                />
                                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Repeat password"
                                />
                                {errors.confirmPassword && (
                                    <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </div>

                        {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}
                        {success && <p className="text-sm text-green-600">{success}</p>}

                        <div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-black rounded-md shadow hover:bg-indigo-700 disabled:opacity-60"
                            >
                                {submitting ? "Registering..." : "Register"}
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 text-center">
                            By registering you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}