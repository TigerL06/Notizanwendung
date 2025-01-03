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

        stage('Deploy to Test System') {
            steps {
                echo 'Deploying Backend to Test System...'
                // Hier kann ein echter Deploy-Befehl stehen
            }
        }
    }

    post {
        failure {
            echo 'Pipeline failed!'
            bat "set BUILD_STATUS=${currentBuild.currentResult} & curl -H \"Content-Type: application/json\" -X POST -d \"{\\"content\\": \\"Pipeline Status: %BUILD_STATUS%\\"}\" https://discord.com/api/webhooks/1324751984674209935/4tIrEWqGVpv2JqXJwIbV6JHctUPbcPAS9-4H8xIlqGIqcnHkjlKDZ-nMMki95MDzxJC-"
        success {
            echo 'Pipeline completed successfully!'
        }
        always {
            echo "Pipeline finished with status: ${currentBuild.currentResult}"
        }
    }
}
