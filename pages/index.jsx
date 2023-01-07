import Head from 'next/head'
import Login from "./login";
import useAuth from "../hooks/useAuth";
import Dashboard from "./dashboard";

export default function Home() {
    //const { user } = useAuth();

  return (
    <div>
      <Head>
        <title>K2M 3CX Lisans Portal</title>
        <meta name="description" content="3CX Order License" />
      </Head>

      <main>
<Login></Login>
      </main>


    </div>
  )
}
