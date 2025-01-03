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
            bat """
            set BUILD_STATUS=FAILURE
            curl -H "Content-Type: application/json" -X POST -d "{\\"content\\": \\"❌ Pipeline Status: %BUILD_STATUS%\\"}" https://discord.com/api/webhooks/YOUR_WEBHOOK_URL
            """
        }
        success {
            echo 'Pipeline completed successfully!'
            bat """
            set BUILD_STATUS=SUCCESS
            curl -H "Content-Type: application/json" -X POST -d "{\\"content\\": \\"✅ Pipeline Status: %BUILD_STATUS%\\"}" https://discord.com/api/webhooks/YOUR_WEBHOOK_URL
            """
        }
        always {
            echo "Pipeline finished with status: ${currentBuild.currentResult}"
        }
    }
}
