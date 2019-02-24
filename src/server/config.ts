import fs from 'fs';
import path from 'path';

const configPath = path.join(__dirname, '../../config/server.json');
const json = fs.readFileSync(configPath).toString();
const config = JSON.parse(json);

export default config;
