export default function HomePage() {
  return (
    <div>
      <title>RetroAssembly</title>

      <div className='text-center'>
        <h1 className='p-40 text-4xl'>RetroAssembly</h1>
        <div>Maintain and enjoy your retro game collection inside browsers.</div>
        <div className='flex items-center justify-center'>
          <a className='rounded bg-neutral-100 px-8 py-4 text-xl' href='/library'>
            Open my library
          </a>
          <a className='rounded bg-neutral-100 px-8 py-4 text-xl' href='/demo'>
            View demo
          </a>
        </div>
      </div>

      <section>
        <h2>Features</h2>

        <div>Well tuned user interface with first-class gamepad support</div>
        <div>Upload & Play</div>
        <div>Save states and sync them seamlessly</div>
      </section>

      <section>
        Pricing
        <div>0 / month</div>
        <div>0 / year</div>
        <div>0 / Lifetime</div>
      </section>

      <section>
        Ready to build your game collection?
        <div>0 / month</div>
        <div>0 / year</div>
        <div>0 / Lifetime</div>
      </section>

      <div>
        <div>Ready to build your game collection?</div>
        <a className='rounded bg-neutral-100 px-8 py-4 text-xl' href='/library'>
          Get involved
        </a>
      </div>
    </div>
  )
}
