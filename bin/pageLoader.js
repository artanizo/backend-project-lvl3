#!/usr/bin/env node

import { Command } from 'commander';
import pageLoader from '../index.js';

const currentDir = process.cwd();
const program = new Command();

program.version('0.0.1')
  .description('Page loader utility')
  .option('-o, --output [dir]', 'Output dir', currentDir)
  .arguments('<url>')
  .action((url, options) => pageLoader(url, options))
  .parse(process.argv);

if (!program.args.length) program.help();
