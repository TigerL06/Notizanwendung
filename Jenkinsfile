pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/TigerL06/Notizanwendung.git',
                        credentialsId: 'notizID' // Gib hier deinen Jenkins-Credentials-Namen ein
                    ]]
                ])
            }
        }

        stage('Transfer Code to Server') {
            steps {
                sh '''
                ssh user@192.168.186.1 "mkdir -p /var/www/myapp"
                scp -r * user@192.168.186.1:/var/www/myapp
                '''
            }
        }

        stage('Install Dependencies on Server') {
            steps {
                sh '''
                ssh user@192.168.186.1 "cd /var/www/myapp && npm install"
                '''
            }
        }

        stage('Run Tests on Server') {
            steps {
                sh '''
                ssh user@192.168.186.1 "cd /var/www/myapp && npm test"
                '''
            }
        }

        stage('Build Application on Server') {
            steps {
                sh '''
                ssh user@192.168.186.1 "cd /var/www/myapp && npm run build"
                '''
            }
        }

        stage('Restart Application') {
            steps {
                sh '''
                ssh user@192.168.186.1 "cd /var/www/myapp && pm2 restart all"
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed.'
        }
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed. Check Jenkins logs for more information.'
        }
    }
}
