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
                 bat 'scp -r API user@your-server:/path/to/deploy'
                 bat 'ssh user@your-server "pm2 restart my-app"'
            }
        }
    }

    post {
        failure {
            echo 'Pipeline failed!'
            bat """
            set BUILD_STATUS=FAILURE
            curl -H "Content-Type: application/json" -X POST -d "{\\"content\\": \\"❌ Pipeline Status: %BUILD_STATUS%\\"}" https://discord.com/api/webhooks/1326123058980720663/YLDvoUGeYzQIyXZyN4BDUJViTjLZeFe_rKb3S7sgf2c-uj4j0ptbpR5QKYpKkjfwFUCC
            """
        }
        success {
            echo 'Pipeline completed successfully!'
            bat """
            set BUILD_STATUS=SUCCESS
            curl -H "Content-Type: application/json" -X POST -d "{\\"content\\": \\"✅ Pipeline Status: %BUILD_STATUS%\\"}" https://discord.com/api/webhooks/1326123058980720663/YLDvoUGeYzQIyXZyN4BDUJViTjLZeFe_rKb3S7sgf2c-uj4j0ptbpR5QKYpKkjfwFUCC
            """
        }
        always {
            echo "Pipeline finished with status: ${currentBuild.currentResult}"
        }
    }
}
