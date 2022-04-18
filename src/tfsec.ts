import * as core from '@actions/core'
import * as path from 'path'
import * as github from '@actions/github'

export async function tfsec(input: string, relative_to: string): Promise<void> {
  const data = JSON.parse(input)

  const token =
      core.getInput('token') ||
      process.env.GITHUB_TOKEN

  if (!token) {
      core.setFailed('❌ A token is required to execute this action')
      return
  }

  const octokit = github.getOctokit(token)

  let annotations = []

  for (const result of data.results) {
    const loc = result.location
    const message = `${result.rule_description}`
    const filename = path.join(relative_to, loc.filename)


    const a = {
        path: filename,
        start_line: loc.start_line,
        end_line: loc.end_line,

        title: result.description,
        message: message,

        annotation_level: severityToLevel
    }

    annotations.push(a)

    console.log(message)
      //`::error file=${filename},line=${loc.start_line},endLine=${loc.end_line},title=${result.description}::${message}`
    //)
  }

  const head_sha = github.context.sha
      //commit || (pullRequest && pullRequest.head.sha) || github.context.sha

  const conclusion: 'success' | 'failure' = 'success'

  const request = {
      ...github.context.repo,
      name: 'tfsec',
      head_sha,
      status: 'completed',
      conclusion,
      output: {
          title: '',
          summary: '',
          annotations: annotations,
      }
  }

   core.debug(JSON.stringify(request, null, 2))

  const check = await octokit.rest.checks.create(request)


  //await octokit.rest.checks.update({
      //...github.context.repo,
      //check_run_id: check.data.id,
      //output: {
          //title: '',
          //summary: '',
          //annotations: annotations,
      //}
      ////output.annotations[].path,
      ////output.annotations[].start_line,
      ////output.annotations[].end_line,
      ////output.annotations[].annotation_level,
      ////output.annotations[].message,
      ////output.images[].alt,
      ////output.images[].image_url,
      ////actions[].label,
      ////actions[].description,
      ////actions[].identifier
  //})
}


function severityToLevel(severity: string /* TODO */): string {
    if (severity == 'CRITICAL') {
        return 'failure'
    } else if (severity == 'MEDIUM') { // TODO: does it exist?
        return 'warning'
    } else {
        return 'notice'
    }
}


// https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-an-error-message
// echo "::error file=$line::File is not in canonical format (terraform fmt)"
