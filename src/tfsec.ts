import * as path from 'path'
import * as github from '@actions/github'

export function tfsec(input: string, relative_to: string): void {
  const data = JSON.parse(input)

  const token = process.env['GITHUB_TOKEN']
  const octokit = github.getOctokit(myToken)

  const [owner, repo] = process.env['GITHUB_REPOSITORY'].split('/', 2)

  const check = octokit.rest.checks.create({
      ...github.context.repo,
  })

  let annotations = []

  for (const result of data.results) {
    const loc = result.location
    const message = `${result.rule_description}`
    const filename = path.join(relative_to, loc.filename)


    const a = {
        path: filename,
        start_line: loc.start_line,
        end_line: loc.endline,

        title: result.description,
        message: message,
    }

    annotations.push(a)

    console.log(message)
      //`::error file=${filename},line=${loc.start_line},endLine=${loc.end_line},title=${result.description}::${message}`
    //)
  }

  octokit.rest.checks.update({
      ...github.context.repo,
      check.id,
      output: {
          title: '',
          summary: '',
          annotations: annotations,
      }
      //output.annotations[].path,
      //output.annotations[].start_line,
      //output.annotations[].end_line,
      //output.annotations[].annotation_level,
      //output.annotations[].message,
      //output.images[].alt,
      //output.images[].image_url,
      //actions[].label,
      //actions[].description,
      //actions[].identifier
  })
}


// https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-an-error-message
// echo "::error file=$line::File is not in canonical format (terraform fmt)"
