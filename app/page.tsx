export default function Home() {
  const titles = [
    { text: "DEMOS", sprite: "/demos-sprite.png" },
    { text: "INTRO", sprite: "/intro-sprite.png" },
    { text: "DETAILS", sprite: "/details-sprite.png" },
    { text: "WRAP UP", sprite: "/wrap-up-sprite.png" },
  ];

  return (
    <main className="titles-stage">
      <h1 className="sr-only">Animated section titles</h1>
      {titles.map(({ text, sprite }) => (
        <section className="title-item" key={text}>
          <h2 className="sr-only">{text}</h2>
          <div className="title-window" aria-hidden="true">
            <div className="title-frames" style={{ backgroundImage: `url(${sprite})` }} />
          </div>
        </section>
      ))}
    </main>
  );
}
