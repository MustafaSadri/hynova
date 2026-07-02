export type Language = "en" | "ru";

const translations = {
  en: {
    // ── Language UI ────────────────────────────────────────────────────────────
    popup: {
      title: "Choose Your Language",
      subtitle: "Select your preferred language for the website",
      en: "English",
      ru: "Русский",
    },

    // ── Hero ───────────────────────────────────────────────────────────────────
    hero: {
      badge: "Next-Gen Metabolic Health",
      title: "The Science of\nA New You",
      subtitle: "UAE precision. Swiss expertise. American technology. Redefining global standards in metabolic health.",
      exploreBtn: "Explore Portfolio",
      contactBtn: "Contact Us",
    },

    // ── About ──────────────────────────────────────────────────────────────────
    about: {
      sectionLabel: "Who We Are",
      title: "UAE-Based Pharmaceutical Innovator",
      titleHighlight: "Redefining Global Standards",
      p1: "CYNOVA.LIFE is a UAE-based pharmaceutical leader that unites Swiss precision engineering with cutting-edge American technology to deliver next-generation metabolic health solutions.",
      p2: "Our objective is clear: to become one of the world's most trusted innovators in obesity medicine — setting the benchmark for efficacy, safety, and patient outcomes across the globe.",
      stats: [
        { value: "UAE", label: "Headquarters & Strategic Hub" },
        { value: "3+", label: "Premium Products Available" },
        { value: "99.9%", label: "Purity Guarantee Per Batch" },
        { value: "GMP", label: "Certified Manufacturing" },
      ],
    },

    // ── Portfolio ──────────────────────────────────────────────────────────────
    portfolio: {
      sectionTitle: "Our Product Portfolio",
      subtitle: "Next-generation metabolic health therapies — precision-engineered for maximum efficacy, safety, and patient compliance.",
      viewSpecs: "View Specifications",
      backToOverview: "Back to Overview",
      specsLabel: "Specifications",
      products: [
        {
          name: "Retatrutide Injection",
          category: "Triple Receptor Agonist · Injectable",
          description: "The world's most powerful triple-agonist peptide targeting GLP-1, GIP, and Glucagon receptors simultaneously for superior metabolic regulation.",
          specs: [
            "Mechanism: Triple Receptor Agonist (GLP-1 / GIP / GCG)",
            "Available strengths: 8 mg, 16 mg, 24 mg, 40 mg",
            "Format: Pre-filled injection pen — once weekly subcutaneous",
            "Proven up to 24% body weight reduction in clinical trials",
            "Strongest efficacy in class with direct fat-burning pathways",
            "GMP-certified, cold-chain maintained, batch-tested ≥ 99.9% purity",
          ],
        },
        {
          name: "Retatrutide Powder",
          category: "Triple Receptor Agonist · Lyophilized",
          description: "High-purity lyophilized Retatrutide formulation for extended stability — ideal for research facilities and clinical applications.",
          specs: [
            "Mechanism: Triple Receptor Agonist (GLP-1 / GIP / GCG)",
            "Available strengths: 8 mg, 16 mg, 24 mg, 40 mg",
            "Format: Lyophilized powder — reconstituted before use",
            "Verified ≥ 99.9% purity via HPLC certificate of analysis",
            "Freeze-dried to maintain peak stability and long shelf life",
            "Zero additives, stabilizers, or fillers — pharmaceutical grade",
          ],
        },
        {
          name: "Tirzepatide Injection",
          category: "Dual Receptor Agonist · Injectable",
          description: "Dual-targeted GLP-1 and GIP receptor agonist delivering clinically validated glycemic control and significant weight reduction.",
          specs: [
            "Mechanism: Dual Receptor Agonist (GLP-1 / GIP)",
            "Available strengths: 2.5, 5, 7.5, 10, 12.5, 15 mg",
            "Format: Pre-filled injection pen — once weekly subcutaneous",
            "Slows gastric emptying for prolonged satiety and appetite control",
            "Robust glycemic control and metabolic regulation in T2DM",
            "Highly documented safety profile across global clinical studies",
          ],
        },
        {
          name: "Tirzepatide Powder",
          category: "Dual Receptor Agonist · Lyophilized",
          description: "Premium-grade lyophilized Tirzepatide with guaranteed 99.9% purity — the clinical research standard.",
          specs: [
            "Mechanism: Dual Receptor Agonist (GLP-1 / GIP)",
            "Available strengths: 2.5, 5, 7.5, 10, 12.5, 15 mg",
            "Format: Lyophilized powder — reconstituted before use",
            "Guaranteed ≥ 99.9% purity with detailed HPLC certificate",
            "Freeze-dried format for maximum long-term shelf life",
            "Ideal for clinical labs requiring exact compound concentrations",
          ],
        },
        {
          name: "Orforglipron Tablets",
          category: "Oral GLP-1 Receptor Agonist · Non-peptide",
          description: "Next-generation oral non-peptide GLP-1 receptor agonist — effective metabolic therapy without injections.",
          specs: [
            "Mechanism: Oral GLP-1 Receptor Agonist (non-peptide)",
            "Available strengths: 0.8, 2.5, 5.5, 9, 14.5, 17.2 mg",
            "Format: Daily oral tablet — 30 pills per bottle",
            "No needles — simple once-daily tablet administration",
            "Directly stimulates GLP-1 receptors for appetite regulation",
            "Room-temperature stable — easy to store and travel with",
          ],
        },
      ],
    },

    // ── Innovation / Manufacturing Excellence ───────────────────────────────────
    innovation: {
      sectionLabel: "Manufacturing Excellence",
      title: "Built on Precision,",
      titleHighlight: "Delivered with Integrity",
      steps: [
        {
          title: "GMP-Certified Manufacturing",
          desc: "Every CYNOVA product is manufactured in GMP-certified facilities, adhering to the strictest international pharmaceutical standards across all production stages.",
        },
        {
          title: "Cold Chain Integrity",
          desc: "Our dedicated cold-chain logistics ensure temperature-sensitive peptides maintain full potency and stability from production through final delivery.",
        },
        {
          title: "Multi-Stage Quality Assurance",
          desc: "Each batch undergoes comprehensive HPLC analysis, sterility testing, and independent third-party verification to guarantee ≥ 99.9% purity.",
        },
        {
          title: "Scalable Production Capacity",
          desc: "Our infrastructure is engineered for global-scale output, ensuring consistent availability and rapid response to growing international demand.",
        },
      ],
    },

    // ── Why CYNOVA ─────────────────────────────────────────────────────────────
    features: {
      sectionLabel: "Why Choose CYNOVA",
      sectionTitle: "The CYNOVA Advantage",
      items: [
        { title: "UAE Strategic Hub", description: "Headquartered in the UAE — at the crossroads of global trade routes, providing unparalleled access to international markets." },
        { title: "Swiss Expertise", description: "Precision engineering and pharmaceutical heritage from Swiss manufacturing standards applied to every product we produce." },
        { title: "American Technology", description: "Cutting-edge US biotechnology integration — from advanced synthesis to state-of-the-art quality control systems." },
        { title: "GMP Quality Standards", description: "Full adherence to international Good Manufacturing Practice standards, ensuring product safety and regulatory compliance." },
        { title: "Premium Patient Experience", description: "Modern pharmaceutical design focused on patient convenience, compliance, and optimal therapeutic outcomes." },
        { title: "Global Partnerships", description: "An expansive and growing network of international medical partners, distributors, and research institutions." },
      ],
    },

    // ── Global Footprint ───────────────────────────────────────────────────────
    globalFootprint: {
      sectionLabel: "Global Expansion",
      title: "A Vision Without",
      titleHighlight: "Borders",
      subtitle: "CYNOVA is executing a structured three-phase global expansion strategy, delivering trusted metabolic health solutions to patients worldwide.",
      phases: [
        {
          phase: "Phase 1",
          status: "Active Now",
          title: "Middle East & CIS",
          description: "Establishing our presence in the UAE and expanding across the Middle East, Russia, and the CIS region with premium metabolic therapies.",
          regions: ["United Arab Emirates", "Saudi Arabia", "Russia", "Kazakhstan", "Azerbaijan"],
        },
        {
          phase: "Phase 2",
          status: "Coming Soon",
          title: "Europe & Asia",
          description: "Strategic market entry into European and Asian markets, partnering with established medical distributors and clinical networks.",
          regions: ["Germany", "France", "Turkey", "India", "Singapore"],
        },
        {
          phase: "Phase 3",
          status: "2026+",
          title: "Global Network",
          description: "Comprehensive worldwide distribution infrastructure — delivering CYNOVA solutions to patients across every inhabited continent.",
          regions: ["Americas", "Africa", "Oceania", "Southeast Asia", "Rest of World"],
        },
      ],
    },

    // ── Contact ────────────────────────────────────────────────────────────────
    contact: {
      sectionLabel: "Get In Touch",
      title: "Let's Advance Health",
      titleHighlight: "Together",
      subtitle: "Whether you are a medical professional, distributor, or institutional partner — our team is ready to support you with dedicated expertise.",
      emailLabel: "Email",
      phoneLabel: "WhatsApp / Telegram",
      phoneValue: "+971 503702435",
      phoneHours: "Dubai, UAE — Global reach",
      addressLabel: "Headquarters",
      addressValue: "Dubai, United Arab Emirates",
      instagramLabel: "Instagram",
      instagramValue: "@Cynova.life",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      company: "Company / Organization",
      message: "Message",
      firstNamePlaceholder: "John",
      lastNamePlaceholder: "Doe",
      emailPlaceholder: "john@company.com",
      companyPlaceholder: "Your Company",
      messagePlaceholder: "How can we help you?",
      submitBtn: "Send Message",
      validationError: "Please fill in all required fields with a valid email address.",
      submitSuccess: "Thank you! Your message has been sent. We will get back to you shortly.",
      submitError: "Failed to send message. Please try again or contact us directly.",
      submitting: "Sending...",
    },

    // ── Footer ─────────────────────────────────────────────────────────────────
    footer: {
      tagline: "UAE precision. Swiss expertise. American technology. Redefining the future of metabolic health.",
      quickLinks: "Quick Links",
      portfolioLabel: "Portfolio",
      legal: "Legal",
      links: ["About Us", "Manufacturing", "Quality Assurance", "Global Presence", "Careers"],
      legalLinks: ["Terms & Conditions", "Privacy Policy", "Cookie Policy", "Compliance"],
      disclaimer: "Information provided is for educational and professional purposes. Products are intended for qualified healthcare professionals.",
      disclaimerLabel: "Disclaimer:",
      allRights: "All rights reserved.",
      systemsOk: "All systems operational",
      verifyProduct: "Verify Product",
    },

    // ── Verify Page ────────────────────────────────────────────────────────────
    verify: {
      backLink: "Back to CYNOVA.LIFE",
      title: "Product Verification",
      subtitle: "Enter the authentication code from your product sticker or scan the QR code to confirm authenticity.",
      placeholder: "e.g. CYNOVA-RET-INJ-A1B2C3",
      validTitle: "Authentic Product ✓",
      validSubtitle: "This product is genuine and verified by CYNOVA.LIFE.",
      invalidTitle: "Code Not Found",
      invalidSubtitle: "This code does not match any product in our system. This product may not be authentic.",
      verifyAnother: "Verify another code",
      tryAgain: "Try again",
      productLabel: "Product",
      categoryLabel: "Category",
      batchLabel: "Batch No.",
      manufacturedLabel: "Manufactured",
      expiryLabel: "Expiry",
      poweredBy: "Powered by CYNOVA.LIFE Authentication System — For support contact",
      scanQrBtn: "Scan QR Code",
      scanCameraTab: "Scan with Camera",
      scanUploadTab: "Upload Image",
      cameraStarting: "Starting camera feed...",
      cameraError: "Camera access failed. Please ensure permissions are granted.",
      cameraClose: "Close Scanner",
      uploadPlaceholder: "Drag & drop QR code image, or click to upload",
      uploadScanning: "Scanning uploaded file...",
      uploadSuccess: "QR code detected successfully!",
      uploadFailed: "No valid QR code found. Please ensure the code is clear.",
    },
    // New PDF translations
    visionMission: {
      visionTitle: "Our Vision",
      visionText: "To become one of the world's most trusted pharmaceutical innovators in metabolic health, setting the benchmark for efficacy and safety.",
      missionTitle: "Our Mission",
      missionItems: [
        { title: "Scientific Innovation", desc: "Pushing the boundaries of metabolic medicine with cutting-edge research." },
        { title: "Premium Quality Standards", desc: "Rigorous quality controls and GMP certified production." },
        { title: "Global Manufacturing Excellence", desc: "Advanced facilities designed for scale and temperature-sensitive integrity." },
        { title: "Patient-Centric Approach", desc: "Delivering therapies optimized for compliance and premium patient experiences." }
      ]
    },
    therapeuticFocus: {
      sectionLabel: "Therapeutic Focus",
      title: "Targeting Core Metabolic Diseases",
      subtitle: "Our scientific research and product formulations address the most pressing global health challenges of our time.",
      items: [
        { title: "Metabolic Health", desc: "Supporting overall physiological pathways and cellular health." },
        { title: "Weight Management", desc: "Precision therapeutic intervention for sustained weight regulation." },
        { title: "Obesity", desc: "Setting new standards in obesity medicine through advanced triple receptor agonists." },
        { title: "Type 2 Diabetes", desc: "Validated glycemic control therapies optimizing pancreatic function." },
        { title: "Cardiometabolic", desc: "Addressing complex heart and metabolic syndromes collectively." }
      ]
    },
    comparisonTable: {
      title: "Product Comparison",
      subtitle: "Evaluate mechanisms, administration methods, and patient profile targets across our formulations.",
      headers: {
        feature: "Feature",
        mechanism: "Mechanism",
        administration: "Administration",
        target: "Primary Target",
        profile: "Patient Profile"
      },
      rows: [
        {
          name: "Retatrutide",
          mechanism: "Triple Agonist (GLP-1 / GIP / GCG)",
          administration: "Weekly Injection",
          target: "Maximum Weight Reduction",
          profile: "Treatment Resistant Cases"
        },
        {
          name: "Tirzepatide",
          mechanism: "Dual Agonist (GLP-1 / GIP)",
          administration: "Weekly Injection",
          target: "Obesity & T2D Control",
          profile: "Mainline Clinical Patients"
        },
        {
          name: "Orforglipron",
          mechanism: "Oral Agonist (GLP-1)",
          administration: "Daily Tablet",
          target: "Convenient Weight Mgmt",
          profile: "Preference for Oral Therapy"
        }
      ]
    },
    roadmap: {
      title: "Product Pipeline & Roadmap",
      subtitle: "Our development roadmap outlines our transition from flagship metabolic therapies to cardiovascular development.",
      steps: [
        { num: "01", name: "Retatrutide", status: "Current Flagship", desc: "Triple-receptor agonist actively leading weight-regulation outcomes." },
        { num: "02", name: "Tirzepatide", status: "In Market", desc: "Dual GLP-1/GIP agonist with extensive clinical validation and distribution." },
        { num: "03", name: "Orforglipron", status: "Rollout Phase", desc: "High-compliance daily tablet making obesity treatment injection-free." },
        { num: "04", name: "Cardio Portfolio", status: "2026 Development", desc: "Broadening therapeutic reach into cardiovascular and lipid health." }
      ]
    },
  },

  ru: {
    // ── Language UI ────────────────────────────────────────────────────────────
    popup: {
      title: "Выберите язык",
      subtitle: "Выберите предпочитаемый язык сайта",
      en: "English",
      ru: "Русский",
    },

    // ── Hero ───────────────────────────────────────────────────────────────────
    hero: {
      badge: "Метаболическое здоровье нового поколения",
      title: "Наука о\nНовом Тебе",
      subtitle: "Точность ОАЭ. Швейцарская экспертиза. Американские технологии. Переопределяем мировые стандарты здоровья.",
      exploreBtn: "Изучить портфолио",
      contactBtn: "Связаться",
    },

    // ── About ──────────────────────────────────────────────────────────────────
    about: {
      sectionLabel: "Кто мы",
      title: "Фармацевтический инноватор из ОАЭ",
      titleHighlight: "Переопределяем мировые стандарты",
      p1: "CYNOVA.LIFE — фармацевтический лидер из ОАЭ, объединяющий швейцарскую точность и передовые американские технологии для создания метаболических решений нового поколения.",
      p2: "Наша цель ясна: стать одним из самых надёжных фармацевтических инноваторов в области ожирения в мире — устанавливая эталон эффективности, безопасности и результатов для пациентов.",
      stats: [
        { value: "ОАЭ", label: "Штаб-квартира и стратегический хаб" },
        { value: "3+", label: "Премиальных продукта доступно" },
        { value: "99.9%", label: "Гарантия чистоты каждой партии" },
        { value: "GMP", label: "Сертифицированное производство" },
      ],
    },

    // ── Portfolio ──────────────────────────────────────────────────────────────
    portfolio: {
      sectionTitle: "Наш продуктовый портфолио",
      subtitle: "Терапии метаболического здоровья нового поколения — точно разработанные для максимальной эффективности, безопасности и удобства пациентов.",
      viewSpecs: "Характеристики",
      backToOverview: "Назад",
      specsLabel: "Характеристики",
      products: [
        {
          name: "Retatrutide Injection",
          category: "Тройной агонист рецепторов · Инъекционный",
          description: "Самый мощный в мире тройной агонистический пептид, одновременно воздействующий на рецепторы GLP-1, GIP и глюкагона.",
          specs: [
            "Механизм: Тройной агонист (GLP-1 / GIP / GCG)",
            "Доступные дозировки: 8 мг, 16 мг, 24 мг, 40 мг",
            "Форма: Предзаполненная ручка — подкожно раз в неделю",
            "Доказано снижение веса до 24% в клинических исследованиях",
            "Наивысшая эффективность в классе с прямыми путями жиросжигания",
            "GMP-сертифицирован, чистота ≥ 99,9% в каждой партии",
          ],
        },
        {
          name: "Retatrutide Powder",
          category: "Тройной агонист рецепторов · Лиофилизированный",
          description: "Высокочистый лиофилизированный ретатрутид для клинических применений и исследовательских объектов.",
          specs: [
            "Механизм: Тройной агонист (GLP-1 / GIP / GCG)",
            "Доступные дозировки: 8 мг, 16 мг, 24 мг, 40 мг",
            "Форма: Лиофилизированный порошок — разводится перед использованием",
            "Подтверждённая чистота ≥ 99,9% по ВЭЖХ-сертификату",
            "Сублимационная сушка для максимальной стабильности и срока хранения",
            "Без добавок, стабилизаторов и наполнителей — фармацевтическое качество",
          ],
        },
        {
          name: "Tirzepatide Injection",
          category: "Двойной агонист рецепторов · Инъекционный",
          description: "Двойной агонист рецепторов GLP-1 и GIP, обеспечивающий клинически подтверждённый гликемический контроль и снижение веса.",
          specs: [
            "Механизм: Двойной агонист (GLP-1 / GIP)",
            "Доступные дозировки: 2,5; 5; 7,5; 10; 12,5; 15 мг",
            "Форма: Предзаполненная ручка — подкожно раз в неделю",
            "Замедляет опорожнение желудка для продлённого насыщения",
            "Надёжный гликемический контроль при сахарном диабете 2 типа",
            "Хорошо задокументированный профиль безопасности в мировых исследованиях",
          ],
        },
        {
          name: "Tirzepatide Powder",
          category: "Двойной агонист рецепторов · Лиофилизированный",
          description: "Тирзепатид премиального качества с гарантированной чистотой 99,9% — стандарт клинических исследований.",
          specs: [
            "Механизм: Двойной агонист (GLP-1 / GIP)",
            "Доступные дозировки: 2,5; 5; 7,5; 10; 12,5; 15 мг",
            "Форма: Лиофилизированный порошок — разводится перед использованием",
            "Гарантированная чистота ≥ 99,9% с подробным ВЭЖХ-сертификатом",
            "Формат сублимационной сушки для максимального срока хранения",
            "Идеален для клинических лабораторий с точными требованиями к концентрации",
          ],
        },
        {
          name: "Orforglipron Tablets",
          category: "Пероральный агонист GLP-1 · Непептид",
          description: "Пероральный непептидный агонист рецепторов GLP-1 нового поколения — эффективная метаболическая терапия без инъекций.",
          specs: [
            "Механизм: Пероральный агонист рецепторов GLP-1 (непептид)",
            "Доступные дозировки: 0,8; 2,5; 5,5; 9; 14,5; 17,2 мг",
            "Форма: Ежедневная пероральная таблетка — 30 таблеток в упаковке",
            "Без иглы — простое ежедневное применение в таблетированной форме",
            "Непосредственно стимулирует рецепторы GLP-1 для регуляции аппетита",
            "Стабилен при комнатной температуре — удобно хранить и брать с собой",
          ],
        },
      ],
    },

    // ── Innovation / Manufacturing Excellence ───────────────────────────────────
    innovation: {
      sectionLabel: "Производственное превосходство",
      title: "Построено на точности,",
      titleHighlight: "Доставляется с целостностью",
      steps: [
        {
          title: "GMP-сертифицированное производство",
          desc: "Каждый продукт CYNOVA производится на GMP-сертифицированных предприятиях, соответствующих строжайшим международным фармацевтическим стандартам.",
        },
        {
          title: "Целостность холодовой цепи",
          desc: "Наша специализированная логистика холодовой цепи обеспечивает сохранение полной активности и стабильности термочувствительных пептидов до конечной доставки.",
        },
        {
          title: "Многоэтапный контроль качества",
          desc: "Каждая партия проходит комплексный ВЭЖХ-анализ, испытания на стерильность и независимую стороннюю верификацию для гарантии чистоты ≥ 99,9%.",
        },
        {
          title: "Масштабируемые производственные мощности",
          desc: "Наша инфраструктура спроектирована для выпуска продукции в мировом масштабе, обеспечивая стабильную доступность и быстрое реагирование на растущий международный спрос.",
        },
      ],
    },

    // ── Why CYNOVA ─────────────────────────────────────────────────────────────
    features: {
      sectionLabel: "Почему выбирают CYNOVA",
      sectionTitle: "Преимущества CYNOVA",
      items: [
        { title: "Стратегический хаб в ОАЭ", description: "Штаб-квартира в ОАЭ — на перекрёстке мировых торговых путей, обеспечивающих непревзойдённый доступ к международным рынкам." },
        { title: "Швейцарская экспертиза", description: "Точная инженерия и фармацевтическое наследие швейцарских стандартов производства, применяемые в каждом нашем продукте." },
        { title: "Американские технологии", description: "Передовая интеграция американских биотехнологий — от передового синтеза до современных систем контроля качества." },
        { title: "Стандарты качества GMP", description: "Полное соответствие международным стандартам надлежащей производственной практики, обеспечивающее безопасность продукции и соответствие требованиям." },
        { title: "Первоклассный опыт для пациентов", description: "Современный фармацевтический дизайн, ориентированный на удобство пациентов, соблюдение режима лечения и оптимальные терапевтические результаты." },
        { title: "Глобальные партнёрства", description: "Обширная и растущая сеть международных медицинских партнёров, дистрибьюторов и исследовательских учреждений." },
      ],
    },

    // ── Global Footprint ───────────────────────────────────────────────────────
    globalFootprint: {
      sectionLabel: "Глобальная экспансия",
      title: "Видение без",
      titleHighlight: "Границ",
      subtitle: "CYNOVA реализует структурированную трёхэтапную стратегию глобального расширения, доставляя проверенные решения для метаболического здоровья пациентам по всему миру.",
      phases: [
        {
          phase: "Этап 1",
          status: "Активно сейчас",
          title: "Ближний Восток и СНГ",
          description: "Укрепление присутствия в ОАЭ и расширение на Ближнем Востоке, в России и странах СНГ с премиальными метаболическими терапиями.",
          regions: ["Объединённые Арабские Эмираты", "Саудовская Аравия", "Россия", "Казахстан", "Азербайджан"],
        },
        {
          phase: "Этап 2",
          status: "Скоро",
          title: "Европа и Азия",
          description: "Стратегический выход на европейские и азиатские рынки в партнёрстве с established медицинскими дистрибьюторами и клиническими сетями.",
          regions: ["Германия", "Франция", "Турция", "Индия", "Сингапур"],
        },
        {
          phase: "Этап 3",
          status: "2026+",
          title: "Глобальная сеть",
          description: "Комплексная всемирная дистрибьюторская инфраструктура — доставка решений CYNOVA пациентам на каждом обитаемом континенте.",
          regions: ["Америка", "Африка", "Океания", "Юго-Восточная Азия", "Остальной мир"],
        },
      ],
    },

    // ── Contact ────────────────────────────────────────────────────────────────
    contact: {
      sectionLabel: "Связаться",
      title: "Давайте развивать здоровье",
      titleHighlight: "вместе",
      subtitle: "Независимо от того, являетесь ли вы медицинским специалистом, дистрибьютором или институциональным партнёром — наша команда готова помочь вам.",
      emailLabel: "Email",
      phoneLabel: "WhatsApp / Telegram",
      phoneValue: "+971 503702435",
      phoneHours: "Дубай, ОАЭ — Глобальное присутствие",
      addressLabel: "Штаб-квартира",
      addressValue: "Дубай, Объединённые Арабские Эмираты",
      instagramLabel: "Instagram",
      instagramValue: "@Cynova.life",
      firstName: "Имя",
      lastName: "Фамилия",
      email: "Электронная почта",
      company: "Компания / Организация",
      message: "Сообщение",
      firstNamePlaceholder: "Иван",
      lastNamePlaceholder: "Иванов",
      emailPlaceholder: "ivan@company.com",
      companyPlaceholder: "Ваша компания",
      messagePlaceholder: "Чем мы можем вам помочь?",
      submitBtn: "Отправить сообщение",
      validationError: "Пожалуйста, заполните все обязательные поля корректным адресом электронной почты.",
      submitSuccess: "Спасибо! Ваше сообщение успешно отправлено. Мы ответим вам в ближайшее время.",
      submitError: "Не удалось отправить сообщение. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.",
      submitting: "Отправка...",
    },

    // ── Footer ─────────────────────────────────────────────────────────────────
    footer: {
      tagline: "Точность ОАЭ. Швейцарская экспертиза. Американские технологии. Переопределяем будущее метаболического здоровья.",
      quickLinks: "Быстрые ссылки",
      portfolioLabel: "Портфолио",
      legal: "Правовая информация",
      links: ["О нас", "Производство", "Контроль качества", "Глобальное присутствие", "Карьера"],
      legalLinks: ["Условия использования", "Политика конфиденциальности", "Политика cookies", "Соответствие требованиям"],
      disclaimer: "Информация предоставлена в образовательных и профессиональных целях. Продукты предназначены для квалифицированных медицинских специалистов.",
      disclaimerLabel: "Отказ от ответственности:",
      allRights: "Все права защищены.",
      systemsOk: "Все системы работают",
      verifyProduct: "Проверить продукт",
    },

    // ── Verify Page ────────────────────────────────────────────────────────────
    verify: {
      backLink: "Назад на CYNOVA.LIFE",
      title: "Проверка подлинности",
      subtitle: "Введите код аутентификации с наклейки на продукте или отсканируйте QR-код для подтверждения подлинности.",
      placeholder: "напр. CYNOVA-RET-INJ-A1B2C3",
      validTitle: "Подлинный продукт ✓",
      validSubtitle: "Этот продукт является подлинным и проверен CYNOVA.LIFE.",
      invalidTitle: "Код не найден",
      invalidSubtitle: "Этот код не совпадает ни с одним продуктом в нашей системе. Продукт может быть неподлинным.",
      verifyAnother: "Проверить другой код",
      tryAgain: "Попробовать снова",
      productLabel: "Продукт",
      categoryLabel: "Категория",
      batchLabel: "Номер партии",
      manufacturedLabel: "Дата производства",
      expiryLabel: "Срок годности",
      poweredBy: "Система аутентификации CYNOVA.LIFE — Для поддержки свяжитесь",
      scanQrBtn: "Сканировать QR-код",
      scanCameraTab: "Сканировать камерой",
      scanUploadTab: "Загрузить изображение",
      cameraStarting: "Запуск камеры...",
      cameraError: "Ошибка доступа к камере. Убедитесь, что разрешения предоставлены.",
      cameraClose: "Закрыть сканер",
      uploadPlaceholder: "Перетащите изображение QR-кода сюда или нажмите для выбора",
      uploadScanning: "Сканирование файла...",
      uploadSuccess: "QR-код успешно распознан!",
      uploadFailed: "Действительный QR-код не найден. Убедитесь, что изображение четкое.",
    },
    // New PDF translations in Russian
    visionMission: {
      visionTitle: "Наше видение",
      visionText: "Стать одним из самых надежных фармацевтических новаторов в мире в области метаболического здоровья, устанавливая стандарты эффективности и безопасности.",
      missionTitle: "Наша миссия",
      missionItems: [
        { title: "Научные инновации", desc: "Расширение границ метаболической медицины с помощью передовых исследований." },
        { title: "Премиальные стандарты качества", desc: "Строгий контроль качества и GMP-сертифицированное производство." },
        { title: "Мировое производственное превосходство", desc: "Передовые комплексы, спроектированные для масштабирования и поддержания температурной цепочки." },
        { title: "Ориентация на пациента", desc: "Предоставление терапии, оптимизированной для удобства пациентов и премиального опыта лечения." }
      ]
    },
    therapeuticFocus: {
      sectionLabel: "Терапевтический фокус",
      title: "Борьба с основными метаболическими заболеваниями",
      subtitle: "Наши научные исследования и рецептуры продуктов направлены на решение наиболее острых проблем глобального здравоохранения современности.",
      items: [
        { title: "Метаболическое здоровье", desc: "Поддержка общих физиологических процессов и клеточного здоровья." },
        { title: "Контроль веса", desc: "Точное терапевтическое вмешательство для долгосрочной регуляции массы тела." },
        { title: "Ожирение", desc: "Установление новых стандартов лечения ожирения с помощью передовых тройных агонистов." },
        { title: "Диабет 2 типа", desc: "Подтвержденная терапия гликемического контроля, оптимизирующая функцию поджелудочной железы." },
        { title: "Кардиометаболическое здоровье", desc: "Совместное решение сложных сердечных и метаболических синдромов." }
      ]
    },
    comparisonTable: {
      title: "Сравнение продуктов",
      subtitle: "Оцените механизмы действия, способы введения и целевые группы пациентов для наших препаратов.",
      headers: {
        feature: "Характеристика",
        mechanism: "Механизм действия",
        administration: "Способ введения",
        target: "Основная цель",
        profile: "Профиль пациента"
      },
      rows: [
        {
          name: "Retatrutide",
          mechanism: "Тройной агонист (GLP-1 / GIP / GCG)",
          administration: "Еженедельная инъекция",
          target: "Максимальное снижение веса",
          profile: "Случаи, устойчивые к лечению"
        },
        {
          name: "Tirzepatide",
          mechanism: "Двойной агонист (GLP-1 / GIP)",
          administration: "Еженедельная инъекция",
          target: "Контроль ожирения и СД2",
          profile: "Основные клинические пациенты"
        },
        {
          name: "Orforglipron",
          mechanism: "Пероральный агонист (GLP-1)",
          administration: "Ежедневная таблетка",
          target: "Удобный контроль веса",
          profile: "Предпочтение пероральной терапии"
        }
      ]
    },
    roadmap: {
      title: "Продуктовый пайплайн и дорожная карта",
      subtitle: "Наша дорожная карта описывает переход от флагманских метаболических терапий к разработкам в кардиологии.",
      steps: [
        { num: "01", name: "Retatrutide", status: "Текущий флагман", desc: "Тройной агонист рецепторов, активно лидирующий в результатах регуляции веса." },
        { num: "02", name: "Tirzepatide", status: "На рынке", desc: "Двойной агонист GLP-1/GIP с обширной клинической валидацией и дистрибуцией." },
        { num: "03", name: "Orforglipron", status: "Этап запуска", desc: "Пероральная таблетка для ежедневного приема, освобождающая от уколов при лечении ожирения." },
        { num: "04", name: "Кардио-портфолио", status: "Разработка 2026", desc: "Расширение терапевтического охвата в области здоровья сердечно-сосудистой системы и липидов." }
      ]
    },
  },
} as const;

export default translations;
