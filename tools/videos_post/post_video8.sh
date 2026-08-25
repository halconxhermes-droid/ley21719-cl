#!/bin/bash
# Postproducción Video 8 — superpone rótulos correctos sobre el formulario corrupto
# Uso: ./post_video8.sh <entrada.mp4> <salida.mp4>
set -e
IN="${1:?falta entrada}"
OUT="${2:-video8_final.mp4}"
F="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FR="/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"

# Rótulos con fade in/out (aparecen 0.5s-9.5s), estilo consistente con la serie (teal/oscuro)
ffmpeg -y -v error -i "$IN" -filter_complex "
drawtext=fontfile=$F:text='BASE LEGAL REQUERIDA':fontcolor=white:fontsize=30:borderw=3:bordercolor=0x0F172A@0.95:box=1:boxcolor=0x047857E6:boxborderw=14:x=(w-text_w)/2:y=h*0.18:alpha='if(lt(t,0.6),0,if(lt(t,1.1),(t-0.6)/0.5,if(lt(t,9.3),1,(9.7-t)/0.4)))',
drawtext=fontfile=$FR:text='Todo tratamiento de datos necesita una base legal':fontcolor=white:fontsize=21:borderw=2:bordercolor=0x0F172A@0.9:box=1:boxcolor=0x0F172ACC:boxborderw=10:x=(w-text_w)/2:y=h*0.18+52:alpha='if(lt(t,0.9),0,if(lt(t,1.4),(t-0.9)/0.5,if(lt(t,9.3),1,(9.7-t)/0.4)))',
drawtext=fontfile=$F:text='FINALIDAD ESPECÍFICA E INFORMADA':fontcolor=white:fontsize=26:borderw=3:bordercolor=0x0F172A@0.95:box=1:boxcolor=0x0F172AE6:boxborderw=12:x=(w-text_w)/2:y=h*0.80:alpha='if(lt(t,4.5),0,if(lt(t,5.0),(t-4.5)/0.5,if(lt(t,9.3),1,(9.7-t)/0.4)))',
drawtext=fontfile=$FR:text='Solo recolecta datos para fines previamente informados':fontcolor=white:fontsize=20:borderw=2:bordercolor=0x0F172A@0.9:box=1:boxcolor=0x0F172ACC:boxborderw=9:x=(w-text_w)/2:y=h*0.80+46:alpha='if(lt(t,4.8),0,if(lt(t,5.3),(t-4.8)/0.5,if(lt(t,9.3),1,(9.7-t)/0.4)))'
" -c:v libx264 -preset medium -crf 19 -c:a copy "$OUT"
echo "OK -> $OUT"
