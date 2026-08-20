#!/bin/bash
swipl -q -f server.pl -g "start_server, sleep(60), halt."
