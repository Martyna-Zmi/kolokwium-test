pipeline {
    agent {
        docker {
            image 'martyna0901/custom-jenkins-build-agent:1.0.11'
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

        stage('Install') {
          steps {
            sh 'npm ci'
          }
        }

        stage('Lint & Tests') {
            parallel {
                stage('Lint') {
                 steps {
                       sh 'npm run lint'
                    }
             }
                stage('Unit Tests') {
                    steps {
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
                    sh 'sonar-scanner -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info'
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

        stage('Push to Docker Hub') {
            when {
                branch 'master'
            }
            steps {
                script {
                    def userInput = input(id: 'Proceed1', message: 'Czy chcesz wdrozyc na produkcje?', ok: 'Tak, chce')
                    if (userInput) {
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
            script{
                echo 'Cleaning up...'
                    sh "docker rmi ${env.IMAGE_NAME}:${env.BUILD_NUMBER} || true"
                    sh "docker rmi ${env.IMAGE_NAME}:latest || true"
                    echo 'Build completed.'
                    writeFile file: 'raport.txt', text: """
                              Pipeline run: ${env.BUILD_NUMBER}
                              Branch: ${env.BRANCH_NAME ?: 'N/A'}
                              Finished at: ${new Date().format("yyyy-MM-dd HH:mm:ss")}
                            """
                    archiveArtifacts artifacts: 'raport.txt'
             }
        }
        success {
            echo 'Build & deploy completed successfully.'
        }
        failure {
            echo 'Build failed.'
        }
    }
}
