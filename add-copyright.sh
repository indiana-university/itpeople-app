#!/bin/bash
for i in $(find ./src -name '*.ts' -o -name '*.tsx')
do
  if ! grep -q Copyright $i
  then
    cat copyright.txt $i >$i.new && mv $i.new $i
  fi
done