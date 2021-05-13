@Library('smsoft-libs')_

pipeline {
  options {
      buildDiscarder logRotator(numToKeepStr: '3')
      disableConcurrentBuilds()
  }

  parameters {
          booleanParam(defaultValue: true, description: 'Publish', name: 'publish')
          booleanParam(defaultValue: false, description: 'Clean workspace', name: 'clean_ws')
  }

  stages {
    stage("Publish") {
      when {
        environment name: 'publish', value: 'true'
      }
      environment {
        NPM_REGISTRY = "https://nexus.suilib.ru/repository/npm-sui/"
        NPM_SCOPE = "@sui"
        NPM_USER = "jenkins"
        NPM_EMAIL = "jenkins@jenkins.jenkins"
        NPM_PASS = credentials('suilib-nexus-pass')
      }
      steps {
          sh """
            npx npm-cli-adduser
            yarn publish
          """
      }
    }

    stage('Clean workspace') {
      when {
        environment name: 'clean_ws', value: 'true'
      }
      steps {
        cleanWs()
      }
    }
  }

  post {
    failure {
      telegramSendNotification("@el1191")
    }
  }
}
