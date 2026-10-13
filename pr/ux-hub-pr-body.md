## Summary
- HYROX hub: add program cards and anchors on /race-hub
- Center search: align and style in header/hero
- OSS centers: 10 centers added to lib/centros-entrenamiento.json
- Dynamic center links: web/IG/Google fallbacks on /centros-entrenamiento

## Changed files
- pages/race-hub.js
- pages/index.js
- pages/centros-entrenamiento.js
- lib/centros-entrenamiento.json
- styles/global.css

## QA
- Build the app and verify:
- /race-hub shows HYROX program cards with anchors
- /centros-entrenamiento shows dynamic center links with proper targets
- Footer Programas HYROX link navigates to /race-hub
- Header center search remains visible and usable on desktop/mobile

## Notes
- This is an initial PR to establish the hub UX and OSS data pipeline. Further enhancements can be added in follow-up PRs.
