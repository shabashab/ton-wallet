import { toNano } from '@ton/core'
import { TestContract101 } from '../wrappers/TestContract101'
import { compile, NetworkProvider } from '@ton/blueprint'

export async function run(provider: NetworkProvider) {
  const testContract101 = provider.open(
    TestContract101.createFromConfig(
      {
        id: Math.floor(Math.random() * 10_000),
        counter: 0,
      },
      await compile('TestContract101')
    )
  )

  await testContract101.sendDeploy(provider.sender(), toNano('0.05'))

  await provider.waitForDeploy(testContract101.address)

  console.log('ID', await testContract101.getID())
}
