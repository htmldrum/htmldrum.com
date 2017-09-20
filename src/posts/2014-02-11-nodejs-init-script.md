---
layout: post 
title: Init script for running Node.js processes with forever
categories: init javascript node
summary: Simple script for running a Node.js process on boot
---

```bash
#!/bin/sh
#
# chkconfig: 35 99 99
# description: Node.js init.d script /home/nodejs/sample/app.js
#
. /etc/rc.d/init.d/functions

USER="root"

DAEMON="/usr/bin/forever"
ROOT_DIR="/home/bandwidth-log-processor/scripts"
 
SCRIPT="run.js"
PARAMS="--cdn s3"
SERVER="$ROOT_DIR/$SCRIPT"

LOCK_FILE="/var/lock/subsys/s3-logs-nodejs"

export NODE_ENV="production"
export NODE_CONFIG_DIR="$ROOT_DIR/config"

#options for forever
#restart if code changes, append to log files, script must run min 0.5s, wait 30s between re-runs, -l -o -e output logs to /var/log  --source dir
FOREVER_OPTIONS="-w -a --minUptime 500 --spinSleepTime 30000 -l /var/log/forever.log -o /var/log/node.log -e /var/log/node_err.log --sourceDir=$ROOT_DIR"

do_start()
{
        if [ ! -f "$LOCK_FILE" ] ; then
                echo -n $"Starting $SERVER: "
                daemon --user=root \
                 $DAEMON $FOREVER_OPTIONS start $SCRIPT $PARAMS
                RETVAL=$?
                echo
                [ $RETVAL -eq 0 ] && touch $LOCK_FILE
        else
                echo "$SERVER is locked."
                RETVAL=1
        fi
}
do_stop()
{
        echo -n $"Stopping $SERVER: "
        pid=`ps -aefw | grep "node" | grep -v " grep " | awk '{print $2}'`
        kill -9 $pid > /dev/null 2>&1 && echo_success || echo_failure
  	runuser -l "$USER" -c "$DAEMON stop $SERVER &" && echo_success || echo_failure
        RETVAL=$?
		rm -f $LOCK_FILE
        echo
        [ $RETVAL -eq 0 ] 
}
 
case "$1" in
        start)
                do_start
                ;;
        stop)
                do_stop
                ;;
        restart)
                do_stop
                do_start
                ;;
        *)
                echo "Usage: $0 {start|stop|restart}"
                RETVAL=1
esac
 
exit $RETVAL

```
[Gist](https://gist.github.com/htmldrum/8920584)
