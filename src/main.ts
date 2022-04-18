import * as core from '@actions/core'
import {tfsec} from './tfsec'
import {promises as fs} from 'fs';

async function run(): Promise<void> {
  try {
    const format: string = core.getInput('format')
    const input_path: string = core.getInput('input-path')
    const relative_to: string = core.getInput('relative-dir')

    let data: string = await fs.readFile(input_path, 'utf-8')

    tfsec(data, relative_to)

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
