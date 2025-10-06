const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDevelopment ? '[name].js' : '[name].[contenthash].js',
      publicPath: '/',
      clean: true,
    },
    resolve: {
      alias: {
        'react-native$': 'react-native-web',
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.web.js', '.js', '.jsx', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            'thread-loader',
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify({
          NODE_ENV: process.env.NODE_ENV || 'development',
          REACT_APP_API_URL: process.env.REACT_APP_API_URL,
          REACT_APP_ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT,
          REACT_APP_FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY,
          REACT_APP_FIREBASE_AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
          REACT_APP_FIREBASE_DATABASE_URL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
          REACT_APP_FIREBASE_PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID,
          REACT_APP_FIREBASE_STORAGE_BUCKET: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
          REACT_APP_FIREBASE_MESSAGING_SENDER_ID: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
          REACT_APP_FIREBASE_APP_ID: process.env.REACT_APP_FIREBASE_APP_ID,
          // App branding environment variables
          REACT_APP_BRAND_NAME: process.env.APP_BRAND_NAME,
          REACT_APP_DISPLAY_NAME: process.env.APP_DISPLAY_NAME,
          REACT_APP_LEGAL_EMAIL: process.env.APP_LEGAL_EMAIL,
          REACT_APP_PRIVACY_EMAIL: process.env.APP_PRIVACY_EMAIL,
          REACT_APP_SUPPORT_EMAIL: process.env.APP_SUPPORT_EMAIL,
          REACT_APP_CONTACT_ADDRESS: process.env.APP_CONTACT_ADDRESS,
        }),
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public',
            to: '',
            globOptions: {
              ignore: ['**/index.html'], // Exclude index.html as it's handled by HtmlWebpackPlugin
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        inject: true,
        ...(isDevelopment
          ? {}
          : {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }),
      }),
      ...(isDevelopment
        ? []
        : [
            new GenerateSW({
              clientsClaim: true,
              skipWaiting: true,
              runtimeCaching: [
                {
                  urlPattern: new RegExp(`^${process.env.GOOGLE_FONTS_STYLESHEETS_URL || 'https://fonts\\.googleapis\\.com'}/`),
                  handler: 'StaleWhileRevalidate',
                  options: {
                    cacheName: 'google-fonts-stylesheets',
                  },
                },
                {
                  urlPattern: new RegExp(`^${process.env.GOOGLE_FONTS_WEBFONTS_URL || 'https://fonts\\.gstatic\\.com'}/`),
                  handler: 'CacheFirst',
                  options: {
                    cacheName: 'google-fonts-webfonts',
                    expiration: {
                      maxEntries: parseInt(process.env.CACHE_MAX_ENTRIES) || 30,
                      maxAgeSeconds: parseInt(process.env.CACHE_MAX_AGE_SECONDS) || 60 * 60 * 24 * 365, // 1 year
                    },
                  },
                },
              ],
            }),
          ]),
    ],
    devServer: {
      static: [
        {
          directory: path.join(__dirname, 'dist'),
        },
        {
          directory: path.join(__dirname, 'public'),
          publicPath: '/',
        },
      ],
      port: parseInt(process.env.FRONTEND_DEV_PORT) || 3000,
      hot: process.env.WEBPACK_DEV_HOT !== 'false',
      historyApiFallback: true,
      open: process.env.WEBPACK_DEV_OPEN !== 'false',
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
      // Optimize build performance
      ...(isDevelopment
        ? {}
        : {
            usedExports: true,
            sideEffects: false,
          }),
    },
    // Add caching for better build performance
    cache: {
      type: 'filesystem',
      cacheDirectory: path.resolve(__dirname, '.webpack-cache'),
      buildDependencies: {
        config: [__filename],
      },
    },
    // Improve performance in production builds
    ...(isDevelopment
      ? {}
      : {
          performance: {
            maxAssetSize: 500000,
            maxEntrypointSize: 500000,
            hints: 'warning',
          },
        }),
  };
};