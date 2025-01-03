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
            // Beispiel: Slack-Benachrichtigung oder E-Mail senden
            echo 'Pipeline failed! Check the logs for more details.'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        always {
            echo "Pipeline finished with status: ${currentBuild.currentResult}"
        }
    }
}
