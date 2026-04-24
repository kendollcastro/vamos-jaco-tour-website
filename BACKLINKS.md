# Directorios Turísticos para Backlinks

## Priority 1: Alta obligatoria (Alto tráfico)

| Directorio | URL | Notas |
|------------|-----|-------|
| TripAdvisor | tripadvisor.com | Requiere verificación de negocio |
| Google Business Profile | business.google.com | Gratis, esencial para SEO local |
| Viator (GetYourGuide) | viator.com/affiliates | Programa de afiliados |
| Yelp | yelp.com | Fuerte en USA |
| Expedia | expedia.com | Agregador de viajes |

## Priority 2: Directorios de Costa Rica

| Directorio | URL | Notas |
|------------|-----|-------|
| Costa Rica Tourism | visitcostarica.com | Oficial de turismo |
| Guanacaste Tourism | guanacastetourism.com | Regional |
| JacoGuide | jacoguide.com | Local de Jaco |
| Costa Rica Directory | costaricadirectory.com | General |

## Priority 3: Blogs de Viaje (Guest Posts)

| Sitio | URL | Notas |
|-------|-----|-------|
| Costa Rica Travel Life | costaricatravellife.com | Ya tienen artículos sobre ATV tours |
| The Costa Rica Toursite | thecostaricatoursite.com | Directorio de tours |
| Adventure Tours Blog | adventuretourscostarica.com/blog | Blog activo |

## Priority 4: Directorios de Aventura

| Directorio | URL | Notas |
|------------|-----|-------|
| Trip Canvas | tripcanvas.com | AAA travel partner |
| Things to Do | thingstodo.com | Travel aggregator |

---

## Acciones recomendadas

### 1. Google Business Profile (GRATIS - PRIORIDAD MÁXIMA)
1. Ir a business.google.com
2. Buscar "Vamos Jacó Tours"
3. Claim o crear negocio
4. Completar: fotos, horarios, servicios
5. Responder todas las reseñas

### 2. TripAdvisor (Alto impacto)
1. Ir a tripadvisor.com/owners
2. Claim del negocio
3. Agregar fotos y descripción
4. Responder reseñas

### 3. Viator como operador
- Aplicar para ser proveedor: viator.com/affiliates
- Permite reservas directas desde Viator
- Genera backlinks automáticos

### 4. Directorios locales
- JacoGuide.com tiene artículos sobre tours
- Costa Rica Tourism tiene directorio de operadores

---

## Script para verificar backlinks existentes

```bash
# Verificar si el sitio está en directorios principales
echo "Verificando backlinks..."

sites=(
    "tripadvisor.com"
    "yelp.com"
    "expedia.com"
    "booking.com"
)

for site in "${sites[@]}"; do
    echo -n "Buscando en $site... "
    curl -s -I "https://www.$site/search?q=vamos+jaco+tours" | head -1
done
```

---

## Métricas a seguir

- [ ] Google Business Profile activo
- [ ] TripAdvisor verificado
- [ ] Viator como operador
- [ ] 5+ directorio locales
- [ ] 2+ guest posts en blogs de viaje
