import Image from 'next/image'

export default function Home() {
  return (
    <>
      {process.env.NEXT_PUBLIC_APP_NAME}
    </>
  )
}
