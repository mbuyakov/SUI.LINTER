pipeline {
  agent {
    docker {
      image 'node:14-alpine'
      reuseNode true
      args '-e HOME=$HOME'
    }
  }

  options {
    buildDiscarder logRotator(numToKeepStr: '3')
    disableConcurrentBuilds()
  }

  parameters {
    booleanParam(defaultValue: true, description: 'Build', name: 'build')
    booleanParam(defaultValue: true, description: 'Publish', name: 'publish')
    booleanParam(defaultValue: false, description: 'Clean workspace', name: 'clean_ws')
  }

  stages {
    stage("Install dependencies") {
      when {
        environment name: 'build', value: 'true'
      }

      steps {
        sh """
          yarn install --frozen-lockfile
        """
      }
    }

    stage("Build") {
      when {
        environment name: 'build', value: 'true'
      }

      steps {
          sh """
            yarn build
          """
      }
    }

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
        SUFFIX = "${env.BRANCH_NAME == "master" ? "" : ("-" + env.BRANCH_NAME)}"
      }

      steps {
          sh """
            npx npm-cli-adduser
            yarn publish --registry ${NPM_REGISTRY} --non-interactive --no-git-tag-version --new-version 1.0.${BUILD_NUMBER}${SUFFIX}
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
}
