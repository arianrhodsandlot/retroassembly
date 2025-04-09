export function FeaturesSection() {
  return (
    <section className='w-full py-16'>
      <div className='mx-auto max-w-6xl text-center'>
        <h2 className='mb-6 text-3xl font-bold'>Features</h2>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          <div className='rounded-lg p-6 shadow-md'>
            <h3 className='mb-2 text-xl font-semibold'>
              <span className='icon-[mdi--web-box]' />
              Browser-Based Gameplay
            </h3>
            <p className='text-gray-300'>Play retro games directly in your browser without additional software.</p>
          </div>
          <div className='rounded-lg p-6 shadow-md'>
            <h3 className='mb-2 text-xl font-semibold'>
              <span className='icon-[mdi--space-invaders]' />
              Multi-Platform Support
            </h3>
            <p className='text-gray-300'>Supports a wide range of retro gaming systems.</p>
          </div>
          <div className='rounded-lg p-6 shadow-md'>
            <h3 className='mb-2 text-xl font-semibold'>
              <span className='icon-[mdi--cloud]' />
              Cloud Sync
            </h3>
            <p className='text-gray-300'>Save your progress and access it from anywhere.</p>
          </div>
          <div className='rounded-lg p-6 shadow-md'>
            <h3 className='mb-2 text-xl font-semibold'>
              <span className='icon-[mdi--drawing-box]' />
              Automatic Boxart Retrieval
            </h3>
            <p className='text-gray-300'>Automatically fetch game boxarts to enhance your library's visual appeal.</p>
          </div>
          <div className='rounded-lg p-6 shadow-md'>
            <h3 className='mb-2 text-xl font-semibold'>
              <span className='icon-[mdi--controller-round]' />
              Joystick-Friendly Navigation
            </h3>
            <p className='text-gray-300'>Navigate seamlessly using a joystick without needing a mouse or keyboard.</p>
          </div>
          <div className='rounded-lg p-6 shadow-md'>
            <h3 className='mb-2 text-xl font-semibold'>
              <span className='icon-[mdi--clock-arrow]' />
              Rewind Gameplay
            </h3>
            <p className='text-gray-300'>
              Rewind gameplay using <kbd>R</kbd> or a controller button combination (Select + L2).
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
