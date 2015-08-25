module.exports = function (grunt) {
    var config = {
        pkg: grunt.file.readJSON('../package.json'),
        // Metadata.
        meta: {
            staticPath: '../public/',
            srcPath_css: '../public/css/',
            deployPath_css: '../public/dest/css/',
            srcPath_js: '../public/js/',
            deployPath_js: '../public/dest/js/',
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm - dd") %>\n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> \n */'
        },

        cssmin: {
            options: {
                banner: '<%= meta.banner %>'
            },
            build: {
                files: {
                    '<%= meta.deployPath_css %>app.css': [
                        '<%= meta.srcPath_css %>app.css',
                        '<%= meta.srcPath_css %>requestList.css'
                    ]
                }
            }
        },

        copy: {
            'css': {
                expand: true,
                flatten: true,
                src: ['<%= meta.srcPath_css %>images/twisty-sprites.png', '<%= meta.srcPath_css %>images/timeline-sprites.png'],
                dest: '<%= meta.deployPath_css %>images/'
            },
            'img': {
                expand: true,
                flatten: true,
                src: '<%= meta.staticPath %>img/*',
                dest: '<%= meta.staticPath %>dest/img/'
            },
            'js': {
                files:[
                    {expand: true, flatten: true,src: ['<%= meta.srcPath_js %>lib/require.js'], dest: '<%= meta.staticPath %>dest/js/lib'},
                    {expand: true, flatten: true,src: ['<%= meta.srcPath_js %>utility/CDate.js'], dest: '<%= meta.staticPath %>dest/js/utility'},
                    {expand: true, flatten: true,src: ['<%= meta.staticPath %>track.js'], dest: '<%= meta.staticPath %>dest'},
                    {expand: true, flatten: true,src: ['<%= meta.staticPath %>cuckoo-collect.gif'], dest: '<%= meta.staticPath %>dest'},
                    {expand: true,flatten: true, src: ['<%= meta.srcPath_js %>lib/underscore.min.js'], dest: '<%= meta.staticPath %>dest/js/lib'},
                    {expand: true,flatten: true, src: ['<%= meta.srcPath_js %>route-path.js'], dest: '<%= meta.staticPath %>dest/js/'}
                ]
            }
        },

        htmlmin: {
            options: {
                banner: '<%= meta.banner %>',
                removeComments: true,
                collapseWhitespace: true
            },
            build: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: '<%= meta.staticPath %>partials/*.html',
                        dest: '<%= meta.staticPath %>dest/partials/'
                    },
                    {
                        '<%= meta.staticPath %>dest/index.html': '<%= meta.staticPath %>index.html'
                    }
                ]
            }
        },

        requirejs: {
            options: {
                banner: '<%= meta.banner %>'
            },
            compile: {
                options: {
                    dir: '<%= meta.deployPath_js %>',
                    optimize: 'uglify',
                    baseUrl: '<%= meta.srcPath_js %>',
                    mainConfigFile: '<%= meta.srcPath_js %>app.js'
                }
            }
        }
    }
    //配置
    grunt.initConfig(config);

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    //注册任务
    grunt.registerTask('buildjs', ['requirejs', 'copy:js']);
    grunt.registerTask('buildcss', ['cssmin', 'copy:css']);
    grunt.registerTask('buildhtml', ['htmlmin']);
    grunt.registerTask('all', ['cssmin', 'requirejs', 'buildhtml', 'copy']);
};