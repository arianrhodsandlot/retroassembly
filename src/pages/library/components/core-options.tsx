import { Code, Select } from '@radix-ui/themes'

export function CoreOptions({ coreOptions }: { coreOptions: { name: string; options: string[] }[] }) {
  return (
    <>
      <h3 className='flex items-center gap-2 py-2 text-lg font-semibold'>
        <span className='icon-[mdi--wrench]' /> Options
      </h3>
      <div className='flex flex-col gap-2 px-6'>
        {coreOptions.map(({ name, options }) => {
          return (
            <label className='flex w-fit items-center gap-4'>
              <Code>{name}</Code>

              <div>
                <Select.Root size='3' value={options[0]}>
                  <Select.Trigger variant='ghost' />
                  <Select.Content>
                    {options.map((option) => (
                      <Select.Item key={option} value={option}>
                        {option}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
            </label>
          )
        })}
      </div>
    </>
  )
}
