import * as flake8 from '../src/plugins/flake8'
import {expect, test} from '@jest/globals'

test('throws invalid number', async () => {
  const input = `
./foobar/foo.py:18:9: F841 local variable 'x' is assigned to but never used
`
  var annotations = flake8.parse(input, '.')
  expect(annotations.length).toEqual(1)

  var annotation = annotations[0]
  expect(annotation.path).toEqual('foobar/foo.py')
  expect(annotation.title).toEqual(
    "F841 local variable 'x' is assigned to but never used"
  )
  expect(annotation.message).toEqual(
    `See: https://www.flake8rules.com/rules/F841.html`
  )
  expect(annotation.start_line).toEqual(18)
  expect(annotation.end_line).toEqual(18)
  expect(annotation.annotation_level).toEqual('failure')
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
