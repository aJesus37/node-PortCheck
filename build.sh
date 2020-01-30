. ~/.nvm/nvm.sh
. ~/.profile
. ~/.bashrc
version=$(cat package.json | grep version | cut -d '"' -f4)

if nvm > /dev/null; then { # Check if system hash nvm installed
    if nvm use v12.14.1; then { # Check if node version 12.14.1 is installed in nvm
        if nexe --version > /dev/null; then { # Check if nexe is installed on system
            nexe -r node_modules/ -i app.js -t linux-x64 -o builds/node-PortCheck-v$version-linux-x64
            nexe -r node_modules/ -i app.js -t win-x64 -o builds/node-PortCheck-v$version-win-x64
            nexe -r node_modules/ -i app.js -t macos -o builds/node-PortCheck-v$version-mac
        } fi
    } fi
} fi