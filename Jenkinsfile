pipeline {
    agent {
        docker {
            image 'martyna0901/custom-jenkins-build-agent:1.0.2'
            args '-u root -v /var/run/docker.sock:/var/run/docker.sock --network sonarqube-config_ci_network -u root'
        }
    }

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds-id')
        IMAGE_NAME = "martyna0901/kolokwium-api"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Tests & Coverage') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh 'npm install'
                        sh 'npm run test --coverage'
                    }
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
                junit 'reports/**/*.xml'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner'
                }
            }
        }

        stage('Build App Docker Image') {
            steps {
                script {
                    sh """
                        docker build -t ${env.IMAGE_NAME}:${env.BUILD_NUMBER} -t ${env.IMAGE_NAME}:latest .
                    """
                }
            }
        }

        stage('Push App Image to Docker Hub') {
            steps {
                script {
                    sh 'echo "$DOCKERHUB_CREDENTIALS_PSW" | docker login -u "$DOCKERHUB_CREDENTIALS_USR" --password-stdin'
                    sh """
                        docker push ${env.IMAGE_NAME}:${env.BUILD_NUMBER}
                        docker push ${env.IMAGE_NAME}:latest
                    """
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            sh "docker rmi ${env.IMAGE_NAME}:${env.BUILD_NUMBER} || true"
            sh "docker rmi ${env.IMAGE_NAME}:latest || true"
            echo 'Build completed.'
        }
        success {
            echo 'Build & deploy completed successfully.'
        }
        failure {
            echo 'Build failed.'
        }
    }
}
