const merge = require('deepmerge');
const path = require('path');
const fs = require('fs');

module.exports.resolveConfigFile = () => {
    const mode = process.env.NODE_ENV;
    const defaultConfig = require('../config/default.json');

    // Merge config file with default
    const sourceConfig = `../config/${mode === 'production' ? 'production' : 'development'}.json`;

    // Merge if custom config exists, use default as fallback
    return fs.existsSync(path.resolve(__dirname, sourceConfig)) ? merge(
        defaultConfig,
        require(sourceConfig),
        {arrayMerge: (destinationArray, sourceArray) => sourceArray}
    ) : defaultConfig;
};
