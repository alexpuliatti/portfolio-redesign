import os
from PIL import Image

src_dir = '/Users/ap/Documents/GitHub/tumblr_website/portfolio_react/public/asia-stillz'
dest_dir = '/Users/ap/Documents/GitHub/tumblr_website/portfolio_react/public/asia-stillz-cropped'

if not os.exists(dest_dir):
    os.makedirs(dest_dir)

files = [f for f in os.listdir(src_dir) if f.endswith('.png')]

# Take first 5 images and make them vertical crops (center crop, 1080x1920 ratio)
print("Creating vertical crops...")
for i, f in enumerate(files[:5]):
    img = Image.open(os.path.join(src_dir, f))
    width, height = img.size
    
    # Target ratio 9:16
    new_width = height * 9 // 16
    left = (width - new_width) // 2
    right = (width + new_width) // 2
    top = 0
    bottom = height
    
    cropped = img.crop((left, top, right, bottom))
    out_name = f.replace('.png', '_vertical.png')
    cropped.save(os.path.join(dest_dir, out_name))
    print(f"Saved {out_name}")

# Take next 5 images and make them square crops (1080x1080 ratio)
print("Creating square crops...")
for i, f in enumerate(files[5:10]):
    img = Image.open(os.path.join(src_dir, f))
    width, height = img.size
    
    # Target ratio 1:1
    new_width = height
    left = (width - new_width) // 2
    right = (width + new_width) // 2
    top = 0
    bottom = height
    
    cropped = img.crop((left, top, right, bottom))
    out_name = f.replace('.png', '_square.png')
    cropped.save(os.path.join(dest_dir, out_name))
    print(f"Saved {out_name}")
    
print("Done.")
