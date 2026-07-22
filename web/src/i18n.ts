export type Locale = "ja" | "en";

const STORAGE_KEY = "umi-catalog-locale";

export function loadStoredLocale(): Locale {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "ja" || v === "en") return v;
  } catch {
    /* ignore */
  }
  return "en";
}

export function storeLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
}

/** Filter axis section titles (keys match filter_axes in JSON). */
export const AXIS_LABELS: Record<Locale, Record<string, string>> = {
  ja: {
    form_category: "形態",
    tactile_integration: "触覚センサ",
    force_torque_integration: "力覚センサ",
    pose_tracking: "ポーズ追跡",
    bimanual: "両手",
    license: "ライセンス",
    country: "国・地域",
    commercialization_stage: "商用化段階",
  },
  en: {
    form_category: "Form",
    tactile_integration: "Tactile sensor",
    force_torque_integration: "Force / torque sensor",
    pose_tracking: "Pose tracking",
    bimanual: "Bimanual",
    license: "License",
    country: "Country / region",
    commercialization_stage: "Commercialization stage",
  },
};

/** form_category value labels. */
const FORM_CATEGORY_LABELS: Record<Locale, Record<string, string>> = {
  ja: {
    handheld_gripper: "ハンドヘルド",
    wearable_hand: "ウェアラブル（手・グローブ）",
    wearable_arm: "ウェアラブル（腕）",
    head_mounted: "ヘッドマウント",
    teleop_station: "テレオペ・ヒューマノイド",
    software_only: "ソフトウェアのみ",
    sensor_module: "センサ部品",
    robot_arm_kit: "ロボットアーム",
    platform_infrastructure: "プラットフォーム・基盤",
  },
  en: {
    handheld_gripper: "Handheld",
    wearable_hand: "Wearable (hand / glove)",
    wearable_arm: "Wearable (arm)",
    head_mounted: "Head-mounted",
    teleop_station: "Teleop / humanoid",
    software_only: "Software only",
    sensor_module: "Sensor module",
    robot_arm_kit: "Robot arm kit",
    platform_infrastructure: "Platform / infrastructure",
  },
};

const COMMERCIALIZATION_LABELS: Record<Locale, Record<string, string>> = {
  ja: {
    paper_only: "論文のみ",
    oss_diy: "OSS / DIY",
    commercial_product: "商用製品",
    full_stack_business: "フルスタック事業",
    oss_ecosystem: "OSS エコシステム",
  },
  en: {
    paper_only: "Paper only",
    oss_diy: "OSS / DIY",
    commercial_product: "Commercial product",
    full_stack_business: "Full-stack business",
    oss_ecosystem: "OSS ecosystem",
  },
};

/** tactile_integration value labels. */
const TACTILE_INTEGRATION_LABELS: Record<Locale, Record<string, string>> = {
  ja: {
    none: "なし",
    type_unspecified: "あり（方式不明）",
    vision_based: "視覚ベース",
    contact_microphone: "コンタクトマイク",
    piezoresistive: "圧阻型",
    hall_array: "ホールアレイ",
    emf: "EMF",
  },
  en: {
    none: "None",
    type_unspecified: "Present (type unspecified)",
    vision_based: "Vision-based",
    contact_microphone: "Contact microphone",
    piezoresistive: "Piezoresistive",
    hall_array: "Hall array",
    emf: "EMF",
  },
};

/** pose_tracking value labels (spatial 6DoF acquisition method). */
const POSE_TRACKING_LABELS: Record<Locale, Record<string, string>> = {
  ja: {
    visual_slam: "Visual SLAM",
    visual_inertial: "Visual-inertial (VIO)",
    lidar_inertial: "LiDAR-inertial (LIO)",
    vr_controller_tracker: "VR controller / tracker",
    external_mocap: "外部モーキャプ",
  },
  en: {
    visual_slam: "Visual SLAM",
    visual_inertial: "Visual-inertial (VIO)",
    lidar_inertial: "LiDAR-inertial (LIO)",
    vr_controller_tracker: "VR controller / tracker",
    external_mocap: "External mocap",
  },
};

