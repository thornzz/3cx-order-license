"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { data: session, status: isLoaded } = useSession();

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
  useEffect(() => {
    if (isLoaded === "authenticated") {
      router.push("/dashboard");
    }
  }, [isLoaded, session]);

  return isLoaded === "loading" || isLoaded === "authenticated" ? (
    <div>Sayfa yükleniyor...</div>
  ) : (
    <div className="h-screen font-sans login bg-cover">
      <div className="container mx-auto h-full flex flex-1 justify-center items-center">
        <div className="w-full max-w-lg">
          <div className="leading-loose">
            <form className="max-w-sm m-4 p-10 bg-white bg-opacity-25 rounded shadow-xl">
              <p className="text-white font-medium text-center text-lg font-bold">
                GİRİŞ
              </p>
              <div className="">
                <label className="block text-sm text-white" for="email">
                  E-mail
                </label>

                <input
                  className="w-full px-5 py-1 text-gray-700 bg-gray-300 rounded focus:outline-none focus:bg-white"
                  type="email"
                  id="email"
                  placeholder="E-mail adresi"
                  aria-label="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className="mt-2">
                <label className="block  text-sm text-white">Şifre</label>
                <input
                  className="w-full px-5 py-1 text-gray-700 bg-gray-300 rounded focus:outline-none focus:bg-white"
                  type="password"
                  id="password"
                  placeholder="Şifrenizi giriniz"
                  arial-label="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              <div className="mt-4 items-center flex justify-between flex-row-reverse">
                <button
                  className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 hover:bg-gray-800 rounded"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Giriş
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
