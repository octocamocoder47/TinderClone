npm create vite@latest tinder-clone-web -- --template react
npm install -D tailwindcss @tailwindcss/vite
npm i -D daisyui@latest
npm i react-router-dom
npm run dev


curl -L --output cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
chmod +x cloudflared
cd /workspaces/career_shif & ./cloudflared tunnel --url http://localhost:5173

podman exec --user vscode -it nice_villani bash

http://host.containers.internal:5173/
http://localhost:5173/
http://localhost:8080/

MSYS_NO_PATHCONV=1 podman exec -it --user vscode -w /workspaces/career_shift/devTinder/frontend/ nice_villani bash

MSYS_NO_PATHCONV=1 podman exec -it --user vscode -w /workspaces/career_shift/devTinder/backend/ nice_villani bash
