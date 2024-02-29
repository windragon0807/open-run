type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <main className="w-[100dvw] h-[100dvh]">
      <section className="w-full h-full mx-auto max-w-tablet overflow-hidden">{children}</section>
    </main>
  )
}
