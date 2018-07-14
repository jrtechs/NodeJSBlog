#!/bin/bash


for f in $(find ./ -name '*.jpg' -or -name '*.JPG');
    do jpegoptim --size=500k  $f;
done

for f in $(find ./ -name '*.png' -or -name '*.PNG');
    do optipng $f;
done