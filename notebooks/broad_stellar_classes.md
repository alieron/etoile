# Broad stellar categories for display

Focus: position + broad star category. Radius/color values are display defaults, not physical rendering truth. Use `display_radius_multiplier` with soft log scaling/clamping in renderer.

| Category | Generic real radius (R☉) | Display multiplier | RGB | Notes |
|---|---:|---:|---:|---|
| white_dwarf | 0.01 | 0.35 | `210,225,255` | WD / D spectra |
| brown_dwarf_substellar | 0.10 | 0.50 | `170,80,45` | L/T/Y/BD/planetary-mass candidates |
| red_dwarf | 0.30 | 0.70 | `255,120,80` | M V or M dwarf fallback |
| orange_main_sequence | 0.70 | 0.90 | `255,170,90` | K V |
| yellow_main_sequence | 1.00 | 1.00 | `255,230,140` | G V |
| yellow_white_main_sequence | 1.30 | 1.10 | `255,245,200` | F V |
| white_main_sequence | 2.00 | 1.20 | `245,248,255` | A V |
| blue_main_sequence | 5.00 | 1.40 | `170,205,255` | B V, Be, beta Cep, blue stragglers |
| blue_subgiant | 8.00 | 1.55 | `165,200,255` | O/B IV |
| white_subgiant | 3.00 | 1.30 | `245,248,255` | A IV |
| yellow_subgiant | 2.50 | 1.25 | `255,235,170` | F/G IV |
| orange_red_subgiant | 4.00 | 1.35 | `255,170,100` | K/M IV |
| yellow_giant_bright_giant | 25.00 | 1.80 | `255,210,130` | F/G/K II-III, RR Lyrae, W Vir |
| red_giant_agb | 100.00 | 2.10 | `255,150,90` | M giants, AGB, Mira, LPV, OH/IR |
| red_supergiant_hypergiant | 700.00 | 2.70 | `255,105,70` | K/M I, red hypergiants |
| yellow_supergiant_hypergiant | 300.00 | 2.45 | `255,220,120` | Cepheids, F/G I, yellow hypergiants |
| hot_massive_blue_luminous | 80.00 | 2.20 | `155,195,255` | O stars, blue supergiants, LBV, WR |
| carbon_star | 200.00 | 2.10 | `255,95,55` | C/S/CH/barium-ish bucket |
| binary_multiple_unresolved | 1.50 | 1.15 | `255,255,220` | Only when spectral type cannot approximate primary |
| peculiar_chemically_peculiar | 1.50 | 1.10 | `220,230,255` | Ap/Am/Bp/a2 CVn/HgMn/He peculiar |
| young_stellar_object | 2.00 | 1.20 | `255,190,120` | YSO/T Tauri/Herbig/Orion/FU Ori |
| neutron_star_pulsar | 0.00002 | 0.25 | `180,220,255` | Pulsar/neutron star/magnetar |
| unknown | 1.00 | 1.00 | `230,230,230` | fallback |
