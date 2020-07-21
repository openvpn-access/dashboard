const merge = require('deepmerge');
const path = require('path');
const fs = require('fs');

module.exports.resolveConfigFile = () => {
    const defaultConfig = require('../config/default.json');
    const localConfigPath = path.resolve(__dirname, '../config/local.json');
    let config = defaultConfig;

    if (fs.existsSync(localConfigPath)) {
        config = merge(defaultConfig, require('../config/local.json'));
    }

    return config;
};
