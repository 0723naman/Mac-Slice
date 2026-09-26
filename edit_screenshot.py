from PIL import Image, ImageDraw, ImageFont

img = Image.open("/Users/naman/.gemini/antigravity-ide/brain/cb773d0a-e02a-4235-bd46-45de23500052/.user_uploaded/media_1790452647617.png")
d = ImageDraw.Draw(img)

try:
    font = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 13)
except:
    font = ImageFont.load_default()

names = [
    "Machine Learning Models",
    "Figma Design Files", 
    "Final Cut Pro Libraries",
    "Docker Containers",
    "App Source Code",
    "Video Rendering Projects",
    "XCode Archives",
    "Client Deliverables",
    "Personal Vault",
    "Design Assets",
    "System Cache"
]

y_start = 210
y_step = 51 # I'll try 51px based on standard list height

for i, name in enumerate(names):
    y_center = int(y_start + i * y_step)
    
    if y_center + 15 >= img.height:
        break
        
    bg_color = img.getpixel((260, y_center))
    
    # Draw a rectangle to cover the old text (from x=270 to x=450)
    d.rectangle([270, y_center-15, 480, y_center+15], fill=bg_color)
    
    # Draw the new text
    d.text((270, y_center-7), name, fill=(0,0,0,255), font=font)

img.save("/Users/naman/Desktop/Mac Storage Checker/Website/assets/screenshots/private_hero.png")
print("Saved to private_hero.png")
