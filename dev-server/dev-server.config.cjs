module.exports = {
    'port': process.env.npm_package_config_defaults_port,
    'server': 'src/site',
    
    'files': [
        'src/site/**/*',
        '../components/dev/**/*'
    ],

    'serveStatic': [{ 
        'route': '/luminary-components',
        'dir': '../components/dev'
    }],
};