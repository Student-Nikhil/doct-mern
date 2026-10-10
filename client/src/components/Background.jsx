export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-24 -top-24 h-[28rem] w-[28rem] animate-drift rounded-full bg-teal-400/30 blur-3xl dark:bg-teal-500/20" />
      <div className="absolute -right-20 top-1/3 h-[24rem] w-[24rem] animate-drift rounded-full bg-coral-400/25 blur-3xl [animation-delay:-5s] dark:bg-coral-500/10" />
      <div className="absolute -bottom-32 left-1/3 h-[26rem] w-[26rem] animate-drift rounded-full bg-teal-100 blur-3xl [animation-delay:-9s] dark:bg-teal-800/20" />
    </div>
  );
}
