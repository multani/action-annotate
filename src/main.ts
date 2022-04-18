import * as core from '@actions/core'
import {tfsec} from './tfsec'
import {promises as fs} from 'fs';

async function run(): Promise<void> {
  try {
    const format: string = core.getInput('format')
    const input_path: string = core.getInput('input-path')

    let data: string = await fs.readFile(input_path, 'utf-8')

    tfsec(data)

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
