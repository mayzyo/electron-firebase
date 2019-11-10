const path = require('path')

module.exports = {
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@models': path.join(__dirname, 'src', 'common/models'),
            '@components': path.join(__dirname, 'src', 'renderer/components'),
            '@hooks': path.join(__dirname, 'src', 'renderer/hooks'),
        },
    }
}