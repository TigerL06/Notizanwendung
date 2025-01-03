pipeline {
    agent any

    environment {
        NODE_ENV = 'test'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                dir('API') {
                bat 'if exist package.json (npm install) else (echo package.json not found & exit /b 1)'
            }
            }
        }

        stage('Run Unit Tests') {
            steps {
                dir('API') {
                    bat 'npm test -- --forceExit'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('API') {
                    bat 'npm install'
                }
            }
        }

    post {
        failure {
            echo 'Pipeline failed!'
            bat 'curl -H "Content-Type: application/json" -X POST -d "{^\"content^\": ^\"Pipeline Status: ${currentBuild.currentResult}^\"}" https://discord.com/api/webhooks/1324751984674209935/4tIrEWqGVpv2JqXJwIbV6JHctUPbcPAS9-4H8xIlqGIqcnHkjlKDZ-nMMki95MDzxJC-'
        }
        always {
            echo "Pipeline finished with status: ${currentBuild.currentResult}"
        }
    }
}
