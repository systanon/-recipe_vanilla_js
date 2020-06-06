const path = require('path');
const os = require('os');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDev = module.mode === 'development';
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const babelOptions = (preset) => {
  const opts = {
    presets: ['@babel/preset-env'],
    plugins: ['@babel/plugin-proposal-class-properties'],
  };

  if (preset) {
    opts.presets.push(preset);
  }

  return opts;
};
const plugins = () => {
  let res = [
    new HtmlWebpackPlugin({
      template: './../public/index.html',
    }),
    new CleanWebpackPlugin(),
  ];
  return res;
};
const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: babelOptions(),
    },
  ];

  if (isDev) {
    loaders.push('eslint-loader');
  }

  return loaders;
};
const brouser = (brouser) => {
  return os.platform() === 'linux' ? 'Google Chrome' :
    os.platform() === 'win32' ? 'Edge' : os.platform() === 'darwin' ? 'Safari' :
      brouser
  false
}
module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: ['@babel/polyfill', './index.js'],
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
      {
        test: /\.(png|jpg|jpeg|svg|gif)$/,
        use: ['file-loader'],
      },
    ],
  },
};
