import * as core from '@actions/core'
import * as path from 'path'
import {Annotation} from '../annotations'

const removePrefix = (value: string, prefix: string): string =>
  value.startsWith(prefix) ? value.slice(prefix.length) : value

export function parse(input: string, relative_to: string): Annotation[] {
  const data = JSON.parse(input)

  const workspace = '/github/workspace/'

  let annotations = []

  for (const result of data.results) {
    const loc = result.location
    //const message = `${result.rule_description}`

    const relativeFilename = removePrefix(loc.filename, workspace)
    console.log(`relativeFilename: ${relativeFilename}`)
    console.log(`workspace: ${workspace}`)

    //const filename = path.join(relative_to, relativeFilename)
    const filename = relativeFilename

    let infos = []

    infos.push(`
${result.rule_description}

Impact: ${result.impact}

How to solve: ${result.resolution}

See:
`)

    //infos.push(result.rule_description)
    //infos.push(`(impact: ${result.impact})`)
    //infos.push(`How to solve: ${result.resolution}`)
    //infos.push('See:')
    for (const link of result.links) {
      infos.push(`* ${link}`)
    }

    const message = infos.join('\n')

    const a = {
      path: filename,
      start_line: loc.start_line,
      end_line: loc.end_line,

      title: result.description,
      message: message,

      annotation_level: severityToLevel(result.severity)
    }

    annotations.push(a)

    console.log(message)
    //`::error file=${filename},line=${loc.start_line},endLine=${loc.end_line},title=${result.description}::${message}`
    //)
  }

  //commit || (pullRequest && pullRequest.head.sha) || github.context.sha

  return annotations
}

function severityToLevel(severity: string /* TODO */): string {
  if (severity == 'CRITICAL') {
    return 'failure'
  } else if (severity == 'MEDIUM') {
    // TODO: does it exist?
    return 'warning'
  } else {
    return 'notice'
  }
}

// https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-an-error-message
// echo "::error file=$line::File is not in canonical format (terraform fmt)"
