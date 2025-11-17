import { useState, useEffect } from "react";
import { X, Send, Minus } from "lucide-react";
import axios from "axios";

const Chat = () => {
    const [openChats, setOpenChats] = useState([]);
    const [connectionUsers , setConnectionUsers] = useState([])

    useEffect(()=>{
	
	axios.post("http://localhost:5000/sendConnection" , {} , {withCredentials : true})
	.then(response=>{
		setConnectionUsers(response.data.result)
	    })
	.catch(error =>{
		console.log(error)
	    })

    } , [])



    const getProfileImage = url => {
        return url === "/images/user.png"
            ? "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
            : url;
    };

    const openChat = user => {
        if (!openChats.find(chat => chat.id === user.id)) {
            setOpenChats([...openChats, { ...user, minimized: false }]);
        }
    };

    const closeChat = userId => {
        setOpenChats(openChats.filter(chat => chat.id !== userId));
    };

    const toggleMinimize = userId => {
        setOpenChats(
            openChats.map(chat =>
                chat.id === userId
                    ? { ...chat, minimized: !chat.minimized }
                    : chat
            )
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Main Content Area */}
            <div className="p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">
                        Messages
                    </h1>

                    <div className="bg-white rounded-lg shadow">
                        {connectionUsers.map(user => (
                            <div
                                key={user.id}
                                onClick={() => openChat(user)}
                                className="flex items-center space-x-4 p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <img
                                    src={getProfileImage(user.profileImageUrl)}
                                    alt={user.fullName}
                                    className="w-14 h-14 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800">
                                        {user.fullName}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Facebook-style Chat Windows - Bottom Right */}
            <div className="fixed bottom-0 right-4 flex items-end space-x-3 z-50 h-[600px]">
                {openChats.map((chat, index) => (
                    <div
                        key={chat.id}
                        className="bg-white rounded-t-lg shadow-2xl w-80 flex flex-col"
                        style={{
                            marginRight: index > 0 ? "0" : "0",
                            maxHeight: chat.minimized ? "56px" : "400px",
                        }}
                    >
                        {/* Chat Header */}
                        <div className="flex items-center justify-between p-3 bg-blue-500 text-white rounded-t-lg cursor-pointer">
                            <div
                                className="flex items-center space-x-2 flex-1"
                                onClick={() => toggleMinimize(chat.id)}
                            >
                                <img
                                    src={getProfileImage(chat.profileImageUrl)}
                                    alt={chat.fullName}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <span className="font-semibold text-sm truncate">
                                    {chat.fullName}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={e => {
                                        e.stopPropagation();
                                        toggleMinimize(chat.id);
                                    }}
                                    className="p-1 hover:bg-blue-600 rounded transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={e => {
                                        e.stopPropagation();
                                        closeChat(chat.id);
                                    }}
                                    className="p-1 hover:bg-blue-600 rounded transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Chat Body */}
                        {!chat.minimized && (
                            <>
                                <div
                                    className="flex-1 p-3 overflow-y-auto bg-white"
                                    style={{ height: "280px" }}
                                >
                                    <div className="text-center text-gray-400 text-sm py-8">
                                        No messages yet
                                    </div>
                                </div>

                                {/* Message Input */}
                                <div className="p-3 border-t bg-gray-50">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            placeholder="Type a message..."
                                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                                        />
                                        <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Chat;
