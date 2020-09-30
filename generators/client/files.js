const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

const ANGULAR_DIR = jhipsterConstants.ANGULAR_DIR;
const REACT_DIR = jhipsterConstants.REACT_DIR;
const TEST_DIR = jhipsterConstants.CLIENT_TEST_SRC_DIR;

const clientFiles = {
    common: [
        {
            condition: generator => generator.clientFramework === 'angularX',
            templates: [{ file: 'angular/eslintignore', renameTo: () => '.eslintignore' }]
        },
        {
            condition: generator => generator.clientFramework === 'react',
            templates: [
                { file: 'react/eslintrc.json', renameTo: () => '.eslintrc.json' },
                { file: 'react/eslintignore', renameTo: () => '.eslintignore' }
            ]
        }
    ],
    angularMain: [
        {
            condition: generator => generator.clientFramework === 'angularX',
            templates: [
                {
                    file: 'angular/home/home.component.html',
                    method: 'processHtml',
                    renameTo: () => `${ANGULAR_DIR}home/home.component.html`
                },
                {
                    file: 'angular/layouts/navbar/navbar.component.html',
                    method: 'processHtml',
                    renameTo: () => `${ANGULAR_DIR}layouts/navbar/navbar.component.html`
                }
            ]
        }
    ],
    reactMain: [
        {
            condition: generator => generator.clientFramework === 'react',
            templates: [
                {
                    file: 'react/home/home.tsx',
                    method: 'processJsx',
                    renameTo: () => `${REACT_DIR}modules/home/home.tsx`
                },
                {
                    file: 'react/shared/layout/header/header.tsx',
                    method: 'processJsx',
                    renameTo: () => `${REACT_DIR}shared/layout/header/header.tsx`
                }
            ]
        }
    ],
    testMain: [
        {
            condition: generator => generator.clientFramework === 'react',
            templates: [
                {
                    file: 'react/shared/layout/header/header.spec.tsx',
                    method: 'processJsx',
                    renameTo: () => `${TEST_DIR}spec/app/shared/layout/header/header.spec.tsx`
                }
            ]
        }
    ]
};

function writeFiles() {
    return {
        overrideFiles() {
            this.writeFilesToDisk(clientFiles, this, false);
        },
        customizePackageJson() {
            const packageJSON = this.fs.readJSON('package.json');
            packageJSON.scripts['build:app'] = 'npm run build && cd server && npm run build';
            packageJSON.scripts['start:app'] = 'npm run build && cd server && npm run start';
            if (!this.skipServer) {
                packageJSON.scripts.postInstall = 'cd server && npm run lint:fix';
            }
            // workaround for "Cannot find name 'Cheerio'" issue
            // https://github.com/jhipster/generator-jhipster-nodejs/issues/167
            // https://github.com/jhipster/generator-jhipster/issues/12593
            packageJSON.devDependencies['@types/enzyme'] = '3.10.7';
            this.fs.writeJSON('package.json', packageJSON);
        },
        customizeTsconfig() {
            const tsconfigJSON = this.fs.readJSON('tsconfig.json');
            tsconfigJSON.exclude = [`${this.SERVER_NODEJS_SRC_DIR}`];
            this.fs.writeJSON('tsconfig.json', tsconfigJSON);
        }
    };
}

module.exports = {
    writeFiles
};
