export function tfsec(input: string): void {
  const data = JSON.parse(input)

  for (const result of data.results) {
    const loc = result.location
    const message = `${result.rule_description}`

    console.log(
      `::error file=${loc.filename},line=${loc.start_line},endLine=${loc.end_line},title=${result.description}::${message}`
    )
  }
}


// https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-an-error-message
// echo "::error file=$line::File is not in canonical format (terraform fmt)"