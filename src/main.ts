import * as core from '@actions/core'
import * as tfsec from './plugins/tfsec'
import * as flake8 from './plugins/flake8'
import {Annotation, report} from './annotations'
import {promises as fs} from 'fs'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const token = core.getInput('token') || process.env.GITHUB_TOKEN

    if (!token) {
      core.setFailed('❌ A token is required to execute this action')
      return
    }

    // analyze and parse input
    const format: string = core.getInput('format')
    const input_path: string = core.getInput('input-path')
    const relative_to: string = core.getInput('relative-dir')

    let data: string = await fs.readFile(input_path, 'utf-8')

    var annotations: Annotation[]

    if (format == 'tfsec') {
      annotations = tfsec.parse(data, relative_to)
    } else if (format == 'flake8') {
      annotations = flake8.parse(data, relative_to)
    } else {
      throw 'oh noes'
    }

    report(token, format, annotations)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
