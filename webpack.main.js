const path = require('path')

module.exports = {
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@utils': path.join(__dirname, 'src', 'main/utils'),
            '@services': path.join(__dirname, 'src', 'main/services'),
            '@models': path.join(__dirname, 'src', 'common/models'),
        },
    }
}