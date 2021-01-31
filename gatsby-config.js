module.exports = {
    plugins: [
        new webpack.DefinePlugin({ "global.GENTLY": false })
    ]
}