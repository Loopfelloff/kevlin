import { useState, useEffect } from "react";
import { Camera, Mail, User } from "lucide-react";
import axios from "axios";

export default function Profile() {
    const [email, setEmail] = useState("");
    const [profileImageUrl, setProfileImageUrl] = useState("");
    const [fullName, setFullName] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [preview, setPreview] = useState(profileImageUrl);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        axios
            .post("http://localhost:5000/home", {}, { withCredentials: true })
            .then(response => {
                setFullName(response.data.fullName);
                setEmail(response.data.email);
                setProfileImageUrl(response.data.profileImageUrl);

                console.log(response.data);
            })
            .catch(err => {
                console.log(err);
                navigation("/login");
            });
    }, []);

    const handleFileChange = e => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!profilePic) {
            alert("Please select a profile picture");
            return;
        }

        setUploading(true);

        // Create FormData for multipart upload
        const formData = new FormData();
        formData.append("profilePicture", profilePic);

        try {
            // Replace with your backend endpoint
            const response = await fetch(
                "http://localhost:5000/uploadProfile",
                {
                    method: "POST",
                    credentials: "include",
                    body: formData, // Don't set Content-Type header, browser will set it with boundary
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Profile picture uploaded successfully!");
                console.log(data);
            } else {
                alert("Upload failed: " + data.error);
            }
        } catch (error) {
            console.error("Error uploading:", error);
            alert("Error uploading profile picture");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex justify-center items-center p-8">
            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full">
                <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Your Profile
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Manage your account settings
                </p>

                {/* Profile Info Cards */}
                <div className="space-y-3 mb-8">
                    {/* Username */}
                    <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                        <div className="bg-blue-600 rounded-full p-2">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">
                                Username
                            </p>
                            <p className="text-gray-800 font-semibold">
                                {fullName || "Not provided"}
                            </p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                        <div className="bg-purple-600 rounded-full p-2">
                            <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">
                                Email
                            </p>
                            <p className="text-gray-800 font-semibold">
                                {email || "Not provided"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Profile Picture Preview */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="w-40 h-40 rounded-full overflow-hidden bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center shadow-lg border-4 border-white">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Profile preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-6xl">👤</span>
                            )}
                        </div>

                        {/* Camera icon overlay */}
                        <div className="absolute bottom-2 right-2 bg-indigo-600 rounded-full p-3 shadow-lg cursor-pointer hover:bg-indigo-700 transition-colors">
                            <Camera className="w-5 h-5 text-white" />
                        </div>
                    </div>
                </div>

                {/* Upload Section */}
                <div className="space-y-6">
                    <div>
                        <label
                            htmlFor="profilePicture"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Upload Profile Picture
                        </label>
                        <input
                            type="file"
                            id="profilePicture"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:cursor-pointer cursor-pointer transition-all"
                        />
                        <p className="mt-2 text-xs text-gray-500">
                            Accepted formats: JPG, PNG, GIF (Max 5MB)
                        </p>
                    </div>

                    {/* Upload Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={uploading || !profilePic}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {uploading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Uploading...
                            </span>
                        ) : (
                            "Upload Profile Picture"
                        )}
                    </button>

                    {/* File info */}
                    {profilePic && (
                        <div className="text-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                            <p className="font-medium">{profilePic.name}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {(profilePic.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
