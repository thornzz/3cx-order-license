"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

const Login = () => {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await signIn("credentials", {
      username: email,
      password: password,
      redirect: true,
      callbackUrl: "/dashboard",
    });
  };
  // signInWithEmailAndPassword(auth, email, password)
  //     .then((result) => {
  //         //const user = result.user;
  //     })
  //     .catch((error) => {
  //         // Handle Errors here.
  //         const errorCode = error.code;
  //         const errorMessage = error.message;
  //         // The email of the user's account used.
  //         const email = error.customData.email;
  //
  //         console.log(`${errorCode} ${errorMessage} ${email}`)
  //     });
  //await router.push('/dashboard')

  if(session?.user) {
    router.push('/dashboard')
  }

  return (
    <div
      className="w-screen h-screen flex justify-center items-center
    bg-gradient-to-br from-purple-700 to-amber-700"
    >
      <form
        onSubmit={handleSubmit}
        className="p-10 bg-white rounded-xl drop-shadow-lg space-y-5"
      >
        <h1 className="text-center text-3xl">Lisans Portal Giriş</h1>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-light" htmlFor="email">
            Email
          </label>
          <input
            className="w-96 px-3 py-2 rounded-md border border-slate-400"
            type="email"
            placeholder="E-mail adresi"
            name="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-light" htmlFor="password">
            Şifre
          </label>
          <input
            className="w-96 px-3 py-2 rounded-md border border-slate-400"
            type="password"
            placeholder="Şifre"
            name="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full px-10 py-2 bg-blue-600 text-white rounded-md
            hover:bg-blue-500 hover:drop-shadow-md duration-300 ease-in"
          onClick={handleSubmit}
        >
          Giriş yap
        </button>
      </form>
    </div>
  );
};

export default Login;
