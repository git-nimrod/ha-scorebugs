# Bundled fonts

The scorebugs use twenty-eight open-licence font families, all under the **SIL Open Font License 1.1**. Each family's licence text is in
this folder as `LICENSE-<name>.txt`. The files are Latin-subset WOFF2, and a browser downloads one only when a scorebug on screen uses it.

| Family | File | Upstream project |
|---|---|---|
| Archivo (expanded, extra bold; as served by Google Fonts) | `archivo-expanded-latin.woff2` | https://github.com/Omnibus-Type/Archivo |
| Barlow Condensed (bold; as served by Google Fonts) | `barlow-condensed-latin-700-normal.woff2` | https://github.com/jpt/barlow |
| DSEG7 Classic (bold; a seven-segment LCD face, version 0.46, unmodified; Reserved Font Name "DSEG") | `dseg7-classic-bold.woff2` | https://github.com/keshikan/DSEG |
| Inter (semibold) | `inter-latin-600-normal.woff2` | https://github.com/rsms/inter |
| Montserrat (variable, weights 300 to 900 as served) | `montserrat-latin-wght-normal.woff2` | https://github.com/JulietaUla/Montserrat |
| Saira (variable: widths 50-125%, weights 100-900; upright and italic, as served by Google Fonts) | `saira-latin-var.woff2`, `saira-latin-var-italic.woff2` | https://github.com/Omnibus-Type/Saira |
| Inter Tight (variable, weights 100-900, as served by Google Fonts) | `inter-tight-latin-var.woff2` | https://github.com/rsms/inter |
| Bangers (regular, as served by Google Fonts) | `bangers-latin-400.woff2` | https://github.com/googlefonts/bangers |
| Playfair Display (variable, weights 400-900, as served by Google Fonts) | `playfair-display-latin-var.woff2` | https://github.com/clauseggers/Playfair |
| Open Sans 3.003 (variable: widths 75-100%, weights 300-800) | `open-sans-latin-var.woff2` | https://github.com/googlefonts/opensans |
| Michroma 1.100 (regular) | `michroma-latin-400.woff2` | https://github.com/googlefonts/Michroma-font |
| Kanit 2.000 (medium, semibold, semibold italic, bold) | `kanit-latin-500.woff2`, `kanit-latin-600.woff2`, `kanit-latin-600-italic.woff2`, `kanit-latin-700.woff2` | https://github.com/cadsondemak/kanit |
| Roboto 3.015 (variable: widths 75-100%, weights 100-900; upright and italic) | `roboto-latin-var.woff2`, `roboto-latin-var-italic.woff2` | https://github.com/googlefonts/roboto-classic |
| Barlow Semi Condensed 1.408 (bold, bold italic, extra bold italic) | `barlow-semi-condensed-latin-700.woff2`, `barlow-semi-condensed-latin-700-italic.woff2`, `barlow-semi-condensed-latin-800-italic.woff2` | https://github.com/jpt/barlow |
| SB Sans Three: a subset of Source Sans 3 3.052 (variable, weights 200-900), renamed inside the file because "Source" is a Reserved Font Name | `source-sans-3-latin-var.woff2` | https://github.com/adobe-fonts/source-sans |
| Outfit 1.100 (variable, weights 100-900) | `outfit-latin-var.woff2` | https://github.com/Outfitio/Outfit-Fonts |
| Barlow 1.408 (bold, extra bold) | `barlow-latin-700.woff2`, `barlow-latin-800.woff2` | https://github.com/jpt/barlow |
| Barlow Condensed 1.408 (semibold) | `barlow-condensed-latin-600.woff2` | https://github.com/jpt/barlow |
| Inter 4 (variable: optical size 14-32, weights 100-900) | `inter-latin-var.woff2` | https://github.com/rsms/inter |
| Unbounded (variable, weights 200-900) | `unbounded-latin-var.woff2` | https://github.com/googlefonts/unbounded |
| Lexend (variable, weights 100-900) | `lexend-latin-var.woff2` | https://github.com/googlefonts/lexend |
| Big Shoulders Display (variable, weights 100-900) | `big-shoulders-display-latin-var.woff2` | https://github.com/xotypeco/big_shoulders |
| Anton (regular) | `anton-latin-400.woff2` | https://github.com/googlefonts/AntonFont |
| Figtree (variable, weights 300-900) | `figtree-latin-var.woff2` | https://github.com/erikdkennedy/figtree |
| Work Sans (variable, weights 100-900) | `work-sans-latin-var.woff2` | https://github.com/weiweihuanghuang/Work-Sans |
| Archivo (variable: widths 62-125%, weights 100-900) | `archivo-latin-var.woff2` | https://github.com/Omnibus-Type/Archivo |
| Teko (variable, weights 300-700) | `teko-latin-var.woff2` | https://github.com/googlefonts/teko |
| Titillium Web (bold) | `titillium-web-latin-700.woff2` | https://github.com/google/fonts/tree/main/ofl/titilliumweb |
| Bai Jamjuree (bold) | `bai-jamjuree-latin-700.woff2` | https://github.com/cadsondemak/Bai-Jamjuree |
| Public Sans (variable, weights 100-900) | `public-sans-latin-var.woff2` | https://github.com/uswds/public-sans |
| Barlow 1.408 (medium, semibold) | `barlow-latin-500.woff2`, `barlow-latin-600.woff2` | https://github.com/jpt/barlow |
| Barlow Condensed 1.408 (medium, bold italic) | `barlow-condensed-latin-500.woff2`, `barlow-condensed-latin-700-italic.woff2` | https://github.com/jpt/barlow |
| Barlow Semi Condensed 1.408 (semibold) | `barlow-semi-condensed-latin-600.woff2` | https://github.com/jpt/barlow |
| Archivo italic (variable: widths 62-125%, weights 100-900) | `archivo-latin-var-italic.woff2` | https://github.com/Omnibus-Type/Archivo |
| Rajdhani (bold) | `rajdhani-latin-700.woff2` | https://github.com/itfoundry/rajdhani |

The last five rows replaced earlier stand-in fonts, subset the same way.
The fifteen rows before them are each broadcast's closest free match, subset the same way.
The seven before them come from the Google Fonts repository copies (github.com/google/fonts), subset with fontTools:
`pyftsubset <font> --unicodes=U+0020-007E,U+00A0-00FF,U+2013-2014,U+2018-201D,U+2022,U+2026,U+2032-2033,U+00BD,U+00B0,U+00D7,U+25B2,U+25B6,U+25BC,U+25C0,U+25CF --layout-features=kern,tnum,lnum --flavor=woff2 --name-IDs=* --notdef-outline`.

No broadcaster's own typeface is used: each bug sets its type in the open face closest in feel.
