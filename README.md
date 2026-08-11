# Awesome UMI [![Awesome](https://awesome.re/badge.svg)](https://awesome.re) [![Deploy GitHub Pages](https://github.com/commissure-inc/Awesome-UMI/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/commissure-inc/Awesome-UMI/actions/workflows/deploy-pages.yml)

> A curated list of UMI-style tactile and motion data-collection devices for robot learning.

Universal Manipulation Interface (UMI) style devices let people record manipulation demonstrations without a robot in the loop — handheld grippers and hand or arm wearables — together with the datasets and standards that surround them. Every entry is compiled from public sources (papers, project pages, repositories, product pages) and can be filtered and compared on the [live catalog](https://commissure-inc.github.io/Awesome-UMI/).

<!-- BEGIN SUMMARY -->
**49** devices · **11** datasets
<!-- END SUMMARY -->

Entries are grouped by device form and ordered oldest first. Each line reads: name, one-line summary, then organization, first public year, and license.

## Contents

<!-- BEGIN TOC -->
- [Handheld grippers](#handheld-grippers)
- [Wearable hands and gloves](#wearable-hands-and-gloves)
- [Wearable arms and exoskeletons](#wearable-arms-and-exoskeletons)
- [Datasets](#datasets)
- [Standards and policy](#standards-and-policy)
- [Talks and articles](#talks-and-articles)
- [Web catalog](#web-catalog)
- [Repository layout](#repository-layout)
- [License](#license)
- [Maintainer](#maintainer)
<!-- END TOC -->

<!-- BEGIN LIST -->
## Handheld grippers

- [Dobb-E / RUM](https://dobb-e.com/) - Handheld stick rig that uses a smartphone as the sensor suite — NYU (Lerrel Pinto Lab) et al., 2023, MIT ([paper](https://arxiv.org/abs/2311.16098), [code](https://github.com/notmahi/dobb-e)).
- [Fast-UMI](https://fastumi.com/) - No SLAM calibration required; decoupled hardware design — Shanghai AI Lab et al., 2024, MIT ([paper](https://arxiv.org/abs/2409.19499), [code](https://github.com/zxzm-zak/FastUMI_Data)).
- [ForceMimic / ForceCapture](https://forcemimic.github.io/) - Force-Centric Imitation Learning with Force-Motion Capture System for Contact-Rich Manipulation — Shanghai Jiao Tong University, 2024, MIT ([paper](https://arxiv.org/abs/2410.07554), [code](https://github.com/ForceMimic)).
- [LEGATO](https://ut-hcrl.github.io/LEGATO) - Cross-embodiment morphology support; same tool mountable on robot side — UT Austin Human Centered Robotics Lab et al., 2024, MIT ([paper](https://arxiv.org/abs/2411.03682)).
- [ManiWAV](https://maniwav.github.io/) - UMI parallel-jaw gripper with embedded piezoelectric contact microphone ('ear-in-hand') for synchronous in-the-wild audio-visual demonstration collection — Stanford University et al., 2024, MIT ([paper](https://arxiv.org/abs/2406.19464)).
- [UMI](https://umi-gripper.github.io/) - Relative-trajectory action representation, inference-time latency matching — Stanford University et al., 2024, MIT ([paper](https://arxiv.org/abs/2402.10329), [code](https://github.com/real-stanford/universal_manipulation_interface)).
- [ActiveUMI](https://activeumi.github.io/) - Portable VR teleoperation kit with robot grippers on Meta Quest 3s controllers; records operator head motion for active egocentric perception during bimanual in-the-wild collection — Shanghai University et al., 2025 ([paper](https://arxiv.org/abs/2510.01607)).
- [Cloud-UMI / UMIGen](https://arxiv.org/abs/2511.09302) - Records RGB and point cloud jointly; no Visual SLAM; visibility-aware optimization — Tsinghua University (Shenzhen International Graduate School), 2025, open hardware.
- [DAS Fingers](https://www.genrobot.ai/products/finger) - Bionic two-finger handheld collector; 220 mm max opening; millimeter-level trajectory; automatic voice annotation — GenRobot AI, 2025, proprietary.
- [DAS Gripper](https://www.genrobot.ai/products/das) - UMI-inspired handheld multimodal collector (vision, tactile, audio, IMU, magnetic encoder); MCAP output; cloud compression to ~2% of original size — GenRobot AI, 2025, proprietary.
- [DM-DataClaw](https://www.dmrobot.com/en/products/) - Handheld parallel-jaw data collection gripper with vision-based tactile sensors (110,000 sensing units, 120Hz); used alongside DM-DataDex to build the Daimon-Infinity omni-modal dataset — Daimon Robotics, 2025, proprietary.
- [exUMI](https://silicx.github.io/exUMI) - Extensible Robot Teaching System with Action-aware Task-agnostic Tactile Representation — Shanghai Jiao Tong University, 2025, MIT ([paper](https://arxiv.org/abs/2509.14688)).
- [MV-UMI](https://mv-umi.github.io) - Third-person view reduces OOD gap; ~47% gain on scene-understanding tasks — NYU Abu Dhabi, 2025, open hardware ([paper](https://arxiv.org/abs/2509.18757)).
- [Pika Sense](https://global.agilex.ai/products/pika) - Commercial UMI-style handheld collector: human demonstrations without a robot on-site; pairs with Pika Station for mm-level pose; homologous Pika Gripper for deployment on PiPER and other arms — AgileX Robotics, 2025, proprietary.
- [Touch in the Wild](https://binghao-huang.github.io/touch_in_the_wild/) - In/outdoor in-the-wild visuo-tactile sync; joint representation learning via mask reconstruction encoder — Columbia University, 2025, MIT ([paper](https://arxiv.org/abs/2507.15062), [code](https://github.com/YolandaXinyueZhu/touch_in_the_wild)).
- [ViTaMIn](https://chuanyune.github.io/ViTaMIn_page) - No teleop robot required; visuo-tactile integration — UC Berkeley et al., 2025, open hardware ([paper](https://arxiv.org/abs/2504.06156)).
- [ViTaMIn-B](https://chuanyune.github.io/ViTaMIn-B_page/) - Eliminates SLAM drift; bimanual 6DoF unified via Quest 3 — Tsinghua University et al., 2025, open hardware ([paper](https://arxiv.org/abs/2511.05858), [code](https://github.com/chuanyune/ViTaMIn-B_code)).
- [HiFi-UMI](https://cloud.simpleai.tech/simple-world-lab/hifi-umi/) - Head-mounted offline stereo-inertial SLAM with per-hand marker cubes yields 3 mm end-effector accuracy and natively measured inter-gripper relative pose — Simple AI (Simple World Lab), 2026, proprietary ([paper](https://arxiv.org/abs/2607.25895)).
- [HoMMI](https://hommi-robot.github.io/) - UMI grippers augmented with egocentric sensing for whole-body mobile manipulation; cross-embodiment hand-eye policy with embodiment-agnostic 3D visual representation — Stanford University et al., 2026 ([paper](https://arxiv.org/abs/2603.03243), [code](https://github.com/xxm19/hommi)).
- [Koala](https://rai-inst.com/resources/blog/handheld-robotic-data-collection/) - Co-designed handheld and electrically actuated variants share linkages, finger geometry, and sensor suite — RAI Institute, 2026, proprietary.
- [OmniUMI](https://baai-aether.github.io/OmniUMI/) - Handheld multimodal UMI capturing RGB, depth, trajectory, marker-based tactile images, internal grasping force, and external wrench with bilateral gripper feedback — Beijing Academy of Artificial Intelligence, 2026 ([paper](https://arxiv.org/abs/2604.10647)).
- [RoboPocket](https://robo-pocket.github.io/) - Robot-Free Instant Policy Iteration via AR Visual Foresight on a consumer smartphone; remote GPU inference with <150ms latency enables closed-loop online finetuning without physical robot deployment — Shanghai Jiao Tong University et al., 2026, open hardware ([paper](https://arxiv.org/abs/2603.05504)).
- [TacUMI](https://tac-umi.github.io/TacUMI/) - A Multi-Modal Universal Manipulation Interface for Contact-Rich Tasks — Technical University of Munich et al., 2026, open hardware ([paper](https://arxiv.org/abs/2601.14550), [code](https://github.com/martelzhang/TouchGuide)).
- [TAMEn](https://opendrivelab.com/TAMEn) - Tactile-Aware Manipulation Engine for Closed-Loop Data Collection in Contact-Rich Tasks — Fudan University et al., 2026, Apache-2.0 ([paper](https://arxiv.org/abs/2604.07335)).
- [TRumi](https://www.trossenrobotics.com/trumi) - Hardened commercial UMI: replaces 3D-printed gear trigger with zero-backlash cam drive on dual linear rails and constant-force springs (0.4 lb pull), embeds multicolor finger identifiers in the mounts instead of stickers, and widens FOV to 177° via GoPro Ultra Wide Lens Mod — Trossen Robotics, 2026, proprietary.
- [UMI-3D](https://umi-3d.github.io/) - Adds 3D spatial perception while preserving UMI low cost and portability — The University of Hong Kong et al., 2026, partially open source ([paper](https://arxiv.org/abs/2604.14089)).
- [UMI-FT](https://umi-ft.github.io/) - Adds per-finger 6-axis force/torque sensing to a handheld UMI-style parallel-jaw gripper by mounting a coin-sized capacitive CoinFT sensor on each finger, with an iPhone supplying RGB, ultrawide RGB, depth and ARKit pose — Stanford University, 2026, MIT ([paper](https://arxiv.org/abs/2601.09988), [code](https://github.com/real-stanford/UMI-FT)).
- [XRZero-G0](https://x2robot.com/x2go) - Wearable VR rig (PICO 4 + heterogeneous H/G grippers + backpack compute) with closed-loop Collection–Inspection–Training–Evaluation pipeline — X Square Robot, 2026, proprietary ([paper](https://arxiv.org/abs/2604.13001)).
- [YUBI](https://yubi.airoa.io/) - Open-source bidigital (two-finger) dexterous stack: glove + DYNAMIXEL gripper + stationary/portable collection rigs — Toyota Motor Corporation (Frontier Research Center) et al., 2026, partially open source ([code](https://github.com/Toyota/yubi-hw)).

## Wearable hands and gloves

- [DexCap (Stanford)](https://dex-cap.github.io/) - Scalable and Portable Mocap Data Collection System for Dexterous Manipulation — Stanford University, 2024, MIT ([paper](https://arxiv.org/abs/2403.07788), [code](https://github.com/j96w/DexCap)).
- [DEXOP](https://dex-op.github.io/) - A Device for Robotic Transfer of Dexterous Human Manipulation — MIT Improbable AI Lab et al., 2025, open hardware ([paper](https://arxiv.org/abs/2509.04441)).
- [DexUMI](https://dex-umi.github.io/) - Using Human Hand as the Universal Manipulation Interface for Dexterous Manipulation — Stanford University et al., 2025, MIT ([paper](https://arxiv.org/abs/2505.21864), [code](https://github.com/real-stanford/DexUMI)).
- [DexWild](https://dexwild.github.io/) - Dexterous Human Interactions for In-the-Wild Robot Policies — CMU (Pathak Lab), 2025, open hardware ([paper](https://arxiv.org/abs/2505.07813), [code](https://github.com/dexwild/dexwild)).
- [DM-DataDex](https://www.dmrobot.com/en/products/) - Five-finger glove-type dexterous data collection device with vision-based tactile sensors (110,000 sensing units, 120Hz); used alongside DM-DataClaw to build the Daimon-Infinity omni-modal dataset — Daimon Robotics, 2025, proprietary.
- [FreeTacMan](https://opendrivelab.com/FreeTacMan) - Robot-free Visuo-Tactile Data Collection System for Contact-rich Manipulation — OpenDriveLab et al., 2025, Apache-2.0 ([paper](https://arxiv.org/abs/2506.01941)).
- [Skill Capture Glove](https://www.sunday.ai/technology) - UMI-inspired wearable co-designed with Memo robot 3-finger gripper (shared geometry and sensor layout) — Sunday Robotics, 2025, proprietary.
- [ART-Glove](https://linchangyi1.github.io/ART-Glove/) - 16 rigid functional surfaces with 22 anatomically aligned joints make hand-side contact geometry explicit — Carnegie Mellon University, 2026, open hardware ([paper](https://arxiv.org/abs/2606.16370)).
- [DAS Dex](https://www.genrobot.ai/products/dex) - 23-DoF wearable dexterous hand collector; sub-millimeter fingertip trajectories; 3D tactile at 0.05 N / 1 mm; 200 Hz output — GenRobot AI, 2026, proprietary.
- [DEX-Mouse](https://arxiv.org/abs/2604.15013) - Calibration-free 6-DoF handheld interface with kinesthetic force feedback (<USD 150 BOM); forearm-mounted robot-hand configuration for robot-aligned data without morphological retargeting — Sogang University, 2026, open hardware.
- [DexEXO](https://dexexo-research.github.io/) - Wearability-first linkage exoskeleton with passive data-capture hand for hardware-level visual and kinematic alignment; hand lengths 140–217 mm without per-user calibration — UCLA, 2026 ([paper](https://arxiv.org/abs/2603.17323)).
- [DexViTac](https://arxiv.org/abs/2603.17851) - Portable visuo-tactile-kinematic collection with Manus mocap gloves, HIT LongLin-96 fingertip sensors, GoPro, and T265; kinematics-grounded tactile representation learning — Huazhong University of Science and Technology, 2026.
- [Grabette](https://github.com/pollen-robotics/grabette) - Robot-agnostic wearable hand capture on Raspberry Pi: synchronized fisheye RGB + OAK-D depth/IMU, finger joint encoders, on-device session UI, and a postprocess pipeline that runs SLAM then exports LeRobot datasets for policy learning — Pollen Robotics, 2026, Apache-2.0.
- [HandUMI](https://github.com/BrikHMP18/HandUMI) - Moves the collection interface onto the operator's hand: mounts on thumb and index/middle fingers, opens and closes with a natural pinch, measures gripper width directly with a servo encoder, and swaps detachable 3D-printed tips to retarget one wearable across different parallel-jaw robot grippers — RoboNet et al., 2026, Apache-2.0.
- [PXCap III](https://paxini.com/us/ax/pxcap3) - 1:1 collection-execution isomorphism with PXDex III robotic hand — PaXini Tech, 2026, proprietary.
- [RealDexUMI](https://research.beingbeyond.com/realdexumi) - Shared dexterous end-effector module with in-hand vision and fingertip tactile sensing; zero-gap collection-to-deployment data via matched observations, contacts, and hand actions — BeingBeyond, 2026, proprietary ([paper](https://arxiv.org/abs/2606.06033)).

## Wearable arms and exoskeletons

- [AirExo](https://airexo.github.io/) - Low-Cost Exoskeletons for Learning Whole-Arm Manipulation in the Wild — Shanghai Jiao Tong University et al., 2024, open hardware ([paper](https://arxiv.org/abs/2309.14975), [code](https://github.com/AirExo/collector)).
- [AirExo-2](https://airexo.tech/airexo2) - Visual adaptor, pseudo-robot demo conversion, RISE-2 policy integration — Shanghai Jiao Tong University et al., 2025, open hardware ([paper](https://arxiv.org/abs/2503.03081), [code](https://github.com/AirExo/AirExo-2)).
- [DexCap (DexRobot)](https://www.dex-robot.com/en/dexCap) - Wearable full-arm capture system — DexRobot, 2025, proprietary.
- [Exo-ViHa](https://exo-viha2025.github.io/) - 3D-printed forearm exoskeleton with interchangeable dexterous hands; T265 pose, wrist camera, and motion-capture glove; passive haptic feedback via exoskeleton contact — Tsinghua University, 2025 ([paper](https://arxiv.org/abs/2503.01543)).

## Datasets

- [Open X-Embodiment (OXE)](https://robotics-transformer-x.github.io/) - Real / multi-embodiment — Google DeepMind + 34 labs — 1M+ trajectories, 527 tasks.
- [DROID](https://droid-dataset.github.io/) - Real / manipulation — Stanford + 13 institutions — 76K trajectories, 350 hours.
- [RoboMIND](https://x-humanoid-robomind.github.io/) - Real / multi-embodiment — Beijing Humanoid Center + PKU — 107K trajectories, 479 tasks.
- [AgiBot World Colosseo](https://agibot-world.com/) - Real / manipulation — AgiBot — 1M+ trajectories, 2976 hours, 217 tasks.
- [FastUMI-100K](https://github.com/MrKeee/FastUMI-100K) - Real / manipulation — Shanghai AI Lab — 100K+ trajectories, 600 hours, 54 tasks.
- [DexWild Dataset](https://huggingface.co/datasets/boardd/dexwild-dataset) - Real / dexterous — CMU — 9505 episodes, 33 hours.
- [Gen-EgoData](https://huggingface.co/datasets/genrobot2025/Gen-EgoData) - Real / egocentric — GenRobot — 20,000+ hours, 500 tasks.
- [10Kh-RealOmin-OpenData](https://huggingface.co/datasets/genrobot2025/10Kh-RealOmin-OpenData) - Real / manipulation — GenRobot — 13,000+ hours.
- [Genie Sim Synthetic](https://github.com/AgibotTech/genie_sim) - Simulation — AgiBot — 10,000+ hours, 200 tasks.
- [DAIMON Public Tactile](https://modelscope.cn/datasets/daimonrobotics/Daimon-Infinity) - Real / tactile — DAIMON Robotics — 10,000+ hours, 2000 tasks.
- [HiFi-UMI-2K](https://huggingface.co/datasets/simple-world-lab/HiFi-UMI-2K) - Real / robot-free manipulation — Simple AI (Simple World Lab) — 482K+ episodes, 2000 hours.

## Standards and policy

- **MIIT Intelligent Data Collection Standard 1.0** (China, 2024-11) - Synchronization, format, labeling, quality grading of multimodal robot training data.
- **Shanghai Embodied Intelligence Plan** (China) - China's first comprehensive plan, R&D + shared infrastructure.
- **China 2nd Embodied AI Conference Roadmap** - 2025-2027: foundation/shared datasets/open middleware; 2028-2030: factory/logistics/elderly care pilots; Post-2030: generalization/mass-market.

## Talks and articles

- [Getting a Grip on Robotic Data Collection](https://www.youtube.com/watch?v=8Ip5ehvsUlk) - Video — RAI Institute, 2026-05-12 — Challenges in handheld data collection (transfer is hard when the robot gripper uses a different interface) and the Koala gripper approach of co-designing human and robot linkages.
<!-- END LIST -->

## Web catalog

The list above is also browsable at **commissure-inc.github.io/Awesome-UMI**, a static Vite + React UI hosted on GitHub Pages with filters for form factor, tactile and force sensing, pose tracking, license, country, and commercialization stage. Device data is bundled at build time from `umi_devices_data.json`.

```bash
cd web
npm install
npm run dev
```

To preview with the same base path as GitHub Pages:

```bash
cd web
VITE_BASE_PATH=/Awesome-UMI/ npm run build
npm run preview
```

## Repository layout

| Path                                                         | Description                                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------------ |
| [`umi_devices_data.json`](umi_devices_data.json)             | Catalog data, the single source of truth (CC BY 4.0)               |
| [`web/`](web/)                                               | Vite + React catalog UI                                            |
| [`scripts/generate-readme.mjs`](scripts/generate-readme.mjs) | Regenerates the list sections of this README from the catalog data |
| [`.github/workflows/`](.github/workflows/)                   | GitHub Pages deploy and README sync check                          |

## Contributing

New device submissions and corrections are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). You can use the *Contribute* tab on the web catalog to generate a submission JSON, or open an issue with the [add a device](https://github.com/commissure-inc/Awesome-UMI/issues/new?template=add_device.yml) or [request a correction](https://github.com/commissure-inc/Awesome-UMI/issues/new?template=correct_device.yml) template. All submissions are reviewed against public primary sources before publication.

Entries in the list above are generated from the catalog data, so edit `umi_devices_data.json` and rerun `node scripts/generate-readme.mjs` rather than editing the list by hand.

## License

| Scope                                  | License                      |
| -------------------------------------- | ---------------------------- |
| Code (`web/`, `scripts/`)              | [MIT](LICENSE)               |
| Catalog data (`umi_devices_data.json`) | [CC BY 4.0](LICENSE-DATA.md) |

If you use the catalog data, please follow the attribution example in the data license.

## Maintainer

[commissure, inc.](https://commissure.co.jp/)
