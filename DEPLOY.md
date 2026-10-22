<!-- ON PC: -->

Ensure Branches up to date
Merge into main

<!-- On Server: -->

ssh john@134.209.61.32
cd ~/movies
git pull --ff-only

<!-- (“fast-forward only”) refuses to pull if the server’s copy has changed in a way that would need a merge. It’s a safety check: you should never edit code on the server, so if this fails, something unexpected happened. Stop and look before going further. -->

<!-- Rebuild and restart -->

dcp up -d --build

<!-- Check that everything came up: -->

dcp ps
dcp logs --tail 30 migrate
dcp logs --tail 30 backend

<!-- Check the live site: -->

https://johnpennyman.com/api/health/ should show {"ok": true}.

<!-- Clean up old images so they don’t pile up on the disk: -->

docker image prune -f

<!-- If a deploy breaks something: roll back -->
<!-- Find the last commit that worked and copy its short ID (e.g. 1ae1740). Then: -->

git log --oneline -5
git checkout 1ae1740
dcp up -d --build

<!-- That puts the old code back. Once you’ve fixed the problem on your PC and merged the fix, return the server to normal: -->

git checkout main
git pull --ff-only
dcp up -d --build
