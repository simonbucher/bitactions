#!/usr/bin/env bash

echo ">>> $NODE"

# Go to the BitBar plugins directory
cd "$(defaults read com.matryer.BitBar pluginsDirectory)"

# If already installed, check for version updates
if [ -d "bitactions" ]; then
	cd bitactions
	echo "Updating bitactions..."
	git pull origin master --quiet
	echo "Updated successfully."
# If not installed, clone the repository
else
	echo "Downloading bitactions..."
	git clone https://github.com/paulononaka/bitactions --quiet
	echo "Downloaded successfully."
	cd bitactions
fi

# Install node dependencies
echo "Installing npm dependencies..."
npm install
echo "Dependencies installed."

# Create the symlink if it doesn't exist
cd ..
if ! [ -L "./bitactions.10s.sh" ]; then
	echo "Creating initialization bitbar script..."
	echo -e '#!/bin/bash \n' > bitactions.10s.sh
	NODE=${NODE:-node}
	echo "cd $PWD/bitactions/" >> bitactions.10s.sh
	echo "$NODE $PWD/bitactions/bin/cli.js" >> bitactions.10s.sh
	chmod 755 bitactions.10s.sh
	echo "Done."
fi

# Refresh the plugin
echo "Refreshing plugin..."
open "bitbar://refreshPlugin?name=bitactions.10s.sh"
echo "Done."