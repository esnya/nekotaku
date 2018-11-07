import _ from 'lodash';
import defaultConfig from '../../config/default.json';
import config from '../../config/config.json';

export default _.defaultsDeep(config, defaultConfig);
