pipeline { 
    agent any

    environment {
        NODEJS_HOME = tool name: 'NodeJS', type: 'NodeJS'
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
                ssh user@192.168.186.1 "mkdir -p /var/www/myapp"
                scp -r * user@192.168.186.1:/var/www/myapp
                ssh user@192.168.186.1 "pm2 restart all"
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed.'
        }
    }
}
