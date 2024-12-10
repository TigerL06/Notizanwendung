pipeline {
    agent any
    stages {
        stage('Build Backend') {
            steps {
                dir('API') { // Wechsel in den API-Ordner
                    bat 'npm install' // Installiere Abhängigkeiten
                }
            }
        }
        stage('Prepare Frontend') {
            steps {
                dir('Frontend') { // Wechsel in den Frontend-Ordner
                    echo 'Frontend does not require a build step. Preparing files for deployment.'
                    // Optional: Kopieren Sie Dateien an einen Zielort, falls benötigt
                }
            }
        }
    }
}
