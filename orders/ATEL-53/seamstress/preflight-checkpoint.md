# Seamstress feasibility checkpoint — ATEL-62

- Time: 2026-11-15 UTC. This is tool feasibility evidence only, not garment evidence or a candidate.
- Upstream source: [MangoDragonHub/Seamstress](https://github.com/MangoDragonHub/Seamstress), checkout `/tmp/atelierx-seamstress-preflight/source`, commit `9c5cf4a0fd7901273f4f5be6fbb6bac8542f6e91`.
- Source license: repository `LICENSE` is MIT License, copyright 2026 Rashad Patterson.
- Linux build requirements from upstream README: .NET SDK 8+ (9.0.200+ recommended), CMake, Ninja, C++ compiler, Qt 6 with Qt Quick 3D. `./build.sh --install-qt` installs Qt 6.11.3 (~1.7 GB); then `./build.sh run`.
- Host: Debian 12 x86_64. `g++`/`make` were available; .NET, CMake, Ninja and Qt were initially missing. Installed .NET SDK 9.0.321 plus runtime 8.0.34, CMake 4.4.5, Ninja 1.13.2 and Qt 6.11.3 locally under `/tmp/atelierx-seamstress-preflight`. No global/system installation and no project build output.
- Because system OpenGL/EGL/XCB development/runtime packages and an X server were absent, needed Debian packages were unpacked into the same `/tmp` prefix; a temporary Xvfb :88 display was used. Project filesystem stayed below its 12 GB free-space limit.
- Actual build/run: `./build.sh --install-qt run --smoke --screenshot /tmp/atelierx-seamstress-preflight/smoke-xvfb.png`, with PATH/DOTNET_ROOT, CMAKE_PREFIX_PATH, LIBRARY_PATH, LD_LIBRARY_PATH, DISPLAY=localhost:88, QT_QPA_PLATFORM=xcb, LIBGL_ALWAYS_SOFTWARE=1, QT_QUICK_BACKEND=opengl. Build succeeded; application smoke test passed, including sew/simulate, drape, save, OBJ/GLB/FBX export and reopen. Real 3D viewport rendered on Xvfb/llvmpipe.
- Evidence image: `orders/ATEL-53/seamstress/feasibility-smoke-ui.png` (tool's built-in test scene with mannequin; explicitly not a garment candidate and not shape evidence). Build output: `/tmp/atelierx-seamstress-preflight/build.log`; preflight command output: `/tmp/seamstress-preflight.log`.
- Result: toolchain and application are runnable. ATEL-62 may proceed to exactly one fresh pattern/sew/simulation gray shirt candidate. No candidate has been created yet; prior route snapshots remain untouched.
