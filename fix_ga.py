import glob

files = glob.glob('./*.html') + glob.glob('./blog/*.html')

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    content = content.replace('G-F9N2S4S0G4', 'G-F9N2S4S064')
    
    with open(f, 'w') as file:
        file.write(content)
