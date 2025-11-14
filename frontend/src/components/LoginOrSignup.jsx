import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const checkUsernameValidity = username => {
    username = username.trim();
    if (username.length >= 8) return true;
    return false;
};
const checkEmailValidity = email => {
    email = email.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailCheck = emailRegex.test(email);
    if (emailCheck) return true;
    else return false;
};
const checkPasswordValidity = password => {
    password = password.trim();
    const passwordRegex = /^(?=.*\d)(?=.*\W).{8,}$/;
    const passwordCheck = passwordRegex.test(password);
    if (passwordCheck) return true;
    else return false;
};

export default function LoginOrSignup() {
    const { loginOrSignup } = useParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [usernameCorrectFormat, setUsernameCorrectFormat] = useState(true);
    const [passwordCorrectFormat, setPasswordCorrectFormat] = useState(true);
    const [emailCorrectFormat, setEmailCorrectFormat] = useState(true);
    const [feedbackmsg, setFeedbackmsg] = useState("");
    const navigation = useNavigate();

    return (
        <>
            <form
                className="bg-white rounded-2xl min-h-[600px] w-[500px] h-fit shadow-lg p-6 flex flex-col justify-center items-center"
                onSubmit={async e => {
                    e.preventDefault();
                    const isLogin = loginOrSignup === "login";
                    const toSend = isLogin
                        ? { email, password }
                        : { email, password, username };
                    if (
                        passwordCorrectFormat &&
                        emailCorrectFormat &&
                        email.trim() !== "" &&
                        password.trim() !== ""
                    ) {
                        if (
                            !isLogin &&
                            (!usernameCorrectFormat || username.trim() === "")
                        )
                            return;
                        try {
                            const response = await axios.post(
                                `http://localhost:5000/${loginOrSignup}`,
                                toSend,{withCredentials: true}
                            );
                            setFeedbackmsg(response.data.msg);
                            if (loginOrSignup === "signup")
                                navigation("/login");
                            else if (loginOrSignup === "login")
                                navigation("/home");
                        } catch (err) {
                            setFeedbackmsg(err.response.data.msg);
                        }
                    }
                }}
            >
                <div className="flex justify-center items-center p-3 text-2xl font-mono font-bold">
                    {loginOrSignup === "login" ? "Log In" : "Sign Up"}
                </div>

                <div className="flex justify-center items-center p-3 font-mono text-lg font-bold gap-1 border-gray-500 border-2 rounded-[4px] w-full cursor-pointer">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                        alt=""
                        className="w-[20px] h-[20px] translate-y-[4px]"
                    />
                    <a href="http://localhost:5000/auth/google">Login with Google</a>
                </div>

                <div className="encapsulate-field flex flex-col flex-nowrap justify-center items-center gap-16 mt-5 grow w-full">
                    {loginOrSignup === "signup" ? (
                        <div className="flex flex-col flex-nowrap justify-center items-center relative w-full">
                            <input
                                type="text"
                                className="peer h-8 border-b-4 border-b-gray-500 focus:border-b-blue-500 focus:outline-none duration-150 w-full"
                                name="username"
                                id="username"
                                placeholder=" "
                                value={username}
                                onChange={e => {
                                    setUsername(e.target.value);
                                    setUsernameCorrectFormat(
                                        checkUsernameValidity(e.target.value)
                                    );
                                }}
                            />
                            <label
                                htmlFor="username"
                                className="absolute top-0 left-0 peer-placeholder-shown:text-black peer-placeholder-shown:text-lg peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-8 -translate-y-8 peer-focus:text-blue-500 peer-focus:text-sm text-blue-500 text-sm duration-200"
                            >
                                Username*
                            </label>
                            <p
                                className={
                                    username.trim() !== "" &&
                                    usernameCorrectFormat
                                        ? "usernameHelper text-blue-500 text-sm "
                                        : "usernameHelper text-red-500 text-sm "
                                }
                            >
                                {username.trim() === ""
                                    ? ""
                                    : usernameCorrectFormat
                                      ? "Correct Format used"
                                      : "Username are atleast 8 characters long"}
                            </p>
                        </div>
                    ) : (
                        <></>
                    )}
                    {/* EMAIL */}
                    <div className="flex flex-col flex-nowrap justify-center items-center relative w-full">
                        <input
                            type="email"
                            className="peer h-8 border-b-4 border-b-gray-500 focus:border-b-blue-500 focus:outline-none duration-150 w-full"
                            name="email"
                            id="email"
                            placeholder=" "
                            value={email}
                            onChange={e => {
                                setEmail(e.target.value);
                                setEmailCorrectFormat(
                                    checkEmailValidity(e.target.value)
                                );
                            }}
                        />
                        <label
                            htmlFor="email"
                            className="absolute top-0 left-0 peer-placeholder-shown:text-black peer-placeholder-shown:text-lg peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-8 -translate-y-8 peer-focus:text-blue-500 peer-focus:text-sm text-blue-500 text-sm duration-200"
                        >
                            Email*
                        </label>
                        <p
                            className={
                                email.trim() !== "" && emailCorrectFormat
                                    ? "usernameHelper text-blue-500 text-sm "
                                    : "usernameHelper text-red-500 text-sm "
                            }
                        >
                            {email.trim() === ""
                                ? ""
                                : emailCorrectFormat
                                  ? "Correct Format used"
                                  : "Email format is incorrect"}
                        </p>
                    </div>

                    {/* PASSWORD */}
                    <div className="flex flex-col flex-nowrap justify-center items-center relative w-full">
                        <input
                            type="password"
                            className="peer h-8 border-b-4 border-b-gray-500 focus:border-b-blue-500 focus:outline-none duration-150 w-full"
                            name="password"
                            id="password"
                            placeholder=" "
                            value={password}
                            onChange={e => {
                                setPassword(e.target.value);
                                setPasswordCorrectFormat(
                                    checkPasswordValidity(e.target.value)
                                );
                            }}
                        />
                        <label
                            htmlFor="password"
                            className="absolute top-0 left-0 peer-placeholder-shown:text-black peer-placeholder-shown:text-lg peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-8 -translate-y-8 peer-focus:text-blue-500 peer-focus:text-sm text-blue-500 text-sm duration-200"
                        >
                            Password*
                        </label>
                        <p
                            className={
                                password.trim() !== "" && passwordCorrectFormat
                                    ? "usernameHelper text-blue-500 text-sm "
                                    : "usernameHelper text-red-500 text-sm "
                            }
                        >
                            {password.trim() === ""
                                ? ""
                                : passwordCorrectFormat
                                  ? "Correct Format used"
                                  : "Password must be 8 characters long with atleast 1 symbol and 1 number"}
                        </p>

                        <img
                            src="/images/eye-icon.png"
                            alt="show"
                            className="w-[50px] h-[50px] absolute -top-2 right-0 eye-icon cursor-pointer"
                        />
                    </div>

                    {/* SUBMIT */}
                    <input
                        type="submit"
                        value="Submit"
                        className="rounded-[5px] w-full p-3 bg-gray-500 text-xl text-white font-bold cursor-pointer"
                    />
                </div>
                <Link
                    to={loginOrSignup === "login" ? "/signup" : "/login"}
                    className="text-blue-500 underline "
                >
                    {" "}
                    {loginOrSignup === "login"
                        ? `Don't have an accoutn`
                        : `Already have an account`}{" "}
                </Link>
                <p>{feedbackmsg}</p>
            </form>
        </>
    );
}
