import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// /c:/Users/dell/Desktop/MY PROJECTS/WLC/frontend/worldlaptopcare/src/Pages/Productdetail.jsx

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch product
    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setError(null);

        axios
            .get(`/api/products/${id}`)
            .then((res) => {
                const p = res.data;
                setProduct(p);
                setMainImage((p.images && p.images[0]) || p.image || null);
            })
            .catch((err) => {
                // fallback: if backend not available, show friendly message
                setError(
                    err?.response?.data?.message ||
                        err.message ||
                        "Failed to load product data."
                );
            })
            .finally(() => setLoading(false));
    }, [id]);

    // Add product to localStorage cart
    function addToCart() {
        if (!product) return;
        const raw = localStorage.getItem("cart");
        let cart = raw ? JSON.parse(raw) : [];
        const idx = cart.findIndex((it) => it._id === product._id || it.id === product.id);
        if (idx >= 0) {
            cart[idx].quantity = (cart[idx].quantity || 1) + qty;
        } else {
            cart.push({
                _id: product._id || product.id,
                title: product.title || product.name,
                price: product.price,
                image: mainImage || (product.images && product.images[0]) || product.image,
                quantity: qty,
            });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        // simple feedback
        alert("Added to cart");
        // navigate to cart optionally:
        // navigate("/cart");
    }

    function decrease() {
        setQty((q) => Math.max(1, q - 1));
    }
    function increase() {
        setQty((q) => q + 1);
    }

    if (loading) return <div style={{ padding: 20 }}>Loading…</div>;
    if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;
    if (!product) return <div style={{ padding: 20 }}>Product not found.</div>;

    return (
        <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto", display: "flex", gap: 24 }}>
            {/* Images column */}
            <div style={{ flex: "0 0 440px" }}>
                <div style={{ border: "1px solid #eee", padding: 12 }}>
                    {mainImage ? (
                        <img
                            src={mainImage}
                            alt={product.title || product.name}
                            style={{ width: "100%", height: 360, objectFit: "contain", background: "#fff" }}
                        />
                    ) : (
                        <div style={{ width: "100%", height: 360, display: "flex", alignItems: "center", justifyContent: "center", background: "#f6f6f6" }}>
                            No image
                        </div>
                    )}
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    {(product.images || (product.image ? [product.image] : []) || []).map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setMainImage(img)}
                            style={{
                                border: mainImage === img ? "2px solid #007bff" : "1px solid #ddd",
                                padding: 0,
                                background: "white",
                                cursor: "pointer",
                                width: 72,
                                height: 54,
                            }}
                        >
                            <img src={img} alt={`${product.title || product.name}-${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Details column */}
            <div style={{ flex: 1 }}>
                <h1 style={{ marginTop: 0 }}>{product.title || product.name}</h1>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#111" }}>
                    ₹{product.price?.toLocaleString?.() ?? product.price}
                </div>

                <div style={{ marginTop: 12, color: "#555" }}>
                    {product.shortDescription || product.description?.slice?.(0, 200) || "No description available."}
                </div>

                {/* qty + add */}
                <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: 6 }}>
                        <button onClick={decrease} style={{ padding: "8px 12px", border: "none", background: "transparent", cursor: "pointer" }}>
                            −
                        </button>
                        <div style={{ minWidth: 36, textAlign: "center" }}>{qty}</div>
                        <button onClick={increase} style={{ padding: "8px 12px", border: "none", background: "transparent", cursor: "pointer" }}>
                            +
                        </button>
                    </div>

                    <button onClick={addToCart} style={{ padding: "10px 16px", background: "#007bff", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
                        Add to cart
                    </button>

                    <button
                        onClick={() => {
                            addToCart();
                            navigate("/cart");
                        }}
                        style={{ padding: "10px 16px", background: "#28a745", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}
                    >
                        Buy now
                    </button>
                </div>

                {/* Additional info */}
                <div style={{ marginTop: 18 }}>
                    <h3 style={{ marginBottom: 8 }}>Product details</h3>
                    <div style={{ color: "#444", lineHeight: 1.6 }}>
                        {product.description || "No further details available."}
                    </div>
                </div>

                {product.features && (
                    <div style={{ marginTop: 18 }}>
                        <h4>Features</h4>
                        <ul>
                            {product.features.map((f, i) => (
                                <li key={i}>{f}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {product.specs && (
                    <div style={{ marginTop: 18 }}>
                        <h4>Specifications</h4>
                        <table style={{ borderCollapse: "collapse", width: "100%" }}>
                            <tbody>
                                {Object.entries(product.specs).map(([k, v]) => (
                                    <tr key={k}>
                                        <td style={{ border: "1px solid #eee", padding: 8, width: 180, fontWeight: 600 }}>{k}</td>
                                        <td style={{ border: "1px solid #eee", padding: 8 }}>{String(v)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}