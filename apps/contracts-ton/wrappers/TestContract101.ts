import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
} from '@ton/core'

export interface TestContract101Config {
  id: number
  counter: number
}

export function testContract101ConfigToCell(
  config: TestContract101Config
): Cell {
  return beginCell()
    .storeUint(config.id, 32)
    .storeUint(config.counter, 32)
    .endCell()
}

export const Opcodes = {
  OP_INCREASE: 0x7e_87_64_ef,
}

export class TestContract101 implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromAddress(address: Address) {
    return new TestContract101(address)
  }

  static createFromConfig(
    config: TestContract101Config,
    code: Cell,
    workchain = 0
  ) {
    const data = testContract101ConfigToCell(config)
    const init = { code, data }
    return new TestContract101(contractAddress(workchain, init), init)
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    })
  }

  async sendIncrease(
    provider: ContractProvider,
    via: Sender,
    options: {
      increaseBy: number
      value: bigint
      queryID?: number
    }
  ) {
    await provider.internal(via, {
      value: options.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(Opcodes.OP_INCREASE, 32)
        .storeUint(options.queryID ?? 0, 64)
        .storeUint(options.increaseBy, 32)
        .endCell(),
    })
  }

  async getCounter(provider: ContractProvider) {
    const result = await provider.get('currentCounter', [])
    return result.stack.readNumber()
  }

  async getID(provider: ContractProvider) {
    const result = await provider.get('initialId', [])
    return result.stack.readNumber()
  }
}
