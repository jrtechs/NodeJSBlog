#!/bin/bash


WIDTH="690>"

files=("./entries" "./img")

for folder in "${files[@]}"; do

    for f in $(find $folder -name '*.jpg' -or -name '*.JPG'); do
        convert "$f" -resize $WIDTH "$f"
        jpegoptim --max=80 --strip-all --preserve --totals --all-progressive "$f"
    done


    for f in $(find $folder -name '*.png' -or -name '*.PNG'); do

        convert "$f" -resize $WIDTH "$f"
        optipng -o7 -preserve "$f"
    done
done