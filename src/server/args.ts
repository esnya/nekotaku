import yargs from 'yargs';

export default yargs
  .option('config', {
    alias: 'c',
    default: './config/server.json',
  })
  .argv;
