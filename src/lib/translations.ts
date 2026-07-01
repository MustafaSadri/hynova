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
      badge: "CYNOVA.LIFE",
      title: "Advancing the Future of Metabolic Health",
      subtitle: "Premium peptide and metabolic health solutions for the next generation.",
      exploreBtn: "Explore Portfolio",
      contactBtn: "Contact Us",
    },

    // ── About ──────────────────────────────────────────────────────────────────
    about: {
      sectionLabel: "Who We Are",
      title: "Pioneering the Next Era of",
      titleHighlight: "Metabolic Innovation",
      p1: "At CYNOVA.LIFE, we are dedicated to pushing the boundaries of scientific discovery. Our state-of-the-art facilities and world-class researchers focus exclusively on creating premium weight-management and metabolic health solutions.",
      p2: "We believe that quality is not an option, but a necessity. By leveraging advanced biosynthesis and meticulous purification processes, we deliver products that set the global standard for efficacy and safety.",
      stats: [
        { value: "10+", label: "Years of Research" },
        { value: "50+", label: "Countries Reached" },
        { value: "99.9%", label: "Purity Guarantee" },
        { value: "3x", label: "Faster Absorption" },
      ],
    },

    // ── Portfolio ──────────────────────────────────────────────────────────────
    portfolio: {
      sectionTitle: "Our Portfolio",
      subtitle: "A curated selection of the world's most advanced metabolic and weight-management solutions, engineered for uncompromising excellence.",
      viewSpecs: "View Specifications",
      backToOverview: "Back to Overview",
      specsLabel: "Specifications",
      products: [
        {
          name: "Retatrutide Injection",
          category: "Injectable Peptide",
          description: "Advanced triple-agonist therapy for optimal metabolic regulation and sustained weight management.",
          specs: [
            "Mimics GLP-1, GIP, and Glucagon to speed up metabolism.",
            "Proven in trials to support up to 24% weight reduction.",
            "Pre-filled injection pen for simple and precise dosing.",
            "Strongest efficacy in its class with direct fat-burning pathways.",
            "Designed for long-term health and metabolic balance.",
          ],
        },
        {
          name: "Retatrutide Powder",
          category: "Lyophilized Peptide",
          description: "High-purity lyophilized formulation designed for extended stability and research applications.",
          specs: [
            "Verified at ≥ 99.9% purity via laboratory HPLC analysis.",
            "Lyophilized (freeze-dried) to maintain peak stability.",
            "Ideal for scientific research, assays, and stability studies.",
            "Reconstitutes quickly and cleanly with bacteriostatic water.",
            "Contains zero additives, stabilizers, or bulk fillers.",
          ],
        },
        {
          name: "Tirzepatide Injection",
          category: "Injectable Peptide",
          description: "Dual-targeted GIP and GLP-1 receptor agonist revolutionizing glycemic control.",
          specs: [
            "Mimics GIP and GLP-1 hormones to signal natural fullness.",
            "Slows digestion to prolong satiety and control appetite.",
            "Supports robust glycemic control and metabolic regulation.",
            "Delivered via a convenient once-weekly subcutaneous injection.",
            "Highly documented safety profile in global clinical research.",
          ],
        },
        {
          name: "Tirzepatide Powder",
          category: "Lyophilized Peptide",
          description: "Premium grade lyophilized dual-agonist with guaranteed 99.9% purity standards.",
          specs: [
            "Guaranteed ≥ 99.9% purity with detailed HPLC certificate.",
            "Freeze-dried format optimized for maximum long-term shelf life.",
            "Perfect for clinical labs requiring exact compound concentration.",
            "Highly soluble in standard laboratory reconstitution media.",
            "Synthesized under strict quality-controlled conditions.",
          ],
        },
        {
          name: "Orforglipron Tablets",
          category: "Oral Non-peptide",
          description: "Next-generation oral GLP-1 receptor agonist for convenient, daily metabolic support.",
          specs: [
            "Simple, daily oral tablet format (no needles required).",
            "Directly stimulates GLP-1 receptors to regulate appetite.",
            "Provides premium metabolic support with tablet convenience.",
            "Easy to store and travel with at standard room temperature.",
            "Excellent alternative for needle-sensitive weight management.",
          ],
        },
      ],
    },

    // ── Innovation ─────────────────────────────────────────────────────────────
    innovation: {
      sectionLabel: "Innovation & Science",
      title: "Molecular Precision for",
      titleHighlight: "Transformative Health",
      steps: [
        {
          title: "Receptor Agonism",
          desc: "Our peptides are engineered to precisely target GLP-1, GIP, and Glucagon receptors, unlocking synergistic pathways for metabolic regulation.",
        },
        {
          title: "Advanced Delivery Systems",
          desc: "From highly stable lyophilized powders to next-generation oral formulations, we ensure maximum bioavailability and patient compliance.",
        },
        {
          title: "Uncompromising Synthesis",
          desc: "Utilizing solid-phase peptide synthesis (SPPS) and rigorous HPLC purification, we guarantee >99.9% purity in every batch.",
        },
      ],
    },

    // ── Features ───────────────────────────────────────────────────────────────
    features: {
      sectionLabel: "Why Choose Us",
      sectionTitle: "The CYNOVA Advantage",
      items: [
        { title: "Premium Quality", description: "Rigorous multi-stage quality control ensuring absolute purity and consistency." },
        { title: "Scientific Innovation", description: "Relentless R&D driving the next generation of metabolic therapies." },
        { title: "Reliable Supply", description: "Robust global supply chain engineered for uninterrupted availability." },
        { title: "Global Vision", description: "Expanding our reach to deliver metabolic health solutions worldwide." },
        { title: "Professional Partnerships", description: "Collaborating with leading researchers and institutions globally." },
      ],
    },

    // ── Contact ────────────────────────────────────────────────────────────────
    contact: {
      sectionLabel: "Get In Touch",
      title: "Let's Advance Health",
      titleHighlight: "Together",
      subtitle: "Whether you are a researcher, distributor, or seeking professional partnership, our dedicated team is ready to assist you with premium support.",
      emailLabel: "Email Us",
      phoneLabel: "Call Us",
      phoneValue: "Global: +1 (800) 123-4567",
      phoneHours: "Mon-Fri, 9am - 6pm EST",
      addressLabel: "Headquarters",
      addressValue: "Moscow, Russia",
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
    },

    // ── Footer ─────────────────────────────────────────────────────────────────
    footer: {
      tagline: "Advancing the future of metabolic health through uncompromising scientific innovation and premium quality peptides.",
      quickLinks: "Quick Links",
      portfolioLabel: "Portfolio",
      legal: "Legal",
      links: ["About Us", "Innovation & Science", "Quality Assurance", "Global Presence", "Careers"],
      legalLinks: ["Terms & Conditions", "Privacy Policy", "Cookie Policy", "Compliance"],
      disclaimer: "Information provided is for educational purposes. Products are intended for qualified professionals.",
      disclaimerLabel: "Disclaimer:",
      allRights: "All rights reserved.",
      systemsOk: "All systems operational",
      verifyProduct: "Verify Product",
    },

    // ── Verify Page ────────────────────────────────────────────────────────────
    verify: {
      backLink: "Back to CYNOVA.LIFE",
      title: "Product Verification",
      subtitle: "Enter the code from your product sticker or scan the QR code to confirm authenticity.",
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
      badge: "CYNOVA.LIFE",
      title: "Развивая будущее метаболического здоровья",
      subtitle: "Премиальные пептидные и метаболические решения для нового поколения.",
      exploreBtn: "Изучить портфолио",
      contactBtn: "Связаться",
    },

    // ── About ──────────────────────────────────────────────────────────────────
    about: {
      sectionLabel: "Кто мы",
      title: "Прокладывая путь к новой эре",
      titleHighlight: "Метаболических инноваций",
      p1: "В CYNOVA.LIFE мы стремимся раздвигать границы научных открытий. Наши передовые объекты и исследователи мирового класса сосредоточены исключительно на создании премиальных решений для управления весом и метаболического здоровья.",
      p2: "Мы считаем, что качество — это не опция, а необходимость. Используя передовой биосинтез и тщательные процессы очистки, мы поставляем продукты, устанавливающие мировой стандарт эффективности и безопасности.",
      stats: [
        { value: "10+", label: "Лет исследований" },
        { value: "50+", label: "Охваченных стран" },
        { value: "99.9%", label: "Гарантия чистоты" },
        { value: "3x", label: "Быстрее усвоение" },
      ],
    },

    // ── Portfolio ──────────────────────────────────────────────────────────────
    portfolio: {
      sectionTitle: "Наш портфолио",
      subtitle: "Тщательно отобранные передовые решения для метаболического здоровья и управления весом, созданные для бескомпромиссного совершенства.",
      viewSpecs: "Характеристики",
      backToOverview: "Назад",
      specsLabel: "Характеристики",
      products: [
        {
          name: "Retatrutide Injection",
          category: "Инъекционный пептид",
          description: "Передовая тройная агонистическая терапия для оптимальной метаболической регуляции и устойчивого управления весом.",
          specs: [
            "Имитирует GLP-1, GIP и глюкагон для ускорения метаболизма.",
            "Доказано в испытаниях: поддерживает снижение веса до 24%.",
            "Предзаполненная инъекционная ручка для простой и точной дозировки.",
            "Наивысшая эффективность в своём классе с прямыми путями сжигания жира.",
            "Разработан для долгосрочного здоровья и метаболического баланса.",
          ],
        },
        {
          name: "Retatrutide Powder",
          category: "Лиофилизированный пептид",
          description: "Высокочистый лиофилизированный препарат для расширенной стабильности и исследовательских применений.",
          specs: [
            "Проверено: ≥ 99,9% чистоты методом лабораторного ВЭЖХ-анализа.",
            "Лиофилизирован для сохранения максимальной стабильности.",
            "Идеален для научных исследований, анализов и испытаний стабильности.",
            "Быстро и чисто восстанавливается бактериостатической водой.",
            "Не содержит добавок, стабилизаторов или наполнителей.",
          ],
        },
        {
          name: "Tirzepatide Injection",
          category: "Инъекционный пептид",
          description: "Двойной агонист рецепторов GIP и GLP-1, революционизирующий гликемический контроль.",
          specs: [
            "Имитирует гормоны GIP и GLP-1 для сигнализации естественного насыщения.",
            "Замедляет пищеварение для продления сытости и контроля аппетита.",
            "Поддерживает надёжный гликемический контроль и метаболическую регуляцию.",
            "Вводится удобной подкожной инъекцией раз в неделю.",
            "Хорошо задокументированный профиль безопасности в мировых клинических исследованиях.",
          ],
        },
        {
          name: "Tirzepatide Powder",
          category: "Лиофилизированный пептид",
          description: "Премиальный лиофилизированный двойной агонист с гарантированной чистотой 99,9%.",
          specs: [
            "Гарантированная ≥ 99,9% чистота с подробным ВЭЖХ-сертификатом.",
            "Формат сублимационной сушки для максимального срока хранения.",
            "Идеален для клинических лабораторий, требующих точной концентрации соединения.",
            "Высокорастворим в стандартных лабораторных средах для восстановления.",
            "Синтезирован в строго контролируемых условиях качества.",
          ],
        },
        {
          name: "Orforglipron Tablets",
          category: "Пероральный непептид",
          description: "Пероральный агонист рецепторов GLP-1 нового поколения для удобной ежедневной метаболической поддержки.",
          specs: [
            "Простой формат ежедневной пероральной таблетки (без иглы).",
            "Непосредственно стимулирует рецепторы GLP-1 для регуляции аппетита.",
            "Обеспечивает премиальную метаболическую поддержку в форме таблетки.",
            "Легко хранить и брать в путешествие при комнатной температуре.",
            "Отличная альтернатива для людей, чувствительных к иглам.",
          ],
        },
      ],
    },

    // ── Innovation ─────────────────────────────────────────────────────────────
    innovation: {
      sectionLabel: "Инновации и наука",
      title: "Молекулярная точность для",
      titleHighlight: "Трансформирующего здоровья",
      steps: [
        {
          title: "Рецепторный агонизм",
          desc: "Наши пептиды разработаны для точного воздействия на рецепторы GLP-1, GIP и глюкагона, открывая синергетические пути метаболической регуляции.",
        },
        {
          title: "Передовые системы доставки",
          desc: "От высокостабильных лиофилизированных порошков до пероральных препаратов нового поколения — мы обеспечиваем максимальную биодоступность и комплаентность пациентов.",
        },
        {
          title: "Бескомпромиссный синтез",
          desc: "Используя твердофазный пептидный синтез (SPPS) и строгую ВЭЖХ-очистку, мы гарантируем чистоту >99,9% в каждой партии.",
        },
      ],
    },

    // ── Features ───────────────────────────────────────────────────────────────
    features: {
      sectionLabel: "Почему выбирают нас",
      sectionTitle: "Преимущества CYNOVA",
      items: [
        { title: "Премиальное качество", description: "Строгий многоэтапный контроль качества, обеспечивающий абсолютную чистоту и консистентность." },
        { title: "Научные инновации", description: "Неустанные исследования и разработки, движущие следующее поколение метаболических терапий." },
        { title: "Надёжные поставки", description: "Надёжная глобальная цепочка поставок, обеспечивающая бесперебойную доступность." },
        { title: "Глобальное видение", description: "Расширяем охват для доставки решений метаболического здоровья по всему миру." },
        { title: "Профессиональные партнёрства", description: "Сотрудничаем с ведущими исследователями и учреждениями по всему миру." },
      ],
    },

    // ── Contact ────────────────────────────────────────────────────────────────
    contact: {
      sectionLabel: "Связаться",
      title: "Давайте развивать здоровье",
      titleHighlight: "вместе",
      subtitle: "Независимо от того, являетесь ли вы исследователем, дистрибьютором или ищете профессиональное партнёрство, наша команда готова помочь вам.",
      emailLabel: "Напишите нам",
      phoneLabel: "Позвоните нам",
      phoneValue: "Глобально: +1 (800) 123-4567",
      phoneHours: "Пн-Пт, 9:00 - 18:00 EST",
      addressLabel: "Штаб-квартира",
      addressValue: "Москва, Россия",
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
    },

    // ── Footer ─────────────────────────────────────────────────────────────────
    footer: {
      tagline: "Развиваем будущее метаболического здоровья посредством бескомпромиссных научных инноваций и премиальных пептидов.",
      quickLinks: "Быстрые ссылки",
      portfolioLabel: "Портфолио",
      legal: "Правовая информация",
      links: ["О нас", "Инновации и наука", "Контроль качества", "Глобальное присутствие", "Карьера"],
      legalLinks: ["Условия использования", "Политика конфиденциальности", "Политика cookies", "Соответствие требованиям"],
      disclaimer: "Информация предоставлена в образовательных целях. Продукты предназначены для квалифицированных специалистов.",
      disclaimerLabel: "Отказ от ответственности:",
      allRights: "Все права защищены.",
      systemsOk: "Все системы работают",
      verifyProduct: "Проверить продукт",
    },

    // ── Verify Page ────────────────────────────────────────────────────────────
    verify: {
      backLink: "Назад на CYNOVA.LIFE",
      title: "Проверка продукта",
      subtitle: "Введите код с наклейки на продукте или отсканируйте QR-код для подтверждения подлинности.",
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
    },
  },
} as const;

export default translations;
