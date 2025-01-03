pipeline {
    agent any

    environment {
        NODE_ENV = 'test'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/TigerL06/Notizanwendung.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('Backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Run Unit Tests') {
            steps {
                dir('Backend') {
                    bat 'npm test'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('Backend') {
                    bat 'npm run build'
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
