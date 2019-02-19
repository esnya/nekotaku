import defaultsDeep from 'lodash/defaultsDeep';
import config from '../../config/config.json';
import defaultConfig from '../../config/default.json';

export default defaultsDeep(config, defaultConfig);
