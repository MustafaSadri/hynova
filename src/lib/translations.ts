// English and Russian copy for the whole site. Russian strings are sourced
// from WEBSITE-CONTENT-RU.txt wherever that file covers the section; a few
// short UI-only strings (form placeholders, button micro-copy) have no
// counterpart in that file and were composed using only vocabulary already
// used elsewhere in it — see the project notes for exactly which.

export const translations = {
  en: {
    nav: {
      home: "Home",
      portfolio: "Portfolio",
      about: "About Us",
      quality: "Quality & Compliance",
      contact: "Contact",
    },
    hero: {
      tagline: "Pure · Proven · Precise",
      exploreButton: "Explore Portfolio",
      verifyButton: "Verify Product",
    },
    whyUs: {
      eyebrow: "Why Cynapept",
      headingPlain: "Precision Built on ",
      headingHighlight: "Global Standards.",
      items: [
        {
          title: "UAE Strategic Hub",
          body: "Headquartered at the crossroads of global trade and logistics.",
        },
        {
          title: "Swiss Expertise",
          body: "Precision engineering rooted in Swiss pharmaceutical heritage.",
        },
        {
          title: "GMP Quality Standards",
          body: "Every batch manufactured under strict international compliance.",
        },
        {
          title: "Scientific Innovation",
          body: "Advancing metabolic medicine through rigorous, ongoing research.",
        },
      ],
    },
    portfolio: {
      eyebrow: "Our Portfolio",
      headingPlain: "Discover ",
      headingHighlight: "What's Possible.",
      subtitle:
        "Four formulations, manufactured and verified to the same rigorous standard — across pens, vials, and oral tablets.",
      strengthsLabel: "Strengths",
      products: {
        retatrutidePen: {
          title: "Retatrutide",
          subtitle: "Injectable Pen",
          alt: "Retatrutide injectable pen packaging",
          category: "Triple Receptor Agonist · Injectable",
          description:
            "The world's most powerful triple-agonist peptide targeting GLP-1, GIP, and Glucagon receptors simultaneously for superior metabolic regulation.",
          highlights: [
            "Proven up to 24% body weight reduction in clinical trials",
            "Strongest efficacy in class with direct fat-burning pathways",
            "GMP-certified, cold-chain maintained, batch-tested ≥99.9% purity",
          ],
        },
        retatrutideVial: {
          title: "Retatrutide",
          subtitle: "Lyophilized Vial",
          alt: "Retatrutide lyophilized vial packaging",
          category: "Triple Receptor Agonist · Lyophilized",
          description:
            "High-purity lyophilized Retatrutide formulation for extended stability — ideal for research facilities and clinical applications.",
          highlights: [
            "Verified ≥99.9% purity via HPLC certificate of analysis",
            "Freeze-dried to maintain peak stability and long shelf life",
            "Zero additives, stabilizers, or fillers — pharmaceutical grade",
          ],
        },
        tirzepatidePen: {
          title: "Tirzepatide",
          subtitle: "Injectable Pen",
          alt: "Tirzepatide injectable pen packaging",
          category: "Dual Receptor Agonist · Injectable",
          description:
            "Dual-targeted GLP-1 and GIP receptor agonist delivering clinically validated glycemic control and significant weight reduction.",
          highlights: [
            "Slows gastric emptying for prolonged satiety and appetite control",
            "Robust glycemic control and metabolic regulation in T2DM",
            "Highly documented safety profile across global clinical studies",
          ],
        },
        orforglipron: {
          title: "Orforglipron",
          subtitle: "Oral Tablets",
          alt: "Orforglipron oral tablets packaging",
          category: "Oral GLP-1 Receptor Agonist · Non-peptide",
          description:
            "Next-generation oral non-peptide GLP-1 receptor agonist — effective metabolic therapy without injections.",
          highlights: [
            "No needles — simple once-daily tablet administration",
            "Directly stimulates GLP-1 receptors for appetite regulation",
            "Room-temperature stable — easy to store and travel with",
          ],
        },
      },
      strengths: {
        retatrutidePen: "10 · 20 · 40 mg",
        retatrutideVial: "10 · 20 · 40 · 60 mg",
        tirzepatidePen: "10 · 20 · 30 · 40 · 50 · 60 mg",
        orforglipron: "0.8 · 2.5 · 5.5 · 9 · 14.5 mg",
      },
    },
    comparison: {
      eyebrow: "Compare Formulations",
      title: "Product Comparison",
      subtitle:
        "Evaluate mechanisms, administration methods, and patient profile targets across our formulations.",
      headers: [
        "Feature",
        "Mechanism",
        "Administration",
        "Primary Target",
        "Patient Profile",
      ],
      rows: [
        {
          name: "Retatrutide",
          mechanism: "Triple Agonist (GLP-1 / GIP / GCG)",
          administration: "Weekly Injection",
          primaryTarget: "Maximum Weight Reduction",
          patientProfile: "Treatment Resistant Cases",
        },
        {
          name: "Tirzepatide",
          mechanism: "Dual Agonist (GLP-1 / GIP)",
          administration: "Weekly Injection",
          primaryTarget: "Obesity & T2D Control",
          patientProfile: "Mainline Clinical Patients",
        },
        {
          name: "Orforglipron",
          mechanism: "Oral Agonist (GLP-1)",
          administration: "Daily Tablet",
          primaryTarget: "Convenient Weight Mgmt",
          patientProfile: "Preference for Oral Therapy",
        },
      ],
    },
    contact: {
      headingPlain: "Get ",
      headingHighlight: "Product Updates",
      subtitle:
        "Leave your email and let us know what you're interested in, or send us a message with any questions — we'll get back to you.",
      emailPlaceholder: "you@example.com",
      emailLabel: "Email address",
      interestPlaceholder: "I'm interested in…",
      interestLabel: "I'm interested in",
      interests: [
        "General Updates",
        "Injectable Pens",
        "Lyophilized Vials",
        "Oral Tablets",
        "Partnership & Distribution",
      ],
      messagePlaceholder: "Your message (optional)",
      messageLabel: "Your message",
      submit: "Send",
      submitting: "Sending…",
      errorMessage:
        "Something went wrong sending your message. Please try again, or email us directly at info@cynapept.com.",
      confirmationPrefix: "Thank you — we'll keep",
      confirmationMiddle: "updated on",
    },
    footer: {
      tagline:
        "Precision peptide therapeutics, manufactured and verified to the same rigorous standard.",
      resourcesHeading: "Resources",
      companyHeading: "Company",
      verifyProduct: "Verify Product",
      helpCenter: "Help Center",
      contactSupport: "Contact Support",
      aboutUs: "About Us",
      qualityCompliance: "Quality & Compliance",
      rightsReserved: "All rights reserved",
    },
    rsvp: {
      eyebrow: "Cynapept Event Moscow",
      headingPlain: "You're Invited to ",
      headingHighlight: "Cynapept.",
      subtitle:
        "We're hosting a private event for our future business partners in Moscow. Register below and we'll confirm your spot.",
      eventName: "Cynapept Event Moscow",
      eventDateLabel: "Date & Time",
      eventDate: "[DATE & TIME — TBD]",
      eventVenueLabel: "Venue",
      eventVenue: "[VENUE NAME — TBD]",
      eventAddress: "[ADDRESS, Moscow — TBD]",
      nameLabel: "Full name",
      namePlaceholder: "Your full name",
      emailLabel: "Email address",
      emailPlaceholder: "you@example.com",
      phoneLabel: "Phone number",
      phonePlaceholder: "Phone number",
      countryCodeLabel: "Country code",
      guestCountLabel: "Number of guests (including you)",
      guestCountHelper:
        "Bringing anyone? Every additional guest needs a name and phone number.",
      additionalGuestsHeading: "Additional guest details",
      guestLabel: "Guest {n}",
      guestNamePlaceholder: "Guest's full name",
      guestPhonePlaceholder: "Guest's phone number",
      submit: "Register",
      submitting: "Registering…",
      registerOtpPrompt: "Enter the 6-digit code we sent to {email} to confirm your registration.",
      errorMessage:
        "Something went wrong submitting your registration. Please try again, or email us directly at info@cynapept.com.",
      alreadyRegisteredBlockedMessage:
        "This email is already registered. Use \"Already registered? Check your status\" below to view or update it.",
      confirmationTitle: "Thank you for registering",
      confirmationBody:
        "Any further communication about the event will be handled via support@cynapept.com.",
      confirmationReturnHome: "Return to Home",
      checkToggle: "Already registered? Check your status",
      checkEmailPrompt: "Enter the email you registered with",
      checkSendCode: "Send code",
      checkCancel: "Cancel",
      checkNotFound: "No registration found for that email.",
      checkOtpPrompt: "Enter the 6-digit code we emailed you",
      checkVerify: "Verify",
      checkResend: "Resend code",
      checkResendIn: "Resend code in {n}s",
      checkInvalidOtp: "That code is invalid or expired. Please try again.",
      checkError: "Something went wrong. Please try again.",
      checkGuestCountLabel: "Guests",
      checkStatusLabel: "Status",
      checkStatusRegistered: "Registered",
      checkStatusContacting: "Contacting",
      checkStatusConfirmed: "Confirmed",
      checkStatusCancelled: "Cancelled",
      checkEdit: "Edit registration",
      checkEditSaved: "Saved — your registration has been updated.",
      checkSave: "Save changes",
      checkCancelRegistration: "Cancel registration",
      checkCancelled: "Your registration has been cancelled.",
      checkClose: "Close",
    },
    eventPopup: {
      eyebrow: "Cynapept Event Moscow",
      title: "You're Invited",
      body: "We're hosting a private event for our future business partners in Moscow. Register your spot below.",
      cta: "Register Now",
      dismiss: "Maybe later",
      close: "Close",
      floatingCta: "Cynapept Event Moscow · Register",
    },
    verify: {
      headingPlain: "Verify Your ",
      headingHighlight: "Product.",
      subtitle:
        "Enter the batch code printed on your box, or scan / upload a photo of the label to confirm it's a genuine Cynapept product.",
      tabCode: "Enter Code",
      tabPhoto: "Scan or Upload",
      codeLabel: "Batch Code",
      codePlaceholder: "e.g. CYN-4F9K-QX7M-2WYT",
      codeHelper: "Found on the box, near the batch number.",
      scanPhoto: "Scan Photo",
      uploadPhoto: "Upload Photo",
      removePhoto: "Remove photo",
      photoHelper: "Include the label showing the batch code and QR code.",
      scanningHint: "Point your camera at the QR code on the label.",
      scanCancel: "Cancel scan",
      submit: "Verify Product",
      submitting: "Verifying…",
      autoVerifying: "Verifying your product…",
      resultAuthenticTitle: "Authentic Product",
      resultAuthenticBody:
        "This code matches a product registered in our authentication system.",
      resultAlreadyScannedTitle: "Code Already Scanned",
      resultAlreadyScannedBody:
        "This code is genuine, but it has already been verified before. If you're the first person to open this product, please contact our support team.",
      resultInvalidTitle: "Invalid Product",
      resultInvalidBody:
        "This code doesn't match any product in our authentication system. It may be counterfeit — please avoid using the product and contact our support team.",
      resultErrorTitle: "Verification unavailable",
      resultErrorBody:
        "We couldn't reach the verification service right now. Please try again in a moment, or contact support if this keeps happening.",
      resultDecodeErrorTitle: "No code found in that photo",
      resultDecodeErrorBody:
        "We couldn't read a QR code in that image. Try a clearer, well-lit photo of the label, or enter the code manually instead.",
      resultReset: "Verify another product",
      trust: [
        {
          title: "Unique per unit",
          body: "Every box ships with its own batch code, logged at manufacture.",
        },
        {
          title: "Cold-chain verified",
          body: "Storage and shipping conditions are tracked for every batch.",
        },
        {
          title: "Report a concern",
          body: "Think you've received a suspicious product? Let us know.",
        },
      ],
    },
    about: {
      eyebrow: "Who We Are",
      headingPlain: "UAE-Based Pharmaceutical Innovator, ",
      headingHighlight: "Redefining Global Standards.",
      paragraph1:
        "Cynapept is a UAE-based pharmaceutical leader that unites Swiss precision engineering with cutting-edge American technology to deliver next-generation metabolic health solutions.",
      paragraph2:
        "Our objective is clear: to become one of the world's most trusted innovators in obesity medicine — setting the benchmark for efficacy, safety, and patient outcomes across the globe.",
      stats: [
        { value: "UAE", label: "Headquarters & Strategic Hub" },
        { value: "3+", label: "Premium Products Available" },
        { value: "99.9%", label: "Purity Guarantee Per Batch" },
        { value: "GMP", label: "Certified Manufacturing" },
      ],
      visionHeading: "Our Vision",
      visionText:
        "To become one of the world's most trusted pharmaceutical innovators in metabolic health, setting the benchmark for efficacy and safety.",
      missionHeading: "Our Mission",
      mission: [
        {
          title: "Scientific Innovation",
          body: "Pushing the boundaries of metabolic medicine with cutting-edge research.",
        },
        {
          title: "Premium Quality Standards",
          body: "Rigorous quality controls and GMP certified production.",
        },
        {
          title: "Global Manufacturing Excellence",
          body: "Advanced facilities designed for scale and temperature-sensitive integrity.",
        },
        {
          title: "Patient-Centric Approach",
          body: "Delivering therapies optimized for compliance and premium patient experiences.",
        },
      ],
      advantagesEyebrow: "Why Choose Cynapept",
      advantagesHeading: "The Cynapept Advantage",
      advantages: [
        {
          title: "UAE Strategic Hub",
          body: "Headquartered in the UAE — at the crossroads of global trade routes, providing unparalleled access to international markets.",
        },
        {
          title: "Swiss Expertise",
          body: "Precision engineering and pharmaceutical heritage from Swiss manufacturing standards applied to every product we produce.",
        },
        {
          title: "American Technology",
          body: "Cutting-edge US research and development — from advanced synthesis to state-of-the-art quality control systems.",
        },
        {
          title: "GMP Quality Standards",
          body: "Full adherence to international Good Manufacturing Practice standards, ensuring product safety and regulatory compliance.",
        },
        {
          title: "Premium Approach",
          body: "Modern pharmaceutical design focused on patient convenience, compliance, and optimal therapeutic outcomes.",
        },
        {
          title: "Global Partnerships",
          body: "An expansive and growing network of international medical partners, distributors, and research institutions.",
        },
      ],
      locationNote:
        "Dubai, United Arab Emirates — expanding across the Middle East, Europe, and Asia.",
      learnMoreLabel: "Learn More About Us",
    },
    quality: {
      eyebrow: "Manufacturing Excellence",
      headingPlain: "Built on Precision, ",
      headingHighlight: "Delivered with Integrity.",
      subtitle:
        "Every formulation we ship is manufactured and verified to the same rigorous standard, from raw material to final delivery.",
      steps: [
        {
          title: "GMP-Certified Manufacturing",
          body: "Every Cynapept product is manufactured in GMP-certified facilities, adhering to the strictest international pharmaceutical standards across all production stages.",
        },
        {
          title: "Cold Chain Integrity",
          body: "Our dedicated cold-chain logistics ensure temperature-sensitive peptides maintain full potency and stability from production through final delivery.",
        },
        {
          title: "Multi-Stage Quality Assurance",
          body: "Each batch undergoes comprehensive HPLC analysis, sterility testing, and independent third-party verification to guarantee ≥99.9% purity.",
        },
        {
          title: "Scalable Production Capacity",
          body: "Our infrastructure is engineered for global-scale output, ensuring consistent availability and rapid response to growing international demand.",
        },
      ],
      ctaTitle: "Every batch is uniquely coded and verifiable.",
      ctaBody: "Confirm the authenticity of your product in seconds.",
      ctaButton: "Verify Product",
      exploreLabel: "Explore Quality & Compliance",
    },
    admin: {
      heading: "Event Registrations",
      registrationsSummary: "{count} registration(s) — {attendees} total attendee(s)",
      downloadCsv: "Download CSV",
      statTotal: "Total",
      statRegistered: "Registered",
      statContacting: "Contacting",
      statConfirmed: "Confirmed",
      statCancelled: "Cancelled",
      colName: "Name",
      colEmail: "Email",
      colPhone: "Phone",
      colGuests: "Guests",
      colStatus: "Status",
      colRegistered: "Registered",
      noRegistrations: "No registrations yet.",
      confirmDelete: "Confirm",
      cancelDelete: "Cancel",
      deleteAriaLabel: "Delete registration",
      eventDetailsHeading: "Event Details",
      eventDetailsSubtitle: "Shown on the public registration page and in the homepage popup.",
      eventNameLabel: "Event name",
      eventNamePlaceholder: "Cynapept Event Moscow",
      eventDateLabel: "Date & time",
      eventDatePlaceholder: "e.g. 12 December 2026, 7:00 PM",
      venueNameLabel: "Venue name",
      venueNamePlaceholder: "e.g. Ritz-Carlton Moscow",
      venueAddressLabel: "Venue address",
      venueAddressPlaceholder: "e.g. Tverskaya St 3, Moscow",
      venuePhotosLabel: "Venue photos ({count}/{max})",
      upload: "Upload",
      removePhotoAriaLabel: "Remove photo",
      photoTooMany: "Maximum {max} photos.",
      photoTooLarge: "\"{name}\" is too large — max {max}MB per photo.",
      saveEventDetails: "Save Event Details",
      saving: "Saving…",
      saved: "Saved.",
      saveFailed: "Failed to save — try again.",
    },
  },

  ru: {
    nav: {
      home: "Главная",
      portfolio: "Портфолио",
      about: "О нас",
      quality: "Контроль качества",
      contact: "Контакты",
    },
    hero: {
      // Kept as a stylized brand motto rather than translated — flagged
      // separately since it isn't sourced from the content file.
      tagline: "Pure · Proven · Precise",
      exploreButton: "Изучить портфолио",
      verifyButton: "Проверить продукт",
    },
    whyUs: {
      eyebrow: "Почему CYNAPEPT",
      headingPlain: "Точность на основе ",
      headingHighlight: "мировых стандартов.",
      items: [
        {
          title: "Штаб-квартира в ОАЭ",
          body: "Расположены на пересечении мировых торговых путей.",
        },
        {
          title: "Швейцарский опыт",
          body: "Точное инженерное решение и фармацевтическое наследие.",
        },
        {
          title: "Стандарты GMP",
          body: "Каждая партия производится в строгом соответствии GMP.",
        },
        {
          title: "Научные инновации",
          body: "Развитие метаболической медицины через передовые исследования.",
        },
      ],
    },
    portfolio: {
      eyebrow: "Портфолио",
      headingPlain: "Наш продуктовый ",
      headingHighlight: "портфолио",
      subtitle:
        "Терапии метаболического здоровья нового поколения — точно разработанные для максимальной эффективности, безопасности и удобства пациентов.",
      strengthsLabel: "Дозировки",
      products: {
        retatrutidePen: {
          title: "Ретатрутид",
          subtitle: "Инъекционная ручка",
          alt: "Упаковка инъекционной ручки Ретатрутид",
          category: "Тройной агонист рецепторов · Инъекционный",
          description:
            "Ретатрутид (Retatrutide) — пептидная терапия следующего поколения, представляющая собой тройной агонист для максимальной эффективности.",
          highlights: [
            "Доказано снижение веса до 24% в клинических исследованиях",
            "Наивысшая эффективность в классе с прямыми путями жиросжигания",
            "GMP-сертифицирован, чистота ≥99,9% в каждой партии",
          ],
        },
        retatrutideVial: {
          title: "Ретатрутид",
          subtitle: "Лиофилизированный флакон",
          alt: "Упаковка лиофилизированного флакона Ретатрутид",
          category: "Тройной агонист рецепторов · Лиофилизированный",
          description:
            "Ретатрутид (Retatrutide) — пептидная терапия следующего поколения, представляющая собой тройной агонист для максимальной эффективности.",
          highlights: [
            "Подтверждённая чистота ≥99,9% по ВЭЖХ-сертификату",
            "Сублимационная сушка для максимальной стабильности и срока хранения",
            "Без добавок, стабилизаторов и наполнителей — фармацевтическое качество",
          ],
        },
        tirzepatidePen: {
          title: "Тирзепатид",
          subtitle: "Инъекционная ручка",
          alt: "Упаковка инъекционной ручки Тирзепатид",
          category: "Двойной агонист рецепторов · Инъекционный",
          description:
            "Тирзепатид (Tirzepatide) — золотой стандарт терапии двойным агонистом для контроля метаболизма.",
          highlights: [
            "Замедляет опорожнение желудка для продлённого насыщения",
            "Надёжный гликемический контроль при сахарном диабете 2 типа",
            "Хорошо задокументированный профиль безопасности в мировых исследованиях",
          ],
        },
        orforglipron: {
          title: "Орфорглипрон",
          subtitle: "Пероральные таблетки",
          alt: "Упаковка пероральных таблеток Орфорглипрон",
          category: "Пероральный агонист GLP-1 · Непептид",
          description:
            "Орфорглипрон (Orforglipron) — инновационная пероральная непептидная терапия для удобства пациентов.",
          highlights: [
            "Без иглы — простое ежедневное применение в таблетированной форме",
            "Непосредственно стимулирует рецепторы GLP-1 для регуляции аппетита",
            "Стабилен при комнатной температуре — удобно хранить и брать с собой",
          ],
        },
      },
      strengths: {
        retatrutidePen: "10 · 20 · 40 мг",
        retatrutideVial: "10 · 20 · 40 · 60 мг",
        tirzepatidePen: "10 · 20 · 30 · 40 · 50 · 60 мг",
        orforglipron: "0,8 · 2,5 · 5,5 · 9 · 14,5 мг",
      },
    },
    comparison: {
      eyebrow: "Сравнение форм выпуска",
      title: "Сравнение продуктов",
      subtitle:
        "Оцените механизмы действия, способы введения и целевые группы пациентов для наших препаратов.",
      headers: [
        "Характеристика",
        "Механизм действия",
        "Способ применения",
        "Основная цель",
        "Профиль пациента",
      ],
      rows: [
        {
          name: "Ретатрутид",
          mechanism: "Тройной агонист (GLP-1/GIP/GCG)",
          administration: "Еженедельная инъекция",
          primaryTarget: "Максимальное снижение веса",
          patientProfile: "Случаи, устойчивые к лечению",
        },
        {
          name: "Тирзепатид",
          mechanism: "Двойной агонист (GLP1/GIP)",
          administration: "Еженедельная инъекция",
          primaryTarget: "Контроль ожирения и диабета 2 типа",
          patientProfile: "Основные клинические пациенты",
        },
        {
          name: "Орфорглипрон",
          mechanism: "Пероральный агонист (GLP-1)",
          administration: "Ежедневная таблетка",
          primaryTarget: "Удобное управление весом",
          patientProfile: "Пациенты, предпочитающие пероральную терапию",
        },
      ],
    },
    contact: {
      headingPlain: "Давайте развивать здоровье ",
      headingHighlight: "вместе",
      subtitle:
        "Независимо от того, являетесь ли вы медицинским специалистом, дистрибьютором или институциональным партнёром — наша команда готова помочь вам.",
      emailPlaceholder: "you@example.com",
      emailLabel: "Электронная почта",
      interestPlaceholder: "Меня интересует…",
      interestLabel: "Меня интересует",
      interests: [
        "Общие обновления",
        "Инъекционные ручки",
        "Лиофилизированные флаконы",
        "Пероральные таблетки",
        "Партнёрство и дистрибуция",
      ],
      messagePlaceholder: "Ваше сообщение (необязательно)",
      messageLabel: "Ваше сообщение",
      submit: "Отправить",
      submitting: "Отправка…",
      errorMessage:
        "Не удалось отправить сообщение. Попробуйте ещё раз или напишите нам напрямую на info@cynapept.com.",
      confirmationPrefix: "Спасибо — мы будем держать",
      confirmationMiddle: "в курсе по теме",
    },
    footer: {
      tagline:
        "Точность ОАЭ. Швейцарская экспертиза. Американские технологии. Переопределяем будущее метаболического здоровья.",
      resourcesHeading: "Ресурсы",
      companyHeading: "Компания",
      verifyProduct: "Проверить продукт",
      helpCenter: "Поддержка",
      contactSupport: "Связаться с нами",
      aboutUs: "О нас",
      qualityCompliance: "Контроль качества",
      rightsReserved: "Все права защищены",
    },
    rsvp: {
      eyebrow: "Cynapept Event Moscow",
      headingPlain: "Приглашение в ",
      headingHighlight: "Cynapept.",
      subtitle:
        "Мы проводим закрытое мероприятие в Москве для наших будущих деловых партнёров. Зарегистрируйтесь ниже, и мы подтвердим ваше участие.",
      eventName: "Cynapept Event Moscow",
      eventDateLabel: "Дата и время",
      eventDate: "[ДАТА И ВРЕМЯ — уточняется]",
      eventVenueLabel: "Место проведения",
      eventVenue: "[НАЗВАНИЕ ПЛОЩАДКИ — уточняется]",
      eventAddress: "[АДРЕС, Москва — уточняется]",
      nameLabel: "Полное имя",
      namePlaceholder: "Ваше полное имя",
      emailLabel: "Адрес электронной почты",
      emailPlaceholder: "you@example.com",
      phoneLabel: "Номер телефона",
      phonePlaceholder: "Номер телефона",
      countryCodeLabel: "Код страны",
      guestCountLabel: "Количество гостей (включая вас)",
      guestCountHelper:
        "Идёте не одни? Для каждого дополнительного гостя укажите имя и номер телефона.",
      additionalGuestsHeading: "Данные дополнительных гостей",
      guestLabel: "Гость {n}",
      guestNamePlaceholder: "Полное имя гостя",
      guestPhonePlaceholder: "Номер телефона гостя",
      submit: "Зарегистрироваться",
      submitting: "Регистрация…",
      registerOtpPrompt: "Введите 6-значный код, отправленный на {email}, чтобы подтвердить регистрацию.",
      errorMessage:
        "Что-то пошло не так при отправке регистрации. Попробуйте ещё раз или напишите нам напрямую на info@cynapept.com.",
      alreadyRegisteredBlockedMessage:
        "Этот email уже зарегистрирован. Используйте «Уже зарегистрированы? Проверьте статус» ниже, чтобы посмотреть или изменить данные.",
      confirmationTitle: "Спасибо за регистрацию",
      confirmationBody:
        "Все дальнейшие сообщения о мероприятии будут отправляться через support@cynapept.com.",
      confirmationReturnHome: "Вернуться на главную",
      checkToggle: "Уже зарегистрированы? Проверьте статус",
      checkEmailPrompt: "Введите email, указанный при регистрации",
      checkSendCode: "Отправить код",
      checkCancel: "Отмена",
      checkNotFound: "Регистрация с таким email не найдена.",
      checkOtpPrompt: "Введите 6-значный код, отправленный на вашу почту",
      checkVerify: "Проверить",
      checkResend: "Отправить код повторно",
      checkResendIn: "Повторная отправка через {n} с",
      checkInvalidOtp: "Код неверный или истёк. Попробуйте ещё раз.",
      checkError: "Что-то пошло не так. Попробуйте ещё раз.",
      checkGuestCountLabel: "Гостей",
      checkStatusLabel: "Статус",
      checkStatusRegistered: "Зарегистрирован",
      checkStatusContacting: "Связываемся",
      checkStatusConfirmed: "Подтверждён",
      checkStatusCancelled: "Отменена",
      checkEdit: "Изменить регистрацию",
      checkEditSaved: "Сохранено — ваша регистрация обновлена.",
      checkSave: "Сохранить изменения",
      checkCancelRegistration: "Отменить регистрацию",
      checkCancelled: "Ваша регистрация отменена.",
      checkClose: "Закрыть",
    },
    eventPopup: {
      eyebrow: "Cynapept Event Moscow",
      title: "Вы приглашены",
      body: "Мы проводим закрытое мероприятие в Москве для наших будущих деловых партнёров. Зарегистрируйтесь ниже.",
      cta: "Зарегистрироваться",
      dismiss: "Позже",
      close: "Закрыть",
      floatingCta: "Cynapept Event Moscow · Регистрация",
    },
    verify: {
      headingPlain: "Проверка ",
      headingHighlight: "подлинности.",
      subtitle:
        "Введите код аутентификации с наклейки на продукте или отсканируйте / загрузите фото QR-кода для подтверждения подлинности.",
      tabCode: "Ввести код",
      tabPhoto: "Сканировать или загрузить",
      codeLabel: "Номер партии",
      codePlaceholder: "напр. CYN-4F9K-QX7M-2WYT",
      codeHelper: "Указан на упаковке, рядом с номером партии.",
      scanPhoto: "Сканировать фото",
      uploadPhoto: "Загрузить фото",
      removePhoto: "Удалить фото",
      photoHelper: "Включите этикетку с номером партии и QR-кодом.",
      scanningHint: "Наведите камеру на QR-код на этикетке.",
      scanCancel: "Отменить сканирование",
      submit: "Проверить продукт",
      submitting: "Проверка…",
      autoVerifying: "Проверяем ваш продукт…",
      resultAuthenticTitle: "Подлинный продукт",
      resultAuthenticBody:
        "Этот код соответствует продукту, зарегистрированному в нашей системе аутентификации.",
      resultAlreadyScannedTitle: "Код уже проверялся",
      resultAlreadyScannedBody:
        "Этот код подлинный, но он уже был проверен ранее. Если вы первый, кто открыл этот продукт, свяжитесь с нашей службой поддержки.",
      resultInvalidTitle: "Недействительный продукт",
      resultInvalidBody:
        "Этот код не соответствует ни одному продукту в нашей системе аутентификации. Возможно, это подделка — не используйте продукт и свяжитесь с нашей службой поддержки.",
      resultErrorTitle: "Проверка временно недоступна",
      resultErrorBody:
        "Не удалось связаться со службой проверки. Попробуйте ещё раз через некоторое время или свяжитесь с поддержкой, если проблема повторяется.",
      resultDecodeErrorTitle: "На фото не найден код",
      resultDecodeErrorBody:
        "Не удалось распознать QR-код на этом изображении. Попробуйте сделать более чёткое, хорошо освещённое фото этикетки или введите код вручную.",
      resultReset: "Проверить ещё один продукт",
      trust: [
        {
          title: "Уникальный код на партию",
          body: "Каждая упаковка имеет собственный номер партии, зарегистрированный на производстве.",
        },
        {
          title: "Температурный контроль",
          body: "Условия хранения и доставки отслеживаются для каждой партии.",
        },
        {
          title: "Сообщить о проблеме",
          body: "Получили подозрительный продукт? Сообщите нам.",
        },
      ],
    },
    about: {
      eyebrow: "Кто мы",
      headingPlain: "Фармацевтический инноватор из ОАЭ, ",
      headingHighlight: "переопределяем мировые стандарты.",
      paragraph1:
        "CYNAPEPT — фармацевтический лидер с головным офисом в ОАЭ, специализирующийся на инновационных методах лечения метаболических нарушений и терапии контроля веса.",
      paragraph2:
        "Опираясь на швейцарский опыт и американские технологии, мы разрабатываем решения следующего поколения, сочетающие научный подход с высоким уровнем комфорта и удобства для пациента. Наша цель — переопределить мировые стандарты в лечении ожирения с помощью передовых пептидных и пероральных технологий.",
      stats: [
        { value: "ОАЭ", label: "Штаб-квартира и стратегический хаб" },
        { value: "3+", label: "Премиальных продукта доступно" },
        { value: "99,9%", label: "Гарантия чистоты каждой партии" },
        { value: "GMP", label: "Сертифицированное производство" },
      ],
      visionHeading: "Наше видение",
      visionText:
        "Стать одним из самых надежных инноваторов в области метаболического здоровья в мире, задавая стандарты эффективности и безопасности.",
      missionHeading: "Наша миссия",
      mission: [
        {
          title: "Научные инновации",
          body: "Расширение границ метаболической медицины с помощью передовых исследований.",
        },
        {
          title: "Высокое качество продукции",
          body: "Строгий контроль качества и GMP-сертифицированное производство.",
        },
        {
          title: "Производственное совершенство на глобальном уровне",
          body: "Передовые комплексы, спроектированные для масштабирования и поддержания температурной цепочки.",
        },
        {
          title: "Пациентоориентированный подход",
          body: "Предоставление терапии, оптимизированной для удобства пациентов и премиального опыта лечения.",
        },
      ],
      advantagesEyebrow: "Почему CYNAPEPT",
      advantagesHeading: "Преимущества CYNAPEPT",
      advantages: [
        {
          title: "Штаб-квартира в ОАЭ",
          body: "Стратегическое расположение в центре глобальной торговли и инноваций.",
        },
        {
          title: "Швейцарский опыт",
          body: "Точное инженерное решение и фармацевтическое наследие.",
        },
        {
          title: "Американские технологии",
          body: "Передовые научно-исследовательские разработки.",
        },
        {
          title: "Качество",
          body: "Соблюдение высочайших международных стандартов GMP.",
        },
        {
          title: "Премиальный подход",
          body: "Современный фармацевтический дизайн и ориентация на пациента.",
        },
        {
          title: "Партнерство",
          body: "Широкая сеть медицинских партнеров по всему миру.",
        },
      ],
      locationNote:
        "Дубай, Объединённые Арабские Эмираты — расширение на Ближнем Востоке, в Европе и Азии.",
      learnMoreLabel: "Узнать больше о нас",
    },
    quality: {
      eyebrow: "Производственное превосходство",
      headingPlain: "Построено на точности, ",
      headingHighlight: "доставляется с целостностью.",
      subtitle:
        "Каждая партия производится и проверяется по единому строгому стандарту — от сырья до финальной доставки.",
      steps: [
        {
          title: "GMP-производство",
          body: "Передовые производственные мощности с полной сертификацией.",
        },
        {
          title: "Соблюдение температурного режима",
          body: "Логистика с контролем температуры.",
        },
        {
          title: "Контроль качества",
          body: "Многоступенчатое тестирование и соответствие международным стандартам.",
        },
        {
          title: "Масштабируемое производство",
          body: "Удовлетворение растущего глобального спроса.",
        },
      ],
      ctaTitle: "Каждая партия имеет уникальный код и может быть проверена.",
      ctaBody: "Подтвердите подлинность продукта за несколько секунд.",
      ctaButton: "Проверить продукт",
      exploreLabel: "Изучить контроль качества",
    },
    admin: {
      heading: "Регистрации на мероприятие",
      registrationsSummary: "Регистраций: {count} — всего участников: {attendees}",
      downloadCsv: "Скачать CSV",
      statTotal: "Всего",
      statRegistered: "Зарегистрирован",
      statContacting: "Связываемся",
      statConfirmed: "Подтверждён",
      statCancelled: "Отменена",
      colName: "Имя",
      colEmail: "Email",
      colPhone: "Телефон",
      colGuests: "Гости",
      colStatus: "Статус",
      colRegistered: "Зарегистрирован",
      noRegistrations: "Пока нет регистраций.",
      confirmDelete: "Подтвердить",
      cancelDelete: "Отмена",
      deleteAriaLabel: "Удалить регистрацию",
      eventDetailsHeading: "Детали мероприятия",
      eventDetailsSubtitle: "Отображается на странице регистрации и во всплывающем окне на главной.",
      eventNameLabel: "Название мероприятия",
      eventNamePlaceholder: "Cynapept Event Moscow",
      eventDateLabel: "Дата и время",
      eventDatePlaceholder: "напр. 12 декабря 2026, 19:00",
      venueNameLabel: "Название площадки",
      venueNamePlaceholder: "напр. Ritz-Carlton Moscow",
      venueAddressLabel: "Адрес площадки",
      venueAddressPlaceholder: "напр. ул. Тверская 3, Москва",
      venuePhotosLabel: "Фото площадки ({count}/{max})",
      upload: "Загрузить",
      removePhotoAriaLabel: "Удалить фото",
      photoTooMany: "Максимум {max} фото.",
      photoTooLarge: "«{name}» слишком большое — максимум {max}МБ на фото.",
      saveEventDetails: "Сохранить детали мероприятия",
      saving: "Сохранение…",
      saved: "Сохранено.",
      saveFailed: "Не удалось сохранить — попробуйте ещё раз.",
    },
  },
} as const;

export type Translations = typeof translations.en;
