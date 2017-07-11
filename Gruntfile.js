'use strict';

var scriptFiles = [
    'js/**/*.js'
];

module.exports = function (grunt) {

    // Show how long each task takes to execute
    require('time-grunt')(grunt);

    // Load tasks as needed
    require('jit-grunt')(grunt);

    // Force use of Unix newlines
    grunt.util.linefeed = '\n';

    grunt.initConfig({

        // Get package information
        project: require('./project.json'),

        // Remove temporary and old files
        clean: {
            index:  ["<%= project.paths.output %>/index.html"],
            temp:   ["<%= project.paths.temp %>/*"],
            deploy: ["<%= project.paths.deploy %>/*"],
            js:     ["<%= project.paths.temp %>/js/*.js", "<%= project.paths.output %>/js/*.js"],
            css:    ["<%= project.paths.temp %>/css/*.js", "<%= project.paths.output %>/css/*.css"]
        },

        // Watch for changes
        watch: {
            js: {
                files: ['js/{,*/}*.js'],
                tasks: ['build-js'],
            },
            sass: {
                files: ['css/{,*/}*.scss'],
                tasks: ['build-sass'],
            },
            less: {
                files: ['css/**/*.less'],
                tasks: ['build-less'],
            },
            index: {
                files: ['index.html'],
                tasks: ['processhtml'],
            },
        },

        // Automatically add browser vendor prefixes to CSS
        autoprefixer: {
            options: {
                browsers: ['last 8 versions', 'ie 9']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd:    '<%= project.paths.output %>/css/',
                    src:    '*.css',
                    dest:   '<%= project.paths.output %>/css/'
                }]
            }
        },

        // Concatenate our JS into a single file
        concat: {
            options: {
                stripbanners: true
            },
            dist: {
                src: scriptFiles,
                dest: '<%= project.paths.output %>/js/script.js'
            }
        },


        // Copy files to output
        copy: {
            images: {
                expand: true,
                cwd: 'images/',
                src: '**',
                dest: 'output/images',
            },
            ebloader: {
                src: 'resources/EBLoader.js',
                dest: 'output/js/EBLoader.js',
            },
        },


        // Minify JS
        uglify: {
            options: {
                report: 'gzip',
                compress: {
                    drop_console: true
                }
            },
            dist: {
                src: ['<%= project.paths.output %>/js/script.js'],
                dest: '<%= project.paths.output %>/js/script.js'
            }
        },


        // Compile LESS into CSS
        less: {
            compile: {
                options: {
                    strictMath: true
                },
                files: {
                    '<%= project.paths.output %>/css/style.css': 'css/style.less'
                }
            }
        },

        // Minify CSS
        cssmin: {
            dist: {
                options: {
                    keepSpecialComments: 0,
                    roundingPrecision: 10
                },
                files: [{
                    expand: true,
                    cwd: '<%= project.paths.output %>/css',
                    src: ['*.css'],
                    dest: '<%= project.paths.output %>/css',
                    ext: '.css'
                }]
            }
        },


        // Minify images
        imagemin: {
            dynamic: {
                options: {
                    optimizationLevel: 3,
                },
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: ['**/*'],
                    dest: 'output/images'
                }]
            }
        },


        // Embed images in styles
        imageEmbed: {
            dist: {
                src: ["output/css/style.css"],
                dest: "output/css/style.css",
                options: {
                    maxImageSize: 0,
                    deleteAfterEncoding: true,
                }
            }
        },


        // Process HTML to include minified as needed
        processhtml: {
            options: {
                process: true,
                strip: true,
                data: {
                    adName: "<%= project.adName %>",
                    adWidth: "<%= project.width %>",
                    adHeight: "<%= project.height %>",
                }
            },
            all: {
                files: {
                    'output/index.html': ['index.html'],
                }
            },
        },


        // Minify HTML
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'output/index.html': 'output/index.html',
                }
            },
        },


        // Deploy to a zip
        compress: {
            main: {
                options: {
                    mode: "zip",
                    archive: "<%= project.paths.deploy %>/<%= project.adName %>_<%= project.width %>x<%= project.height %>.zip",
                    pretty: true,
                    level: 5,
                },
                files: [
                    {
                        expand: true,
                        cwd: "<%= project.paths.output %>",
                        src: ['**'],
                    }
                ]
            }
        },


        // Run tasks concurrently
        concurrent: {
            build:          ['build-less', 'build-js', 'processhtml', 'copy:images'],
            deployFirst:    ['deploy-less', 'deploy-js', 'processhtml', 'imagemin'],
            deploySecond:   ['htmlmin', 'imageEmbed'],
        },

    });

    // Default
    grunt.registerTask('default',       ['build']);

    // Build
    grunt.registerTask('build-less',    ['less', 'autoprefixer']);
    grunt.registerTask('build-js',      ['concat', 'copy:ebloader']);
    grunt.registerTask('build',         ['clean', 'concurrent:build', 'clean:temp']);

    // Deploy
    grunt.registerTask('deploy-less',   ['build-less', 'cssmin']);
    grunt.registerTask('deploy-js',     ['build-js', 'uglify']);
    grunt.registerTask('deploy',        [
        'clean', 'concurrent:deployFirst', 'concurrent:deploySecond', 'clean:temp', 'compress'
    ]);

};

