BASEDIR=$(dirname $0)

if [[ ${ENVIRONMENT} == "development" ]]; then
  chmod 777 -R $BASEDIR/../dist/
fi
