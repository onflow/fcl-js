module.exports = {
module: {
    rules: [
    {
        test:  /\.cdc$/,
        use: [
        {
            loader: 'file-loader',
        },
        ],
    },
    ],
},
};