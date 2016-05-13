module.exports = {
    entry: __dirname + "/src/topophilia.js",
    output: {
        path: __dirname+'/dist',
        filename: "topophilia.js", 
        libraryTarget: "var",
        library: "Topophilia"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.js$/, loader: "babel-loader"}
        ]
    }
};