/** form_factor value labels (detail-level form classification). */
const FORM_FACTOR_LABELS: Record<Locale, Record<string, string>> = {
  ja: {
    handheld_parallel_jaw: "ハンドヘルド（平行グリッパ）",
    handheld_multi_finger: "ハンドヘルド（多指）",
    wearable_exoskeleton_hand: "手部外骨格",
    wearable_exoskeleton_hand_passive: "手部外骨格（受動）",
    wearable_full_arm: "腕全体ウェアラブル",
    wearable_full_arm_chest: "腕・胸部ウェアラブル",
    mocap_glove: "モーキャプグローブ",
    smart_glasses: "スマートグラス",
    stick_with_phone: "スティック＋スマホ",
    ar_virtual: "AR / バーチャル",
    rgb_camera_only: "RGB カメラのみ",
    humanoid_teleop: "ヒューマノイドテレオペ",
    seated_teleop: "着座型テレオペ",
    finger_worn: "指装着型",
    sensor_pad_module: "センサパッドモジュール",
    robotic_arm: "ロボットアーム",
    tactile_sensor_fingertip: "指先触覚センサ",
    bimanual_imitation_kit: "両手模倣キット",
  },
  en: {
    handheld_parallel_jaw: "Handheld (parallel jaw)",
    handheld_multi_finger: "Handheld (multi-finger)",
    wearable_exoskeleton_hand: "Hand exoskeleton",
    wearable_exoskeleton_hand_passive: "Hand exoskeleton (passive)",
    wearable_full_arm: "Full-arm wearable",
    wearable_full_arm_chest: "Arm + chest wearable",
    mocap_glove: "Mocap glove",
    smart_glasses: "Smart glasses",
    stick_with_phone: "Stick with phone",
    ar_virtual: "AR / virtual",
    rgb_camera_only: "RGB camera only",
    humanoid_teleop: "Humanoid teleop",
    seated_teleop: "Seated teleop",
    finger_worn: "Finger-worn",
    sensor_pad_module: "Sensor pad module",
    robotic_arm: "Robotic arm",
    tactile_sensor_fingertip: "Fingertip tactile sensor",
    bimanual_imitation_kit: "Bimanual imitation kit",
  },
};

/** force_torque_integration value labels. */
const FORCE_TORQUE_LABELS: Record<Locale, Record<string, string>> = {
  ja: {
    none: "なし",
    "6axis_ft": "6軸 F/T",
    contact_microphone: "コンタクトマイク",
    single_axis: "単軸",
    joint_torque: "関節トルク",
  },
  en: {
    none: "None",
    "6axis_ft": "6-axis F/T",
    contact_microphone: "Contact microphone",
    single_axis: "Single-axis",
    joint_torque: "Joint torque",
  },
};

const BIMANUAL_LABELS: Record<Locale, Record<string, string>> = {
  ja: {
    yes: "対応",
    no: "非対応",
    extensible: "拡張で対応可",
  },
  en: {
    yes: "Yes",
    no: "No",
    extensible: "Extensible",
  },
};

const LICENSE_LABELS: Record<Locale, Record<string, string>> = {
  ja: {
    mit: "MIT",
    apache: "Apache",
    mpl_2: "MPL-2.0",
    partial_oss: "一部 OSS",
    commercial_closed: "商用（クローズド）",
    diy_open: "DIY / オープン",
  },
  en: {
    mit: "MIT",
    apache: "Apache",
    mpl_2: "MPL-2.0",
    partial_oss: "Partial OSS",
    commercial_closed: "Commercial (closed)",
    diy_open: "DIY / open",
  },
};

const COUNTRY_LABELS: Record<Locale, Record<string, string>> = {
  ja: {
    us: "米国",
    china: "中国",
    china_global: "中国 / グローバル",
    japan: "日本",
    germany: "ドイツ",
    uae: "UAE",
    russia: "ロシア",
    uk: "英国",
    south_korea: "韓国",
    canada: "カナダ",
    peru: "ペルー",
    france: "フランス",
  },
  en: {
    us: "US",
    china: "China",
    china_global: "China / global",
    japan: "Japan",
    germany: "Germany",
    uae: "UAE",
    russia: "Russia",
    uk: "UK",
    south_korea: "South Korea",
    canada: "Canada",
    peru: "Peru",
    france: "France",
  },
};

/** Value labels for every filter axis, keyed by axis name (keys match filter_axes in JSON). */
export const AXIS_VALUE_LABELS: Record<string, Record<Locale, Record<string, string>>> = {
  form_category: FORM_CATEGORY_LABELS,
  form_factor: FORM_FACTOR_LABELS,
  commercialization_stage: COMMERCIALIZATION_LABELS,
  tactile_integration: TACTILE_INTEGRATION_LABELS,
  force_torque_integration: FORCE_TORQUE_LABELS,
  pose_tracking: POSE_TRACKING_LABELS,
  bimanual: BIMANUAL_LABELS,
  license: LICENSE_LABELS,
  country: COUNTRY_LABELS,
};

