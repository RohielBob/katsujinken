"""Génère index.html (page autonome pour GitHub Pages) à partir de portfolio.html."""
import io, re

src = io.open('portfolio.html', encoding='utf-8').read()
head_end = src.index('</style>') + len('</style>')
head, body = src[:head_end], src[head_end:]
favicon = ("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>"
           "<rect width='64' height='64' rx='16' fill='%23ff6b4a'/>"
           "<text x='32' y='46' font-size='38' text-anchor='middle' fill='%2314112b'>剣</text></svg>")
page = f"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Katsujinken, le Groupe 1 du B1 Bachelor international de l'ULC-ICAM : treize projets d'ingénierie, un yacht au 1:40 et huit étudiants.">
<meta property="og:title" content="Katsujinken · Groupe 1 ULC-ICAM">
<meta property="og:description" content="Treize projets d'ingénierie en deux mois : yacht, IMOCA 60, Afyabora, électronique.">
<link rel="icon" href="{favicon}">
{head}
</head>
<body>
{body}
</body>
</html>
"""
io.open('index.html', 'w', encoding='utf-8', newline='\n').write(page)
print('index.html généré')
