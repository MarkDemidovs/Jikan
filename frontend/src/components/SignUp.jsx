import {useState} from "react";
import axios from 'axios';

export default function SignUp() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    
    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("/jikans/users", {username, password})
        } catch (err) {
            setMessage(err.response?.data?.error || "Sign up Failed");
        }
    }
}