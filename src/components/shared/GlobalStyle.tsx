type Props = {
  children: React.ReactNode
}

export default function GlobalStyle({ children }: Props) {
  return (
    <main className="w-[100dvw] h-[100dvh] flex justify-center">
      <section className="w-full max-w-[768px]">{children}</section>
    </main>
  )
}
