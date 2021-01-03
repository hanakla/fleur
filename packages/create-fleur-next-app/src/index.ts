#!/usr/bin/env node

import { Command } from 'commander'
import chalk from 'chalk'
import packageJson from '../package.json'
import cpy from 'cpy'
import path from 'path'
import { spawn } from 'child_process'
import { writeFileSync, existsSync } from 'fs'
import validateProjectName from 'validate-npm-package-name'

let appName: string = ''

const APP_DEPS = [
  '@fleur/fleur',
  '@fleur/react',
  '@fleur/next',
  'next',
  'react',
  'react-dom',
]

const APP_DEV_DEPS = ['typescript', '@types/react', '@types/node']

const program = new Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<project-directory>')
  .usage(`${chalk.green`a`}`)
  .action(name => {
    appName = name.trim()
  })
  .option('--use-npm')
  .parse(process.argv)

const printValidationResults = (errors: string[] = []) => {
  errors.forEach(error => console.log(`  ${chalk.red(error)}`))
}

async function run() {
  if (!appName) {
    console.log()
    console.log(`${chalk.red('Please specify the project directory:')}`)
    console.log(
      `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`,
    )
    console.log()

    process.exit(1)
  }

  const validation = validateProjectName(appName)
  if (!validation.validForNewPackages) {
    console.log(validation)
    console.log()
    console.log(chalk.red(`Invalid project name: \`${appName}\``))
    printValidationResults(validation.errors)
    printValidationResults(validation.warnings)
    console.log()

    process.exit(1)
  }

  const appPath = path.resolve(appName)

  if (existsSync(appPath)) {
    console.log()
    console.log(chalk.red(`Project directory \`${appName}\` already exists`))
    console.log(
      chalk.red('Please remove it or specify another project-directpry'),
    )
    console.log()

    process.exit(1)
  }

  await cpy('**', appPath, {
    parents: true,
    cwd: path.join(__dirname, '../template'),
    rename: name => {
      if (name === 'gitignore') return '.gitignore'
      return name
    },
  })

  const packageJsonPath = path.join(appPath, 'package.json')
  const appPackageJson = require(packageJsonPath)
  appPackageJson.name = appName
  writeFileSync(packageJsonPath, JSON.stringify(appPackageJson, null, '  '))

  {
    const packageCommands: [string, string[]][] = program.useNpm
      ? [
          ['npm', ['install', ...APP_DEPS]],
          ['npm', ['install', '-D', ...APP_DEV_DEPS]],
        ]
      : [
          ['yarn', ['add', ...APP_DEPS]],
          ['yarn', ['add', '-D', ...APP_DEV_DEPS]],
        ]

    for (let command of packageCommands) {
      await new Promise<void>((resolve, reject) => {
        const [proc, args] = command

        spawn(proc, args, {
          stdio: 'inherit',
          cwd: appPath,
          env: { ...process.env },
        }).on('close', code => {
          if (code !== 0) {
            reject(new Error('`yarn install` failed'))
            return
          }

          resolve()
        })
      })
    }
  }

  console.log(`${chalk.green('Success!')} Created ${appName} at ${appPath}`)
}

run().catch(() => {
  console.log()
  console.log(chalk.red('Installation failed.'))
  console.log()
})
