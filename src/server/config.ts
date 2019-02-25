import fs from 'fs';
import args from './args';

const json = fs.readFileSync(args.config).toString();
const config = JSON.parse(json);

export default config;
