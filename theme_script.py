import re

with open("styles.css", "r") as f:
    css = f.read()

# Define variables
variables = """
:root {
    --bg-color: #000000;
    --text-primary: #f5f5f7;
    --text-secondary: #86868b;
    --accent: #2997ff;
    --premium-pink: #ff0055;
    --nav-bg: rgba(0, 0, 0, 0.72);
    --card-bg: rgba(255, 255, 255, 0.05);
    --border-color: rgba(255, 255, 255, 0.1);
    --border-color-light: rgba(255, 255, 255, 0.05);
    --btn-primary-bg: #ffffff;
    --btn-primary-text: #000000;
    --btn-secondary-border: rgba(255, 255, 255, 0.4);
    --gradient-start: #ffffff;
    --gradient-end: #a1a1a6;
    --shadow-color: rgba(0, 0, 0, 0.4);
    --modal-bg: #111111;
    --panel-bg: rgba(10, 10, 10, 0.8);
    --hover-bg: rgba(255, 255, 255, 0.05);
}

[data-theme="light"] {
    --bg-color: #fbfbfd;
    --text-primary: #1d1d1f;
    --text-secondary: #86868b;
    --accent: #0066cc;
    --premium-pink: #ff0055;
    --nav-bg: rgba(255, 255, 255, 0.72);
    --card-bg: rgba(0, 0, 0, 0.03);
    --border-color: rgba(0, 0, 0, 0.1);
    --border-color-light: rgba(0, 0, 0, 0.05);
    --btn-primary-bg: #000000;
    --btn-primary-text: #ffffff;
    --btn-secondary-border: rgba(0, 0, 0, 0.2);
    --gradient-start: #1d1d1f;
    --gradient-end: #86868b;
    --shadow-color: rgba(0, 0, 0, 0.1);
    --modal-bg: #ffffff;
    --panel-bg: rgba(255, 255, 255, 0.9);
    --hover-bg: rgba(0, 0, 0, 0.05);
}
"""

# Replace the :root block
css = re.sub(r':root\s*\{[^}]*\}', variables, css, count=1)

# Now selectively replace hardcoded colors
replacements = [
    (r'color:\s*#fff(?:fff)?\b', 'color: var(--text-primary)'),
    (r'color:\s*#000(?:000)?\b', 'color: var(--bg-color)'),
    (r'background:\s*#fff(?:fff)?\b', 'background: var(--btn-primary-bg)'),
    (r'background:\s*#000(?:000)?\b', 'background: var(--bg-color)'),
    (r'background-color:\s*#000(?:000)?\b', 'background-color: var(--bg-color)'),
    (r'border-color:\s*#fff(?:fff)?\b', 'border-color: var(--text-primary)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.1\)', 'var(--border-color)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.05\)', 'var(--border-color-light)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.4\)', 'var(--btn-secondary-border)'),
    (r'rgba\(255,255,255,0\.1\)', 'var(--border-color)'),
    (r'rgba\(255,255,255,0\.05\)', 'var(--border-color-light)'),
    (r'rgba\(255,255,255,0\.4\)', 'var(--btn-secondary-border)'),
    (r'background:\s*rgba\(10,\s*10,\s*10,\s*0\.8\)', 'background: var(--panel-bg)'),
    (r'background:\s*rgba\(10,10,10,0\.8\)', 'background: var(--panel-bg)'),
    (r'background:\s*#111\b', 'background: var(--modal-bg)'),
    (r'background:\s*#1a1a1a\b', 'background: var(--modal-bg)'),
]

for old, new in replacements:
    css = re.sub(old, new, css)

with open("styles.css", "w") as f:
    f.write(css)

print("Updated styles.css with CSS variables.")
