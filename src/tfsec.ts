import * as path from 'path'

export function tfsec(input: string, relative_to: string): void {
  const data = JSON.parse(input)

  for (const result of data.results) {
    const loc = result.location
    const message = `${result.rule_description}`

    const filename = path.join(relative_to, loc.filename)

    console.log(
      `::error file=${filename},line=${loc.start_line},endLine=${loc.end_line},title=${result.description}::${message}`
    )
  }
}


// https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-an-error-message
// echo "::error file=$line::File is not in canonical format (terraform fmt)"
