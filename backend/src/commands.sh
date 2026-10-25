npm run dev
podman compose -f docker-compose.yml up -d

MSYS_NO_PATHCONV=1 podman exec -it --user vscode -w /workspaces/career_shift/devTinder/backend/ nice_villani bash

