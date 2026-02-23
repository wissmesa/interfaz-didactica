#!/bin/bash
DIR="public/images/empresas"
mkdir -p "$DIR"

download_logo() {
  local file="$1"
  local domain="$2"
  local path="$DIR/$file"

  if [ -f "$path" ]; then
    echo "  ✓ $file ya existe, saltando"
    return 0
  fi

  # Try Clearbit Logo API
  HTTP_CODE=$(curl -sL -w "%{http_code}" "https://logo.clearbit.com/$domain?size=200" -o "$path" 2>/dev/null)
  if [ "$HTTP_CODE" = "200" ] && [ -s "$path" ]; then
    echo "  ✓ $file descargado (Clearbit)"
    return 0
  fi
  rm -f "$path"

  # Try Google favicon as fallback
  HTTP_CODE=$(curl -sL -w "%{http_code}" "https://www.google.com/s2/favicons?domain=$domain&sz=128" -o "$path" 2>/dev/null)
  if [ "$HTTP_CODE" = "200" ] && [ -s "$path" ]; then
    echo "  ✓ $file descargado (Google favicon)"
    return 0
  fi
  rm -f "$path"

  echo "  ✗ $file NO encontrado para $domain"
  return 1
}

echo "=== Descargando logos de empresas ==="
echo ""

# High confidence domains
download_logo "banesco.png" "banesco.com"
download_logo "digitel.png" "digitel.com.ve"
download_logo "citibank.png" "citibank.com"
download_logo "marriott.png" "marriott.com"
download_logo "kimberly-clark.png" "kimberly-clark.com"
download_logo "pernod-ricard.png" "pernod-ricard.com"
download_logo "robert-bosch.png" "bosch.com"
download_logo "zurich-seguros.png" "zurich.com"
download_logo "farmatodo.png" "farmatodo.com"
download_logo "venemergencia.png" "venemergencia.com"
download_logo "mercantil-seguros.png" "mercantilseguros.com"
download_logo "seguros-caracas.png" "seguroscaracas.com"
download_logo "makro.png" "makro.com.ve"
download_logo "ferretotal.png" "ferretotal.com"
download_logo "excelsior-gama.png" "excelsiorgama.com"
download_logo "todoticket.png" "todoticket.com.ve"

# Medium confidence domains
download_logo "alimentos-mary.png" "alimentosmary.com"
download_logo "alfonzo-rivas.png" "alfonzorivas.com"
download_logo "pollos-arturos.png" "pollosarturos.com"
download_logo "seguros-nuevo-mundo.png" "segurosnuevomundo.com"
download_logo "rolda.png" "rolda.com"
download_logo "perfumes-factory.png" "perfumesfactory.com"
download_logo "laboratorios-vargas.png" "laboratoriosvargas.com"
download_logo "fundacion-badan.png" "fundacionbadan.org"
download_logo "supermercados-plazas.png" "supermercadosplazas.com"
download_logo "duncan.png" "duncan.com.ve"
download_logo "laboratorios-farma.png" "labfarma.com"

echo ""
echo "=== Descarga completada ==="
echo ""
echo "Logos existentes en $DIR:"
ls -la "$DIR/"