export const UI: Record<
  Locale,
  {
    siteTitle: string;
    loading: string;
    loadFailed: string;
    yearFirst: string;
    yearMin: string;
    yearMax: string;
    clearFilters: string;
    showFilters: string;
    hideFilters: string;
    sortBy: string;
    sortCatalog: string;
    sortYearAsc: string;
    sortYearDesc: string;
    sortNameAsc: string;
    sortNameDesc: string;
    tabProjects: string;
    tabDatasets: string;
    tabContribute: string;
    addMissingProject: string;
    addMissingDataset: string;
    tableName: string;
    tableNotes: string;
    close: string;
    sources: string;
    detailOrganization: string;
    detailKeyInnovation: string;
    updated: string;
    beta: string;
    maintainedBy: string;
    viewOnGithub: string;
    disclaimer: string;
  }
> = {
  ja: {
    siteTitle: "Awesome UMI",
    loading: "カタログを読み込み中",
    loadFailed: "データの読み込みに失敗しました。",
    yearFirst: "初出年",
    yearMin: "最小",
    yearMax: "最大",
    clearFilters: "フィルタをクリア",
    showFilters: "フィルタ",
    hideFilters: "フィルタを閉じる",
    sortBy: "並び替え",
    sortCatalog: "追加順",
    sortYearAsc: "発表年（古い順）",
    sortYearDesc: "発表年（新しい順）",
    sortNameAsc: "名称（A→Z）",
    sortNameDesc: "名称（Z→A）",
    tabProjects: "プロジェクト",
    tabDatasets: "データセット",
    tabContribute: "申告",
    addMissingProject: "漏れているプロジェクトを追加",
    addMissingDataset: "漏れているデータセットを追加",
    tableName: "名称",
    tableNotes: "備考",
    close: "閉じる",
    sources: "出典",
    detailOrganization: "組織",
    detailKeyInnovation: "概要",
    updated: "更新",
    beta: "ベータ",
    maintainedBy: "maintained by commissure, inc.",
    viewOnGithub: "GitHub リポジトリを開く",
    disclaimer:
      "免責事項：本サイトに掲載されている情報は、正確性・完全性を保証するものではありません。最新の仕様や公式情報は、各プロジェクトの公式資料をご確認ください。",
  },
  en: {
    siteTitle: "Awesome UMI",
    loading: "Loading catalog",
    loadFailed: "Failed to load data.",
    yearFirst: "Year first",
    yearMin: "Min",
    yearMax: "Max",
    clearFilters: "Clear filters",
    showFilters: "Filters",
    hideFilters: "Hide filters",
    sortBy: "Sort by",
    sortCatalog: "Added order",
    sortYearAsc: "Year (oldest first)",
    sortYearDesc: "Year (newest first)",
    sortNameAsc: "Name (A–Z)",
    sortNameDesc: "Name (Z–A)",
    tabProjects: "Projects",
    tabDatasets: "Datasets",
    tabContribute: "Contribute",
    addMissingProject: "Add missing project",
    addMissingDataset: "Add missing dataset",
    tableName: "Name",
    tableNotes: "Notes",
    close: "Close",
    sources: "Sources",
    detailOrganization: "Organization",
    detailKeyInnovation: "Summary",
    updated: "updated",
    beta: "Beta",
    maintainedBy: "maintained by commissure, inc.",
    viewOnGithub: "View on GitHub",
    disclaimer:
      "Disclaimer: Information on this site may be inaccurate or incomplete. Please refer to each project's official sources for the latest specifications.",
  },
};

export const CONTRIBUTE_UI: Record<
  Locale,
  {
    kindProject: string;
    kindDataset: string;
    modeAdd: string;
    modeCorrect: string;
    sectionRequired: string;
    sectionOptional: string;
    sectionProposedChanges: string;
    hintProposedChanges: string;
    labelCurrent: string;
    labelProposed: string;
    labelName: string;
    labelId: string;
    labelStage: string;
    labelProjectUrl: string;
    labelGithub: string;
    labelPaper: string;
    labelRationale: string;
    labelFormCategory: string;
    labelInnovation: string;
    labelCountry: string;
    labelYear: string;
    labelFullName: string;
    labelOrganization: string;
    labelFormFactor: string;
    labelTactile: string;
    labelForceTorque: string;
    labelPoseTracking: string;
    labelBimanual: string;
    labelLicense: string;
    labelNotes: string;
    labelImageUrl: string;
    labelAuthor: string;
    selectUnset: string;
    downloadJson: string;
    showPreview: string;
    hidePreview: string;
    openIssue: string;
    afterTitle: string;
    after1: string;
    after2: string;
    after3: string;
    licenseNote: string;
    errors: Record<string, string>;
  }
