import { Address, toNano } from '@ton/core'
import { TestContract101 } from '../wrappers/TestContract101'
import { NetworkProvider, sleep } from '@ton/blueprint'

export async function run(provider: NetworkProvider, arguments_: string[]) {
  const ui = provider.ui()

  const address = Address.parse(
    arguments_.length > 0
      ? arguments_[0]
      : await ui.input('TestContract101 address')
  )

  if (!(await provider.isContractDeployed(address))) {
    ui.write(`Error: Contract at address ${address} is not deployed!`)
    return
  }

  const testContract101 = provider.open(
    TestContract101.createFromAddress(address)
  )

  const counterBefore = await testContract101.getCounter()

  await testContract101.sendIncrease(provider.sender(), {
    increaseBy: 1,
    value: toNano('0.05'),
  })

  ui.write('Waiting for counter to increase...')

  let counterAfter = await testContract101.getCounter()
  let attempt = 1
  while (counterAfter === counterBefore) {
    ui.setActionPrompt(`Attempt ${attempt}`)
    await sleep(2000)
    counterAfter = await testContract101.getCounter()
    attempt++
  }

  ui.clearActionPrompt()
  ui.write('Counter increased successfully!')
}
