import Image from 'next/image'

export default function HomePage() {
  return (
    <>
      {process.env.NEXT_PUBLIC_APP_NAME}
    </>
  )
}
