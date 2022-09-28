#!/bin/sh

if [[ $# -eq 1 ]]
then
  export repo_link=$1
  export branch_suffix=""
elif [[ $# -eq 2 ]]
then
  export repo_link=$1
  export branch_suffix="-b $2"
else
  echo "Error: Wrong set of parameters"
  echo "Correct Syntax: deploy_dl_fmwrk_ui.sh <github repo> <repo branch>"
fi

export HOME_DIR="/home/ec2-user"
export CODE_REPO_PATH="${HOME_DIR}/dl-fmwrk-ui"
export REPO_NAME="aws-datalake-framework-ui"
export REPO_BUILD_PATH="/dl-fmwrk-ui-build"
export BUILD_NAME="aws-datalake-framework-ui-build"
export CURR_TIME=$(date +%Y%m%d%H%M%S)


cd ${HOME_DIR}
mkdir -p ${CODE_REPO_PATH}/archive 2>/dev/null
sudo mkdir -p ${REPO_BUILD_PATH}/archive 2>/dev/null
cd ${CODE_REPO_PATH}

if [ -d "${REPO_NAME}" ]
then
  mv ${REPO_NAME} ${CODE_REPO_PATH}/archive/${REPO_NAME}_${CURR_TIME}
fi

git clone ${repo_link} ${branch_suffix}
cd ${REPO_NAME}

# Modify configuration to deploy as development server
sed -i "/^const baseUrl/c\const baseUrl = process.env.REACT_APP_DEV_BASE_URL" src/routes/defaultInstance.js

echo "Package Installation Started..."
npm install
if [[ $? -ne 0 ]]
then
  echo "ERROR: Package Installation Failed"
  exit 1
fi

echo "Package Installation Complete!!!"
echo "Code Build in Progress"
npm run build
if [[ $? -ne 0 ]]
then
  echo "ERROR: Build Process Failed"
  exit 1
fi
echo "Code Build Complete!!"

cd ${REPO_BUILD_PATH}
echo "Stopping NGINX Server"
sudo service nginx stop
if [ -d "${BUILD_NAME}" ]
then
  sudo mv ${BUILD_NAME} ${REPO_BUILD_PATH}/archive/${BUILD_NAME}_${CURR_TIME}
fi
sudo cp -r ${CODE_REPO_PATH}/${REPO_NAME}/build ${BUILD_NAME}
echo "Starting NGINX Server"
sudo service nginx start

exit 0
