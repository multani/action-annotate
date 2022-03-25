import * as github from '@actions/github'
import * as core from '@actions/core'

export interface Annotation {
  path: string
  start_line: any
  end_line: any
  title: any
  message: string
  annotation_level: string
}

export async function report(
  token: string,
  format: string,
  annotations: Annotation[]
): Promise<void> {
  const octokit = github.getOctokit(token)

  const conclusion: 'success' | 'failure' = 'success'
  const head_sha = github.context.sha

  const request = {
    ...github.context.repo,
    name: `annotations: ${format}`,
    head_sha,
    status: 'completed',
    conclusion,
    output: {
      title: '',
      summary: '',
      annotations: annotations
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
