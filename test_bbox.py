from PIL import Image, ImageDraw, ImageFont
import sys

img = Image.open("/Users/naman/.gemini/antigravity-ide/brain/cb773d0a-e02a-4235-bd46-45de23500052/.user_uploaded/media_1790452647617.png")
d = ImageDraw.Draw(img)

# Draw lines every 50px to find coordinates
for y in range(0, img.height, 50):
    d.line([(0, y), (img.width, y)], fill="red", width=1)
for x in range(0, img.width, 50):
    d.line([(x, 0), (x, img.height)], fill="red", width=1)

img.save("grid.png")
