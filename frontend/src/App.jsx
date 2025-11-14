import LoginOrSignupPage from "./pages/LoginOrSignup";
import DefaultPage from "./pages/DefaultPage";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";

export default function App() {
    return (
        <div className="h-screen w-full flex justify-center items-center">
            <Routes>
                <Route path="/:loginOrSignup" element={<LoginOrSignupPage />} />
                <Route path="*" element={<DefaultPage />} />
                <Route path="/home/*" element={<HomePage />} />
            </Routes>
        </div>
    );
}
