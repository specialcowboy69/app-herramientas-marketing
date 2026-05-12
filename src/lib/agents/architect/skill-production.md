# Skill: Production & Scalability Architect (AI Handoff Protocol)

Este documento establece las reglas críticas de ingeniería para garantizar que la aplicación pueda escalar a millones de usuarios sin colapsar ("Scaling Cliff") y define el estándar para futuras intervenciones de IA.

## 1. Reglas de Oro de Firestore
- **Prohibición de getDocs sin límites:** Nunca ejecutar una consulta a una colección sin `.limit()`. El valor por defecto debe ser `20` o `50`.
- **Paginación Obligatoria:** Todas las listas (historiales, logs, feeds) deben implementar paginación por cursor utilizando `startAfter()`.
- **Escrituras Atómicas:** Para actualizaciones críticas que dependan del estado anterior, usar `transactions`.
- **Índices:** No realizar consultas complejas sin verificar que el índice compuesto existe en `firestore.rules`.

## 2. Estrategia Next.js & Vercel
- **Caché Agresiva:** Utilizar `next: { revalidate: ... }` o `stale-while-revalidate` para datos que no cambian frecuentemente (como configuraciones de herramientas).
- **Edge Runtime:** Usar el Edge Runtime para middleware y APIs ligeras para minimizar la latencia y el costo de ejecución.
- **Invalidación Selectiva:** Utilizar `revalidateTag` para limpiar la caché solo cuando los datos subyacentes cambien.

## 3. Operaciones Asíncronas (Job Polling Pattern)
Para evitar el "Function Timeout" de Vercel (especialmente en el plan Hobby/Pro con IA generativa lenta):
- **Desacoplamiento:** La API no debe esperar a la IA. Debe registrar un "Job" en Firestore con estado `processing` y retornar el `jobId` inmediatamente.
- **Background Processing:** La ejecución de la IA debe ocurrir de forma no bloqueante (Side Effects).
- **Real-time Sync:** El cliente debe usar `onSnapshot()` de Firebase para escuchar el cambio de estado del Job en lugar de hacer polling manual HTTP.

## 4. Estética y UX (AI Handoff Protocol)
- **Zero Placeholders:** Las IAs que modifiquen el código no deben dejar comentarios TODO o secciones vacías. Deben generar contenido funcional o imágenes de respaldo.
- **Micro-interacciones:** Cada estado de carga debe ser una oportunidad de branding (skeletons animados, gradientes fluidos).
- **Conversión:** Los resultados de la IA deben presentarse con jerarquía visual clara y botones de acción inmediata (Copiar, Guardar, Compartir).
