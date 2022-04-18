import * as core from '@actions/core'
import {tfsec} from './tfsec'

async function run(): Promise<void> {
  try {
    const format: string = core.getInput('format')
    const input_path: string = core.getInput('input-path')

    tfsec(input_path)

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
