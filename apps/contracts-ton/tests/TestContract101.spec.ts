import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox'
import { Cell, toNano } from '@ton/core'
import { TestContract101 } from '../wrappers/TestContract101'
import '@ton/test-utils'
import { compile } from '@ton/blueprint'

describe('TestContract101', () => {
  let code: Cell

  beforeAll(async () => {
    code = await compile('TestContract101')
  })

  let blockchain: Blockchain
  let deployer: SandboxContract<TreasuryContract>
  let testContract101: SandboxContract<TestContract101>

  beforeEach(async () => {
    blockchain = await Blockchain.create()

    testContract101 = blockchain.openContract(
      TestContract101.createFromConfig(
        {
          id: 0,
          counter: 0,
        },
        code
      )
    )

    deployer = await blockchain.treasury('deployer')

    const deployResult = await testContract101.sendDeploy(
      deployer.getSender(),
      toNano('0.05')
    )

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: testContract101.address,
      deploy: true,
      success: true,
    })
  })

  it('should deploy', async () => {
    // the check is done inside beforeEach
    // blockchain and testContract101 are ready to use
  })

  it('should increase counter', async () => {
    const increaseTimes = 3
    for (let index = 0; index < increaseTimes; index++) {
      console.log(`increase ${index + 1}/${increaseTimes}`)

      const increaser = await blockchain.treasury(`increaser ${index}`)

      const counterBefore = await testContract101.getCounter()

      console.log('counter before increasing', counterBefore)

      const increaseBy = Math.floor(Math.random() * 100)

      console.log('increasing by', increaseBy)

      const increaseResult = await testContract101.sendIncrease(
        increaser.getSender(),
        {
          increaseBy,
          value: toNano('0.05'),
        }
      )

      expect(increaseResult.transactions).toHaveTransaction({
        from: increaser.address,
        to: testContract101.address,
        success: true,
      })

      const counterAfter = await testContract101.getCounter()

      console.log('counter after increasing', counterAfter)

      expect(counterAfter).toBe(counterBefore + increaseBy)
    }
  })
})
