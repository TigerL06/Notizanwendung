pipeline {
    agent any
    stages {
        stage('Build Backend') {
            steps {
                dir('API') {
                    bat 'npm install'
                }
            }
        }
        stage('Prepare Frontend') {
            steps {
                dir('Frontend') {
                    echo 'Static files prepared for deployment'
                }
            }
        }
        stage('Deploy to Test System') {
            steps {
                echo 'Deploying Backend and Frontend to Test System...'
                // Beispiel: Deployment-Schritte hier hinzufügen
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
