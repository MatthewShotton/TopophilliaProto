#!/usr/bin/env python
import sys
import argparse
import os
from PIL import Image

def main():
    filenames = sys.argv[1:]
    parser = argparse.ArgumentParser(description='Script fors scaling directories of images\n\n')    
    parser.add_argument('-o','--output', help='Output location for the files', default=".")
    parser.add_argument('-s','--scale', help='Scale of the images', default=0.5)
    parser.add_argument("files", help="Image files to scale", nargs="+")

    args = parser.parse_args()
    scale = float(args.scale)
    filenames = args.files

    output_dir = args.output
    print "Creating directory",output_dir

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for filename in filenames:
        img = Image.open(filename)
        size = (int(img.size[0] * scale), int(img.size[1] * scale))
        img.thumbnail(size, Image.ANTIALIAS)
        input_directory, fname = os.path.split(filename)
        output_filename = os.path.join(output_dir, fname)
        print size, output_filename
        img.save(output_filename)


if __name__ == '__main__':
    main()