> = {
  ja: {
    kindProject: "プロジェクト",
    kindDataset: "データセット",
    modeAdd: "新規追加",
    modeCorrect: "修正依頼",
    sectionRequired: "必須",
    sectionOptional: "任意",
    sectionProposedChanges: "修正内容",
    hintProposedChanges: "変更したい項目だけ入力してください（空欄は無視されます）",
    labelCurrent: "現在",
    labelProposed: "修正後",
    labelName: "名称",
    labelId: "ID（小文字・英数字・アンダースコア）",
    labelStage: "商用化段階",
    labelProjectUrl: "主要 URL（プロジェクトページ等）",
    labelGithub: "GitHub URL",
    labelPaper: "論文 URL",
    labelRationale: "載せる理由",
    labelFormCategory: "形態",
    labelInnovation: "キーイノベーション（1文）",
    labelCountry: "国・地域",
    labelYear: "初出年",
    labelFullName: "正式名称",
    labelOrganization: "開発機関（カンマ区切り）",
    labelFormFactor: "形態（細分類）",
    labelTactile: "触覚センサ",
    labelForceTorque: "力覚センサ",
    labelPoseTracking: "ポーズ追跡",
    labelBimanual: "両手対応",
    labelLicense: "ライセンス",
    labelNotes: "備考",
    labelImageUrl: "画像 URL",
    labelAuthor: "提出者（GitHub 等）",
    selectUnset: "— 未設定 —",
    downloadJson: "候補 JSON をダウンロード",
    showPreview: "JSON プレビュー",
    hidePreview: "プレビューを閉じる",
    openIssue: "GitHub Issue を開く",
    afterTitle: "ダウンロード後",
    after1: "Issue テンプレに JSON を貼る、または",
    after2: "updates/candidates/YYYY-MM-DD/ に置いて PR を出す",
    after3: "メンテナがレビュー後、umi_devices_data.json の products[] に反映",
    licenseNote: "提出データは CC BY 4.0 で公開されます（LICENSE-DATA.md）。",
    errors: {
      name_required: "名称を入力してください。",
      id_invalid: "ID は小文字の英数字とアンダースコアのみ（例: my_gripper）。",
      url_required: "主要 URL・GitHub・論文のいずれか 1 件以上、有効な https:// URL を入力してください。",
      url_invalid: "URL は https:// で始まる有効な形式で入力してください。",
      rationale_required: "載せる理由を入力してください。",
      stage_required: "商用化段階を選択してください。",
      image_url_invalid: "画像 URL は有効な https:// 形式で入力してください。",
      target_id_required: "修正対象のプロジェクト ID を選択してください。",
      target_name_required: "修正対象のデータセットを選択してください。",
      changes_required: "修正内容を 1 項目以上入力してください。",
    },
  },
  en: {
    kindProject: "Project",
    kindDataset: "Dataset",
    modeAdd: "Add new",
    modeCorrect: "Request correction",
    sectionRequired: "Required",
    sectionOptional: "Optional",
    sectionProposedChanges: "Proposed changes",
    hintProposedChanges: "Fill only the fields you want to change (blank fields are ignored)",
    labelCurrent: "Current",
    labelProposed: "Proposed",
    labelName: "Name",
    labelId: "ID (lowercase [a-z0-9_])",
    labelStage: "Commercialization stage",
    labelProjectUrl: "Primary URL (project page, etc.)",
    labelGithub: "GitHub URL",
    labelPaper: "Paper URL",
    labelRationale: "Why add this project?",
    labelFormCategory: "Form",
    labelInnovation: "Key innovation (one line)",
    labelCountry: "Country / region",
    labelYear: "Year first public",
    labelFullName: "Full name",
    labelOrganization: "Organization(s), comma-separated",
    labelFormFactor: "Form factor",
    labelTactile: "Tactile integration",
    labelForceTorque: "Force / torque integration",
    labelPoseTracking: "Pose tracking",
    labelBimanual: "Bimanual",
    labelLicense: "License",
    labelNotes: "Notes",
    labelImageUrl: "Image URL",
    labelAuthor: "Submitter (GitHub handle, etc.)",
    selectUnset: "— unset —",
    downloadJson: "Download candidate JSON",
    showPreview: "Preview JSON",
    hidePreview: "Hide preview",
    openIssue: "Open GitHub Issue",
    afterTitle: "After download",
    after1: "Paste JSON into the Issue template, or",
    after2: "Add under updates/candidates/YYYY-MM-DD/ and open a PR",
    after3: "Maintainers review and merge into umi_devices_data.json products[]",
    licenseNote: "Submitted data is published under CC BY 4.0 (LICENSE-DATA.md).",
    errors: {
      name_required: "Enter a project name.",
      id_invalid: "ID must use lowercase letters, digits, and underscores (e.g. my_gripper).",
      url_required: "Enter at least one valid https:// URL (primary, GitHub, or paper).",
      url_invalid: "URLs must be valid and start with https://.",
      rationale_required: "Explain why this project belongs in the catalog.",
      stage_required: "Select a commercialization stage.",
      image_url_invalid: "Image URL must be a valid https:// URL.",
      target_id_required: "Select the project ID to update.",
      target_name_required: "Select the dataset to update.",
      changes_required: "Enter at least one field to change.",
    },
  },
};

