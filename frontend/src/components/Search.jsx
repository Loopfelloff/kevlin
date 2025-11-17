import { useState, useEffect } from "react";
import { Search, User, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Usersearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUser] = useState([]);
    const [messageBox, setMessageBox] = useState(false);
    const [message, setMessage] = useState("");
    const navigation = useNavigate();

    const filteredUsers =
        users.length > 0
            ? users.filter(
                  user =>
                      user.fullName
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                      user.email
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
              )
            : [];
    useEffect(() => {
        axios
            .post(
                "http://localhost:5000/sendUsers",
                {},
                { withCredentials: true }
            )
            .then(response => {
                setUser(response.data.result);
            })
            .catch(err => {
                if (err.response.status === 403) navigation("/login");
            });
    }, []);

    return (
        <>
            {messageBox ? (
                <div className="bg-white rounded-xl shadow-2xl w-[300px] overflow-hidden">
                    <div className=" w-full bg-indigo-600 text-white p-4 flex flex-row justify-between">
                        <h2 className="text-xl font-semibold">Message</h2>
                        <X
                            size={24}
                            className="cursor-pointer hover:text-black"
                            onClick={() => {
                                setMessageBox(false);
                            }}
                        />
                    </div>
                    <div className=" w-full bg-white  p-4 flex flex-row justify-between items-center min-h-[100px] h-fit">
                        {message}
                    </div>
                </div>
            ) : (
                <></>
            )}
            <div className="min-h-screen  bg-gradient-to-br  flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl w-[300px] overflow-hidden">
                    {/* Header */}
                    <div className="bg-indigo-600 text-white p-4">
                        <h2 className="text-xl font-semibold">Find Users</h2>
                    </div>

                    {/* Search Input */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Results List */}
                    <div className="max-h-96 overflow-y-auto">
                        {filteredUsers.length > 0 ? (
                            <div className="divide-y divide-gray-200">
                                {filteredUsers.map((user, index) => (
                                    <div
                                        key={user.id}
                                        className="p-4 flex items-center gap-3 flex-row justify-between"
                                    >
                                        <div className="flex flex-col justify-start max-w-[150px]">
                                            <img
                                                src={
                                                    user.profileImageUrl ===
                                                    "/images/user.png"
                                                        ? "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
                                                        : user.profileImageUrl
                                                }
                                                alt={user.fullName}
                                                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0 flex flex-col justify-start flex-wrap">
                                                <p className="font-medium text-gray-900 truncate">
                                                    {user.fullName}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            className="p-4 rounded-xl bg-indigo-600 text-white cursor-pointer"
                                            onClick={() => {
                                                axios
                                                    .post(
                                                        "http://localhost:5000/connectUser",
                                                        {
                                                            connectionId:
                                                                user.id.toString(),
                                                        },
                                                        {
                                                            withCredentials: true,
                                                        }
                                                    )
                                                    .then(response => {
                                                        setMessageBox(true);
                                                        setMessage(
                                                            response.data.msg
                                                        );
                                                        users.splice(index, 1);
                                                        setUser([...users]);
                                                    })
                                                    .catch(error => {
                                                        if (
                                                            error.response
                                                                .status === 403
                                                        )
                                                            navigation(
                                                                "/login"
                                                            );
                                                        setMessageBox(true);
                                                        setMessage(
                                                            error.response.data
                                                                .msg
                                                        );
                                                        users.splice(index, 1);
                                                        setUser([...users]);
                                                    });
                                            }}
                                        >
                                            Connect
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <User
                                    className="mx-auto text-gray-300 mb-2"
                                    size={48}
                                />
                                <p className="text-gray-500">
                                    {searchQuery
                                        ? "No users found"
                                        : "Start typing to search"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
