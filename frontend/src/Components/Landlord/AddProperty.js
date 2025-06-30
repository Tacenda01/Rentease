import { useState } from "react";

export default function AddPropertyForm({ onSubmit, onClose }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        city: "",
        address: "",
        price: "",
        bedrooms: "",
        bathrooms: "",
        area: "",
        propertyType: "",
        images: [],
    });

    const [imagePreviews, setImagePreviews] = useState([]);
    const [errors, setErrors] = useState({});
    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData((prev) => ({ ...prev, images: files }));
        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
            newErrors.price = "Enter a valid price greater than 0";
        }
        if (!formData.bedrooms || isNaN(formData.bedrooms) || Number(formData.bedrooms) <= 0) {
            newErrors.bedrooms = "Enter at least 1 bedroom";
        }
        if (!formData.bathrooms || isNaN(formData.bathrooms) || Number(formData.bathrooms) <= 0) {
            newErrors.bathrooms = "Enter at least 1 bathroom";
        }
        if (!formData.area || isNaN(formData.area) || Number(formData.area) <= 0) {
            newErrors.area = "Enter a valid area (sq.ft)";
        }
        if (formData.images.length === 0) {
            newErrors.images = "Please upload at least one image";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const uploadToCloudinary = async (images) => {
        const cloudName = "dhpecqdx4";
        const uploadPreset = "rentEaseUploads";
        const uploadedUrls = [];

        for (const image of images) {
            const form = new FormData();
            form.append("file", image);
            form.append("upload_preset", uploadPreset);
            form.append("cloud_name", cloudName);

            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: "POST",
                body: form,
            });

            const data = await res.json();
            uploadedUrls.push(data.secure_url);
        }

        return uploadedUrls;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setUploading(true);
            const imageUrls = await uploadToCloudinary(formData.images);
            const role = localStorage.getItem("role");
            const userId = localStorage.getItem("userId");

            if (!userId || role !== "landlord") {
                alert("Only landlords can add properties.");
                return;
            }

            onSubmit({
                userId,
                title: formData.title,
                description: formData.description,
                city: formData.city,
                address: formData.address,
                price: Number(formData.price),
                bedrooms: Number(formData.bedrooms),
                bathrooms: Number(formData.bathrooms),
                area: Number(formData.area),
                propertyType: formData.propertyType,
                images: imageUrls,
            });

            setFormData({
                title: "",
                description: "",
                city: "",
                address: "",
                price: "",
                bedrooms: "",
                bathrooms: "",
                area: "",
                propertyType: "",
                images: [],
            });
            setImagePreviews([]);
            setErrors({});
            onClose();
        } catch (err) {
            console.error("Upload error:", err);
            alert("Image upload failed. Try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
            <h2 className="text-xl font-semibold mb-4">Add New Property</h2>

            <div>
                <label className="block mb-1 font-medium">Title *</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full border rounded px-3 py-2 ${errors.title ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
                    placeholder="Enter property description"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">City *</label>
                <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full border rounded px-3 py-2 ${errors.city ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>

            <div>
                <label className="block mb-1 font-medium">Address</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Street, area, etc."
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 font-medium">Rent/month (₹) *</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={`w-full border rounded px-3 py-2 ${errors.price ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                <div>
                    <label className="block mb-1 font-medium">Bedrooms *</label>
                    <input
                        type="number"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleChange}
                        className={`w-full border rounded px-3 py-2 ${errors.bedrooms ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
                </div>

                <div>
                    <label className="block mb-1 font-medium">Bathrooms *</label>
                    <input
                        type="number"
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleChange}
                        className={`w-full border rounded px-3 py-2 ${errors.bathrooms ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
                </div>

                <div>
                    <label className="block mb-1 font-medium">Area (sq.ft) *</label>
                    <input
                        type="number"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        className={`w-full border rounded px-3 py-2 ${errors.area ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
                </div>
            </div>

            <div>
                <label className="block mb-1 font-medium">Property Type</label>
                <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                >
                    <option value="">Select type</option>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Studio">Studio</option>
                    <option value="Villa">Villa</option>
                </select>
            </div>

            <div>
                <label className="block mb-1 font-medium">Upload Images *</label>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className={`w-full border rounded px-3 py-2 cursor-pointer ${errors.images ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}

                {imagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-3">
                        {imagePreviews.map((src, idx) => (
                            <img key={idx} src={src} alt={`Preview ${idx + 1}`} className="h-20 w-20 object-cover rounded border border-gray-300" />
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-4">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
                    Cancel
                </button>
                <button type="submit" disabled={uploading} className="px-6 py-2 rounded bg-sky-600 text-white hover:bg-sky-700">
                    {uploading ? "Uploading..." : "Add Property"}
                </button>
            </div>
        </form>
    );
}
