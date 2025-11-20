import { useState, useEffect, useRef } from "react";
import { X, Send, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Chat = ({ socket }) => {
    const divRefs = useRef([])
    const navigation = useNavigate();
    const [openChats, setOpenChats] = useState([]);
    const [connectionUsers, setConnectionUsers] = useState([]);
    const [chatMessage, setChatMessage] = useState({});
    const [chatMessageHistory, setChatMessageHistory] = useState({});
    const [userName, setUserName] = useState({});


    useEffect(() => {

        axios
            .post(
                "http://localhost:5000/sendConnection",
                {},
                { withCredentials: true }
            )
            .then(response => {
                setConnectionUsers(response.data.result);
                setUserName({
                    sender: response.data.sender,
                    senderId: response.data.senderId,
                });
            })
            .catch(error => {
                if (error.response.status === 403) return navigation("/login");
                console.log(error);
            });
    }, []);


    useEffect(()=>{

	const socketMessageHandler =  (message, sender, senderId) => {
	    console.log(message , sender , senderId)
	    const tempChatMessageHistory = {...chatMessageHistory}
	    if(!tempChatMessageHistory[senderId]) return
	    
	    tempChatMessageHistory[senderId] = [...tempChatMessageHistory[senderId] , {message : message , messageId : tempChatMessageHistory[senderId].length + 1 , sentByMe : false}]
	    setChatMessageHistory(tempChatMessageHistory)
	    
	}

	socket.on('receiveMessage', socketMessageHandler)
    } , [chatMessageHistory])

    useEffect(()=>{

	if(!divRefs.current[divRefs.current.length-1])  divRefs.current.pop()

	console.log(divRefs.current)
	
    }, [openChats])

    const showDiv = (index)=>{

	divRefs.current[index].scrollTop =  divRefs.current[index].scrollHeight 
	
    }

    const getProfileImage = url => {
        return url === "/images/user.png"
            ? "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
            : url;
    };

    const openChat = user => {
        // this takes individual item fullName: , email: , profileImageUrl: , and just adds new property called minimized: false initially
        if (!openChats.find(chat => chat.id === user.id)) {
            setOpenChats([...openChats, { ...user, minimized: false }]);
        }
    };

    const getChatHistory = async user => {
        try {
            const response = await axios.post(
                "http://localhost:5000/sendMessage/getMessage",
                { communicator: user.id },
                { withCredentials: true }
            );

            let tempChatHistory = { ...chatMessageHistory };

            tempChatHistory[user.id] = response.data.result;

            setChatMessageHistory(tempChatHistory);
        } catch (error) {
            if (error.response.status === 403) return navigation("/login");
            console.log(error);
        }
    };

    const changeChatMessage = (chatId, message) => {
        const tempChatMessage = { ...chatMessage };

        tempChatMessage[chatId] = message;

        setChatMessage({ ...tempChatMessage });
    };

    const closeChat = userId => {
        // only open chats are rendered so for close chats only those chats are set whose chatId doesn't match the userId that is sent inside
        setOpenChats(openChats.filter(chat => chat.id !== userId));
    };

    const toggleMinimize = userId => {
        // this only toggles the minimized property in each openChat item.
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
                                onClick={async () => {
                                    await getChatHistory(user);
                                    openChat(user);
                                }}
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
                                <div className="flex-1 p-3 overflow-y-scroll bg-white "
				    ref={(el)=>divRefs.current[index] = el}
				>
                                    <div className=" text-sm py-1  flex flex-col justify-start relative">
                                        <ul className="h-[250px] p-4 flex flex-col justify-start gap-1 relative ">
                                            {chatMessageHistory[chat.id] &&
                                            chatMessageHistory[chat.id].length >
                                                0
                                                ? chatMessageHistory[
                                                      chat.id
                                                  ].map((item, index) => {
                                                      return (
                                                          <li
                                                              key={
                                                                  item.messageId
                                                              }
                                                              className={
                                                                  !item.sentByMe
                                                                      ? "bg-red-500 text-white p-4 rounded-xl w-[70%] self-start relative"
                                                                      : "bg-blue-500 text-white p-4 rounded-xl w-[70%] self-end relative"
                                                              }
                                                          >
                                                              {item.message ||
                                                                  "some problem here"}{" "}
                                                              {item.unsent ? (
                                                                  <span
                                                                      className="italic text-gray-500
						absolute right-2 bottom-0	
							"
                                                                  >
                                                                      unsent
                                                                  </span>
                                                              ) : (
                                                                  ""
                                                              )}{" "}
                                                          </li>
                                                      );
                                                  })
                                                : "No message yet so far"}
					    <li className="p-4 invisible">Anchor</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Message Input */}
                                <div className="p-3 border-t bg-gray-50">
                                    <div className="flex items-center space-x-2 w-full">
                                        <form
                                            action=""
                                            className="w-full flex-1 flex justify-center"
                                            onSubmit={async e => {
						e.preventDefault()
                                                const tempChatMessageHistory = {
                                                    ...chatMessageHistory,
                                                };

                                                tempChatMessageHistory[
                                                    chat.id
                                                ] = [
                                                    ...tempChatMessageHistory[
                                                        chat.id
                                                    ],
                                                    {
                                                        messageId:
                                                            tempChatMessageHistory[
                                                                chat.id
                                                            ].length + 1,
                                                        message:
                                                            chatMessage[
                                                                chat.id
                                                            ],
                                                        sentByMe: true,
                                                        unsent: true,
                                                    },
                                                ];

						showDiv(index)

                                                setChatMessageHistory(
                                                    tempChatMessageHistory
                                                );

                                                changeChatMessage(chat.id, "");
                                                if (
                                                    !chatMessage[chat.id] ||
                                                    chatMessage[
                                                        chat.id
                                                    ]?.trim() === ""
                                                )
                                                    return;
                                                axios
                                                    .post(
                                                        "http://localhost:5000/sendMessage",
                                                        {
                                                            receiver: chat.id,
                                                            message:
                                                                chatMessage[
                                                                    chat.id
                                                                ],
                                                        },
                                                        {
                                                            withCredentials: true,
                                                        }
                                                    )
                                                    .then(async response => {
                                                        try {
                                                            await getChatHistory(
                                                                { id: chat.id }
                                                            );
                                                        } catch (error) {
                                                            console.log(error);
                                                        }

                                                        socket.emit(
                                                            "sendMessage",
                                                            chatMessage[
                                                                chat.id
                                                            ],
                                                            connectionUsers.filter(
                                                                item =>
                                                                    item.id ===
                                                                    chat.id
                                                            ),
                                                            userName.sender,
                                                            userName.senderId
                                                        );
                                                    })
                                                    .catch(error => {
                                                        console.log(error);
                                                        if (
                                                            error.response
                                                                .status === 403
                                                        )
                                                            return navigation(
                                                                "/login"
                                                            );
                                                    });
                                            }}
                                        >
                                            <input
                                                type="text"
                                                placeholder="Type a message..."
                                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                                                value={
                                                    chatMessage[chat.id] || ""
                                                }
                                                onChange={e => {
                                                    changeChatMessage(
                                                        chat.id,
                                                        e.target.value
                                                    );
                                                }}
                                                name="message"
						autoComplete="off" 
                                            />
                                            <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                                                <Send className="w-4 h-4" />
                                            </button>
                                        </form>
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
