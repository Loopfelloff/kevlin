import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import Profile from "../components/Profile";
import Usersearch from "../components/Search";
import axios from "axios";
import Chat from "../components/Chat";

export default function HomePage() {
    const navigation = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [profileImageUrl, setProfileImageUrl] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .post("http://localhost:5000/home", {}, { withCredentials: true })
            .then(response => {
                setLoading(false);
                setUsername(response.data.fullName);
                setEmail(response.data.email);
                setProfileImageUrl(response.data.profileImageUrl);

                console.log(response.data);
            })
            .catch(err => {
                console.log(err);
                navigation("/login");
            });
    }, []);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col justify-center items-center p-8">
            {!loading ? (
                <>
                    <div className="mb-12 text-center">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Welcome Back, {username}!
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Choose an option to get started
                        </p>
                    </div>

                    <div className="flex flex-row gap-8 mb-16">
                        <div
                            className="bg-white rounded-3xl min-h-[140px] w-[160px] shadow-xl hover:shadow-2xl p-8 flex flex-col justify-center items-center gap-4 transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:scale-105 border border-gray-100"
                            onClick={() => {
                                navigation("/home/profile");
                            }}
                        >
                            <div className="text-6xl mb-2">👨</div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Profile
                            </h2>
                            <p className="text-sm text-gray-500 text-center">
                                Manage your account
                            </p>
                        </div>

                        <div
                            className="bg-white rounded-3xl min-h-[140px] w-[160px] shadow-xl hover:shadow-2xl p-8 flex flex-col justify-center items-center gap-4 transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:scale-105 border border-gray-100"
                            onClick={() => {
                                navigation("/home/chat");
                            }}
                        >
                            <div className="text-6xl mb-2">🗨️</div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Chat
                            </h2>
                            <p className="text-sm text-gray-500 text-center">
                                Connect with others
                            </p>
                        </div>

                        <div
                            className="bg-white rounded-3xl min-h-[140px] w-[160px] shadow-xl hover:shadow-2xl p-8 flex flex-col justify-center items-center gap-4 transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:scale-105 border border-gray-100"
                            onClick={() => {
                                navigation("/home/search");
                            }}
                        >
                            <div className="text-6xl mb-2">🔎</div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Search
                            </h2>
                            <p className="text-sm text-gray-500 text-center">
                                Find new people
                            </p>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <TailSpin color="#6366f1" height={60} width={60} />
                    <p className="text-indigo-600 font-medium">
                        Loading your dashboard...
                    </p>
                </div>
            )}

            <Routes>
                <Route path="profile" element={<Profile />} />
                <Route path="search" element={<Usersearch />} />
                <Route path="chat" element={<Chat />} />
            </Routes>
        </div>
    );
}
