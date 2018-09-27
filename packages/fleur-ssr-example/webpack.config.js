const {
    join
} = require('path')

module.exports = {
    context: join(__dirname, 'src'),
    entry: {
        client: './client'
    },
    output: {
        path: join(__dirname, 'public'),
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'awesome-typescript-loader',
            options: {
                transpileOnly: true,
            }
        }]
    }
}
