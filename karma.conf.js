// Karma configuration
// Generated on Thu Jul 21 2022 09:45:33 GMT+0200 (Central European Summer Time)

module.exports = function (config) {
  config.set({

    basePath: '',
    frameworks: ['jasmine'],

    files: [
      {pattern: 'src/**/*.html'},
      {pattern: 'src/**/*.js'},
      {pattern: 'test/**/*spec.js'},
      {pattern: 'test/**/*.html'}
    ],

    exclude: [
    ],

    preprocessors: {
      'src/**/*.js': ['esbuild'],
      'test/**/*.js': ['esbuild'],
      '**/*.html': ['html2js']
    },


    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    // browsers: ['ChromeHeadless'],
    browsers: ['Chromium'],
    singleRun: false,
    concurrency: Infinity
  })
}
