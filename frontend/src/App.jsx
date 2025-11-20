import LoginOrSignupPage from "./pages/LoginOrSignup";
import DefaultPage from "./pages/DefaultPage";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { socket } from "./socket";

export default function App() {
    useEffect(() => {
        socket.connect();

        socket.on("connection", () => {
            console.log(socket.id);
        });
        socket.on("disconnection", () => {
            console.log(socket.id);
        });

        return () => {
            socket.disconnect();
        };
    }, []);
    return (
        <div className="h-screen w-full flex justify-center items-center">
            <Routes>
                <Route path="/:loginOrSignup" element={<LoginOrSignupPage />} />
                <Route path="*" element={<DefaultPage />} />
                <Route path="/home/*" element={<HomePage socket={socket} />} />
            </Routes>
        </div>
    );
}
