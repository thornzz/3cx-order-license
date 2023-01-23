import React from 'react'
import Image from 'next/image'
function template() {
  return (
    <div>  <Image
    src="/cert.png"
    alt="3CX Cert"
    width={700}
    height={500}
    className="mt-2 hover:cursor-pointer"
    onClick={() => router.push("/dashboard")}
  ></Image></div>
  )
}

export default template