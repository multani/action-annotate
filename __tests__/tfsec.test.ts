import * as tfsec from '../src/plugins/tfsec'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'

test('throws invalid number', async () => {
  const input = `
    {
	"results": [
		{
			"rule_id": "AVD-AWS-0123",
			"long_id": "aws-iam-enforce-mfa",
			"rule_description": "IAM Groups should have MFA enforcement activated.",
			"rule_provider": "aws",
			"rule_service": "iam",
			"impact": "User accounts are more vulnerable to compromise without multi factor authentication activated",
			"resolution": "Use terraform-module/enforce-mfa/aws to ensure that MFA is enforced",
			"links": [
				"https://aquasecurity.github.io/tfsec/v1.12.0/checks/aws/iam/enforce-mfa/",
				"https://registry.terraform.io/modules/terraform-module/enforce-mfa/aws/latest",
				"https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_passwords_account-policy.html#password-policy-details"
			],
			"description": "Multi-Factor authentication is not enforced for group",
			"severity": "MEDIUM",
			"status": 0,
			"resource": "aws_iam_group.developers",
			"location": {
				"filename": "/home/jballet/perso/projects/annotate-action/examples/tfsec/error.tf",
				"start_line": 1,
				"end_line": 3
			}
		}
	]
}
`
  var annotations = tfsec.parse(input, '.')
  expect(annotations.length).toEqual(1)

  var annotation = annotations[0]
  expect(annotation.path).toEqual(
    '/home/jballet/perso/projects/annotate-action/examples/tfsec/error.tf'
  )
  expect(annotation.start_line).toEqual(1)
  expect(annotation.end_line).toEqual(3)
})

//test('wait 500 ms', async () => {
//  const start = new Date()
//  await wait(500)
//  const end = new Date()
//  var delta = Math.abs(end.getTime() - start.getTime())
//  expect(delta).toBeGreaterThan(450)
//})
//
//// shows how the runner will run a javascript action with env / stdout protocol
//test('test runs', () => {
//  process.env['INPUT_MILLISECONDS'] = '500'
//  const np = process.execPath
//  const ip = path.join(__dirname, '..', 'lib', 'main.js')
//  const options: cp.ExecFileSyncOptions = {
//    env: process.env
//  }
//  console.log(cp.execFileSync(np, [ip], options).toString())
//})
//
