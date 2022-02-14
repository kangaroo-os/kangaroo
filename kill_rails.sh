rm /Users/oliviali/Development/kangaroo/tmp/pids/server.pid
lsof -i tcp:3000 | awk 'NR!=1 && /ruby/ {print $2}' | xargs kill -9