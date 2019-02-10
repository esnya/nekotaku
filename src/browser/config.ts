import defaultsDeep from 'lodash/defaultsDeep';
import defaultConfig from '../../config/default.json';
import config from '../../config/config.json';

export default defaultsDeep(config, defaultConfig);
