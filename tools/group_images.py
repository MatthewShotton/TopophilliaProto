#!/usr/bin/env python
import sys
import argparse
import os
import math
from PIL import Image

def main():
    filenames = sys.argv[1:]
    parser = argparse.ArgumentParser(description='Script for grouping directories of images\n\n')    
    parser.add_argument('-o','--output', help='Output location for the files', default=".")
    parser.add_argument('-s','--size', help='Size of the groups', default=None)
    parser.add_argument("files", help="Image files to scale", nargs="+")

    args = parser.parse_args()
    filenames = args.files

    output_dir = args.output
    print "Creating directory",output_dir


    # input = image
    # output = strip

    num_output_strips = 1
    images_per_strip = len(filenames)
    if args.size != None:
        num_output_strips = int(math.ceil(len(filenames)/float(args.size)))
        images_per_strip = int(args.size)

    output_image_size = Image.open(filenames[0]).size
    output_image_size = (output_image_size[0] * images_per_strip, output_image_size[1])


    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    output_img_strip = Image.new("RGBA", output_image_size)
    image_count = 0 

    for index, filename in enumerate(filenames):
        strip_index = index % images_per_strip
        img = Image.open(filename)
        x_offset = img.size[0] * strip_index

        if strip_index == 0:
            # save old image
            output_filename = os.path.join(output_dir, str(image_count).zfill(4) + ".png")
            output_img_strip.save(output_filename,"PNG")
            # create new image
            output_img_strip = Image.new("RGBA", output_image_size)
            image_count += 1

        output_img_strip.paste(img, (x_offset, 0))

        print strip_index



if __name__ == '__main__':
    main()