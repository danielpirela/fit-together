#!/bin/bash
# Wrapper script to start Expo with correct Node version and patches
cd "$(dirname "$0")"

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use

# Apply patches to expo-linking
find node_modules -name "expo-linking" -type d | while read dir; do
	pkg="$dir/package.json"
	if [ -f "$pkg" ]; then
		if ! grep -q '"type": "module"' "$pkg"; then
			node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('$pkg', 'utf8'));
if (!pkg.type) {
  const content = JSON.stringify(pkg, null, 2).replace('{', '{\n  \"type\": \"module\",');
  fs.writeFileSync('$pkg', content + '\n');
}
"
		fi
	fi
done

# Start expo
npx expo start "$@"
