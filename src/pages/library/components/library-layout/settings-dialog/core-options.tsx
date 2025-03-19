import { Code, Select } from '@radix-ui/themes'

export function CoreOptions({ coreOptions }: { coreOptions: { name: string; options: string[] }[] }) {
  return (
    <div className='mt-4 flex items-start'>
      <h4 className='flex items-center gap-2 py-2 text-lg font-semibold'>
        <span className='icon-[mdi--wrench]' /> Options
      </h4>
      <div className='mt-3 flex flex-col gap-2 px-6'>
        {coreOptions.map(({ name, options }) => {
          return (
            <label className='flex w-fit items-center gap-4' key={name}>
              <Code>{name}</Code>

              <div>
                <Select.Root size='1' value={options[0]}>
                  <Select.Trigger />
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
    </div>
  )
}