export const CONTRIBUTE_PROJECT_UI: Record<
  Locale,
  {
    intro: string;
    stepScope: string;
    stepForm: string;
    stepReview: string;
    linkScope: string;
    linkGuide: string;
    linkRepo: string;
    hintUrls: string;
  }
> = {
  ja: {
    intro:
      "新しい UMI 型プロジェクトをカタログに載せる申告フォームです。送信内容は即公開されず、メンテナが一次情報を確認してから反映します。",
    stepScope: "スコープ（UMI 型ハンドヘルド／手部ウェアラブル）に該当するか確認",
    stepForm: "必須項目（名称・ID・商用化段階・URL 1 件以上・理由）を入力し、任意項目は分かる範囲で記入",
    stepReview: "JSON をダウンロードし、GitHub Issue に貼るか PR で候補ファイルを追加",
    linkScope: "スコープ",
    linkGuide: "追加ガイド",
    linkRepo: "リポジトリ",
    hintUrls: "以下 3 種のうち 1 件以上必須（https://）",
  },
  en: {
    intro:
      "Propose a new UMI-style project for the catalog. Submissions are reviewed before publication.",
    stepScope: "Confirm the project fits scope (handheld / hand-wearable UMI-style interfaces)",
    stepForm:
      "Fill required fields (name, ID, stage, at least one URL, rationale); add optional details when available",
    stepReview: "Download candidate JSON and attach it to a GitHub Issue or PR",
    linkScope: "Scope",
    linkGuide: "Add-device guide",
    linkRepo: "Repository",
    hintUrls: "At least one of the following (https://)",
  },
};

export const CONTRIBUTE_DATASET_UI: Record<
  Locale,
  {
    intro: string;
    stepScope: string;
    stepForm: string;
    stepReview: string;
    linkRepo: string;
    labelDatasetUrl: string;
    labelArxiv: string;
    labelProvider: string;
    labelType: string;
    labelTrajectories: string;
    labelEpisodes: string;
    labelHours: string;
    labelTasks: string;
    labelFormat: string;
    hintSources: string;
    after3: string;
    errors: Record<string, string>;
  }
