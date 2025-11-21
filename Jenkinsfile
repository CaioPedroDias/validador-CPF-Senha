pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        echo 'Fazendo checkout...'
        checkout scm
      }
    }

    stage('Install') {
      steps {
        echo 'Instalando dependências (se houver)...'
        script {
          if (isUnix()) {
            sh 'npm ci || npm install || true'
          } else {
            bat 'npm ci || npm install || echo install-failed'
          }
        }
      }
    }

    stage('Run tests') {
      steps {
        echo 'Executando testes (npm test)...'
        script {
          if (isUnix()) {
            sh 'npm test'
          } else {
            bat 'npm test'
          }
        }
      }
      // se o npm test falhar, pipeline vai marcar failure automaticamente
    }

    stage('Publish results') {
      steps {
        echo 'Publicando JUnit (se existir) e arquivando resultados'
        // publica JUnit (se o arquivo não existir, o passo só reclama mas não quebra)
        junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
        archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
      }
    }

    stage('Deploy (demo)') {
      steps {
        echo 'Deploy demo: empacotando workspace'
        script {
          if (isUnix()) {
            sh 'mkdir -p deploy && zip -r deploy/package.zip . -x node_modules/** -x deploy/** || true'
          } else {
            bat 'if not exist deploy mkdir deploy'
            bat 'powershell -Command "Compress-Archive -Path * -DestinationPath deploy\\package.zip -Force"'
          }
        }
      }
      post {
        success {
          archiveArtifacts artifacts: 'deploy/**', allowEmptyArchive: true
        }
      }
    }
  }

  post {
    success {
      echo 'Pipeline completada com sucesso.'
    }
    failure {
      echo 'Pipeline terminou com falha.'
    }
    always {
      echo 'Fim do pipeline.'
    }
  }
}