import * as core from '@actions/core'
import * as path from 'path'
import {Annotation} from '../annotations'

//interface Flake8Line {
  //path: string
  //line: any
  //col: any
  //text: string
//}


export function parse(
  input: string,
  relative_to: string
): Annotation[] {
  let annotations = []

  for (const inputLine of input.split('\n')) {
    if (inputLine.trim() == '') {
      continue
    }

    var [filePath, line, col, message] = inputLine.split(':', 4)
    message = message.trim()

    const loc = line
    const filename = path.join(relative_to, filePath)

    const [code, errorMessage] = message.split(/ (.*)/s)

    message = `
${message}

See: https://www.flake8rules.com/rules/${code}.html
`.trim()

    line = parseInt(line)

    const a = {
      path: filename,
      start_line: line,
      end_line: line,

      title: errorMessage,
      message: message,

      annotation_level: 'failure'
    }

    console.log(a)
    annotations.push(a)
  }

  return annotations
}
