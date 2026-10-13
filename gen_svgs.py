import os

os.makedirs('assets/svg', exist_ok=True)

svgs = {
    'hazard-barcode.svg': """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 32" fill="none">
  <rect width="140" height="32" fill="#d4ff00"/>
  <rect x="0" width="8" height="32" fill="#0e0e10"/>
  <rect x="12" width="4" height="32" fill="#0e0e10"/>
  <rect x="20" width="12" height="32" fill="#0e0e10"/>
  <rect x="36" width="6" height="32" fill="#0e0e10"/>
  <rect x="46" width="14" height="32" fill="#0e0e10"/>
  <rect x="64" width="5" height="32" fill="#0e0e10"/>
  <rect x="73" width="10" height="32" fill="#0e0e10"/>
  <rect x="87" width="3" height="32" fill="#0e0e10"/>
  <rect x="94" width="16" height="32" fill="#0e0e10"/>
  <rect x="114" width="7" height="32" fill="#0e0e10"/>
  <rect x="125" width="15" height="32" fill="#0e0e10"/>
</svg>""",

    'scribble-oval.svg': """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 100" fill="none">
  <path d="M30 52 C22 28, 70 14, 134 16 C198 18, 228 38, 222 62 C214 86, 154 94, 88 90 C38 88, 12 72, 20 44 C26 22, 90 8, 158 10 C210 12, 232 30, 220 58 C208 86, 144 92, 80 88" 
        stroke="#d4ff00" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>""",

    'scribble-underline.svg': """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 32" fill="none">
  <path d="M4 16 C50 20, 104 14, 160 18 C216 22, 276 12, 330 16 C354 17, 370 20, 376 18 M20 22 C80 26, 158 18, 238 22 C300 25, 350 20, 372 19" 
        stroke="#d4ff00" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>""",

    'scribble-zigzag.svg': """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" fill="none">
  <path d="M12 96 L48 24 L74 86 L108 14 L148 76 M18 104 L52 30 L80 92 L114 20 L152 82" 
        stroke="#d4ff00" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>""",

    'scribble-starburst.svg': """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" fill="none">
  <path d="M30 4 L30 56 M4 30 L56 30 M12 12 L48 48 M48 12 L12 48 M30 8 L30 52 M8 30 L52 30" 
        stroke="#d4ff00" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>""",

    'scribble-arrow.svg': """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80" fill="none">
  <path d="M82 22 C64 54, 38 68, 12 70 M82 22 L58 20 M82 22 L76 44" 
        stroke="#d4ff00" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>""",

    'scribble-cross.svg': """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" fill="none">
  <path d="M8 8 L42 42 M42 8 L8 42 M10 8 L40 40" 
        stroke="#d4ff00" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>""",

    'scribble-loop.svg': """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" fill="none">
  <path d="M14 90 C40 110, 96 112, 134 82 C168 56, 144 16, 92 18 C38 20, 10 64, 46 94 C88 126, 154 90, 148 46" 
        stroke="#d4ff00" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>""",

    'scribble-s-curve.svg': """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 140" fill="none">
  <path d="M16 110 C46 135, 110 138, 156 100 C176 80, 170 48, 136 34 C94 18, 30 40, 24 80 C18 116, 74 130, 120 118 C158 108, 172 82, 168 54" 
        stroke="#d4ff00" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>"""
}

for filename, content in svgs.items():
    with open(os.path.join('assets/svg', filename), 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Wrote assets/svg/{filename}")
