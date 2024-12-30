pipeline { 
    agent any
    environment {
        MONGODB_URI = credentials('MONGODB_URI') // Stellt sicher, dass die MongoDB-URI sicher geladen wird
    }
    stages {
        stage('Install Backend Dependencies') {
            steps {
                dir('API') {
                    echo 'Installing Backend Dependencies...'
                    bat 'npm install'
                }
            }
        }
        stage('Run Backend Tests') {
            steps {
                dir('API') {
                    echo 'Running Backend Tests...'
                    bat 'npm test'
                }
            }
        }
        stage('Build Frontend') {
            steps {
                dir('Frontend') {
                    echo 'Installing Frontend Dependencies...'
                    bat 'npm install'
                    echo 'Building Frontend...'
                    bat 'npm run build'
                }
            }
        }
        stage('Deploy to Test System') {
            steps {
                echo 'Deploying Backend and Frontend to Test System...'
                // Beispiel: Deployment-Schritte für Backend und Frontend
                bat 'pm2 restart server.js --name backend' // Deployment des Node.js-Servers (z. B. mit PM2)
                bat 'copy Frontend\\dist\\* C:\\test-system\\frontend /Y' // Beispiel: Kopiere statische Dateien
            }
        }
    }
    post {
        failure {
            echo 'Pipeline failed!'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        always {
            echo "Pipeline finished with status: ${currentBuild.currentResult}"
        }
    }
}
