pipeline { 
    agent any

    environment {
        NODEJS_HOME = tool name: 'NodeJS-16', type: 'NodeJS'
        PATH = "${NODEJS_HOME}/bin:${env.PATH}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/TigerL06/Notizanwendung.git',
                        credentialsId: 'notizID' // Verwende hier den Namen der Credentials
                    ]]
                ])
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Deploy') {
            steps {
                sh '''
                ssh user@<TEST-SERVER-IP> "mkdir -p /var/www/myapp"
                scp -r * user@<TEST-SERVER-IP>:/var/www/myapp
                ssh user@<TEST-SERVER-IP> "pm2 restart all"
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed.'
        }
        success {
            mail to: 'team@example.com',
                 subject: "Pipeline Success: ${env.JOB_NAME}",
                 body: "Good job! The pipeline '${env.JOB_NAME}' completed successfully."
        }
        failure {
            mail to: 'team@example.com',
                 subject: "Pipeline Failure: ${env.JOB_NAME}",
                 body: "Oops! The pipeline '${env.JOB_NAME}' failed. Please check Jenkins logs."
        }
    }
}