> = {
  ja: {
    intro:
      "データセット横断ビューに載せるデータセットを申告するフォームです。送信内容は即公開されず、メンテナが確認してから反映します。",
    stepScope: "ロボット操作・UMI 型データ収集に関連する公開データセットか確認",
    stepForm: "必須項目を入力し、任意項目は分かる範囲で記入",
    stepReview: "JSON をダウンロードし、GitHub Issue に貼るか PR で候補ファイルを追加",
    linkRepo: "リポジトリ",
    labelDatasetUrl: "データセット URL（公式ページ・Hugging Face 等）",
    labelArxiv: "arXiv ID（例: 2403.12945）",
    labelProvider: "提供機関",
    labelType: "種別（例: real / manipulation）",
    labelTrajectories: "軌跡数",
    labelEpisodes: "エピソード数",
    labelHours: "収録時間",
    labelTasks: "タスク数",
    labelFormat: "データ形式",
    hintSources: "データセット URL・論文 URL・arXiv ID のいずれか 1 件以上",
    after3: "メンテナがレビュー後、umi_devices_data.json の datasets[] に反映",
    errors: {
      arxiv_invalid: "arXiv ID は YYYY.NNNNN 形式で入力してください（例: 2403.12945）。",
    },
  },
  en: {
    intro:
      "Propose a dataset for the cross-dataset table. Submissions are reviewed before publication.",
    stepScope: "Confirm the dataset is relevant to robot manipulation or UMI-style data collection",
    stepForm: "Fill required fields; add optional details when available",
    stepReview: "Download candidate JSON and attach it to a GitHub Issue or PR",
    linkRepo: "Repository",
    labelDatasetUrl: "Dataset URL (project page, Hugging Face, etc.)",
    labelArxiv: "arXiv ID (e.g. 2403.12945)",
    labelProvider: "Provider",
    labelType: "Type (e.g. real / manipulation)",
    labelTrajectories: "Trajectories",
    labelEpisodes: "Episodes",
    labelHours: "Hours",
    labelTasks: "Tasks",
    labelFormat: "Data format",
    hintSources: "At least one dataset URL, paper URL, or arXiv ID",
    after3: "Maintainers review and merge into umi_devices_data.json datasets[]",
    errors: {
      arxiv_invalid: "arXiv ID must look like YYYY.NNNNN (e.g. 2403.12945).",
    },
  },
};

export const CONTRIBUTE_CORRECT_PROJECT_UI: Record<
  Locale,
  {
    intro: string;
    stepSelect: string;
    stepEvidence: string;
    stepReview: string;
    linkGuide: string;
    linkRepo: string;
    labelTarget: string;
    hintUrls: string;
    after3: string;
  }
> = {
  ja: {
    intro:
      "既存プロジェクトの誤りや更新を申告するフォームです。根拠 URL と変更内容を添えてください。",
    stepSelect: "修正対象のプロジェクト ID を選択",
    stepEvidence: "変更を裏付ける一次情報 URL（1 件以上）と理由を入力",
    stepReview: "patch 候補 JSON をダウンロードし、Issue または PR で提出",
    linkGuide: "追加・訂正ガイド",
    linkRepo: "リポジトリ",
    labelTarget: "修正対象プロジェクト",
    hintUrls: "プロジェクトページ・GitHub・論文のいずれか 1 件以上（https://）",
    after3: "メンテナがレビュー後、umi_devices_data.json の products[] を更新",
  },
  en: {
    intro:
      "Request a correction to an existing catalog project. Include source URLs and only the fields that should change.",
    stepSelect: "Select the project ID to update",
    stepEvidence: "Add at least one verifying https URL and explain the change",
    stepReview: "Download the patch candidate JSON and submit via Issue or PR",
    linkGuide: "Add / correct guide",
    linkRepo: "Repository",
    labelTarget: "Project to update",
    hintUrls: "At least one project page, GitHub, or paper URL (https://)",
    after3: "Maintainers review and update umi_devices_data.json products[]",
  },
};

export const CONTRIBUTE_CORRECT_DATASET_UI: Record<
  Locale,
  {
    intro: string;
    stepSelect: string;
    stepEvidence: string;
    stepReview: string;
    linkRepo: string;
    labelTarget: string;
    labelNewName: string;
    after3: string;
  }
> = {
  ja: {
    intro:
      "既存データセットの誤りや更新を申告するフォームです。根拠 URL と変更内容を添えてください。",
    stepSelect: "修正対象のデータセットを選択",
    stepEvidence: "変更を裏付ける一次情報 URL（1 件以上）と理由を入力",
    stepReview: "patch 候補 JSON をダウンロードし、Issue または PR で提出",
    linkRepo: "リポジトリ",
    labelTarget: "修正対象データセット",
    labelNewName: "新しい名称（名称変更する場合）",
    after3: "メンテナがレビュー後、umi_devices_data.json の datasets[] を更新",
  },
  en: {
    intro:
      "Request a correction to an existing dataset row. Include source URLs and only the fields that should change.",
    stepSelect: "Select the dataset to update",
    stepEvidence: "Add at least one verifying URL or arXiv ID and explain the change",
    stepReview: "Download the patch candidate JSON and submit via Issue or PR",
    linkRepo: "Repository",
    labelTarget: "Dataset to update",
    labelNewName: "New name (if renaming)",
    after3: "Maintainers review and update umi_devices_data.json datasets[]",
  },
};
