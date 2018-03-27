module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['Gruntfile.js', 'app/public/js/utils/**/*.js']
        },
        clean: {
            all: [
                'dist/**/*',
            ],
            prejs: [
                'dist/public/prejs'
            ]
        },
        concat: {
            options: {
                seperator: ''
            },
            dist: {
                files: {
                    'dist/public/prejs/app.min.js': [
                        'app/public/js/utils/tool.js',
                        'app/public/js/services/account-api.js',
                        'app/public/js/resource/api-test.js',
                    ],
                }
            }
        },
        uglify:{
            app: {
                files: {
                    'dist/public/js/app.min.js':[
                        'dist/public/prejs/app.min.js'
                    ]
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    // Default task(s).
    grunt.registerTask('default', ['jshint']);
    // My tasks
    grunt.registerTask('build', ['jshint', 'clean:all', 'concat', 'uglify', 'clean:prejs']);

};