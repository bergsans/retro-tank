const env = process.env.NODE_ENV

module.exports = env => require(`./webpack/webpack.${env}.js`);
