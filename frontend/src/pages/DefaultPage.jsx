import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DefaultPage() {
    const navigation = useNavigate();
    useEffect(() => {
        navigation("/login");
    }, []);
}
