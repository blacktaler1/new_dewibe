import { L } from "./i18n";
import type { SiteCopy } from "./types";

export const defaultCopy: SiteCopy = {
  hero: {
    title: L(
      "DEWIBE IT - Transform Your Ideas Into Digital Reality",
      "DEWIBE IT - G'oyalaringizni raqamli haqiqatga aylantiring",
      "DEWIBE IT - Превращаем ваши идеи в цифровую реальность",
    ),
    subtitle: L(
      "We build innovative web and mobile solutions that drive business growth. Professional services by Devibe and Devvibe.",
      "Biznes o'sishini ta'minlaydigan innovatsion veb va mobil yechimlarni yaratamiz. Devibe va Devvibe professional xizmatlari.",
      "Мы создаём инновационные веб и мобильные решения для роста бизнеса. Профессиональные услуги от Devibe и Devvibe.",
    ),
    ctaPrimary: L("View Our Work", "Ishlarimizni ko'rish", "Наши работы"),
    ctaSecondary: L("Meet the Team", "Jamoani tanish", "Наша команда"),
  },
  nav: {
    home: L("home", "bosh", "главная"),
    work: L("work", "ishlar", "работы"),
    services: L("services", "xizmatlar", "услуги"),
    about: L("about", "jamoa", "о нас"),
    contact: L("contact", "aloqa", "контакт"),
  },
  work: {
    label: L("Selected Work", "Tanlangan ishlar", "Избранные работы"),
    title: L("Projects we're proud of", "Biz faxrlanadigan loyihalar", "Проекты, которыми мы гордимся"),
    description: L(
      "A curated collection of digital products, brand experiences, and interfaces our team has crafted for ambitious clients.",
      "Jamoamiz iqtidorli mijozlar uchun yaratgan raqamli mahsulotlar, brend tajribalari va interfeyslar to'plami.",
      "Подборка цифровых продуктов, брендовых решений и интерфейсов, созданных нашей командой для амбициозных клиентов.",
    ),
    viewProject: L("View Project →", "Loyihani ko'rish →", "Смотреть проект →"),
  },
  services: {
    label: L("Our Services", "Xizmatlarimiz", "Наши услуги"),
    title: L("What we do best", "Biz nimalarda kuchlimiz", "Что мы делаем лучше всего"),
    description: L(
      "We partner with startups and brands to design, build, and launch digital products — from first sketch to production-ready launch.",
      "Startaplar va brendlar bilan hamkorlik qilib, raqamli mahsulotlarni loyihalash, yaratish va ishga tushiramiz.",
      "Мы помогаем стартапам и брендам проектировать, создавать и запускать цифровые продукты — от эскиза до релиза.",
    ),
    ctaText: L(
      "Not sure which service fits your project?",
      "Qaysi xizmat loyihangizga mos kelishini bilmayapsizmi?",
      "Не уверены, какая услуга подходит вашему проекту?",
    ),
    ctaButton: L("Let's Talk", "Bog'lanish", "Связаться"),
    items: [
      {
        id: "s1",
        icon: "palette",
        title: L("UI/UX Design", "UI/UX Dizayn", "UI/UX Дизайн"),
        description: L(
          "Research-driven interfaces and design systems that feel intuitive, polished, and built to convert.",
          "Intuitiv, sifatli va konversiyaga yo'naltirilgan interfeyslar va dizayn tizimlari.",
          "Интуитивные интерфейсы и дизайн-системы, созданные на основе исследований.",
        ),
        features: {
          en: ["User research", "Wireframes & prototypes", "Design systems", "Usability testing"],
          uz: ["Foydalanuvchi tadqiqoti", "Wireframe va prototiplar", "Dizayn tizimlari", "Foydalanish testlari"],
          ru: ["Исследование пользователей", "Вайрфреймы и прототипы", "Дизайн-системы", "Юзабилити-тесты"],
        },
      },
      {
        id: "s2",
        icon: "code",
        title: L("Web Development", "Veb ishlab chiqish", "Веб-разработка"),
        description: L(
          "Fast, scalable websites and web apps powered by modern stacks like Next.js, React, and TypeScript.",
          "Next.js, React va TypeScript kabi zamonaviy texnologiyalar asosida tez va kengaytiriladigan veb-yechimlar.",
          "Быстрые и масштабируемые сайты и веб-приложения на Next.js, React и TypeScript.",
        ),
        features: {
          en: ["Landing pages", "SaaS dashboards", "CMS integration", "Performance optimization"],
          uz: ["Landing sahifalar", "SaaS dashboardlar", "CMS integratsiyasi", "Tezlik optimizatsiyasi"],
          ru: ["Лендинги", "SaaS-дашборды", "Интеграция CMS", "Оптимизация производительности"],
        },
      },
      {
        id: "s3",
        icon: "sparkle",
        title: L("Brand Identity", "Brend identifikatsiyasi", "Брендинг"),
        description: L(
          "Distinct visual identities that capture your brand voice across every digital and physical touchpoint.",
          "Brend ovozingizni har bir raqamli va jismoniy nuqtada ifodalovchi vizual identitet.",
          "Уникальная визуальная идентичность для всех цифровых и офлайн-точек контакта.",
        ),
        features: {
          en: ["Logo design", "Visual language", "Brand guidelines", "Marketing assets"],
          uz: ["Logo dizayn", "Vizual til", "Brend qoidalari", "Marketing materiallari"],
          ru: ["Дизайн логотипа", "Визуальный язык", "Брендбук", "Маркетинговые материалы"],
        },
      },
      {
        id: "s4",
        icon: "deviceMobile",
        title: L("Mobile Apps", "Mobil ilovalar", "Мобильные приложения"),
        description: L(
          "Native-feeling mobile experiences with smooth interactions, offline support, and platform polish.",
          "Silliq interaksiyalar, offline qo'llab-quvvatlash va platformaga mos mobil tajribalar.",
          "Мобильные приложения с плавными взаимодействиями, офлайн-режимом и нативным UX.",
        ),
        features: {
          en: ["iOS & Android", "Cross-platform builds", "App store launch", "Push notifications"],
          uz: ["iOS va Android", "Cross-platform yechimlar", "App store chiqarish", "Push bildirishnomalar"],
          ru: ["iOS и Android", "Кроссплатформенная разработка", "Публикация в сторах", "Push-уведомления"],
        },
      },
      {
        id: "s5",
        icon: "stack",
        title: L("Motion & 3D", "Motion va 3D", "Motion и 3D"),
        description: L(
          "Immersive animations and 3D visuals that bring products to life and keep users engaged.",
          "Mahsulotlarni jonlantiradigan va foydalanuvchini jalb qiladigan animatsiya va 3D vizuallar.",
          "Иммерсивные анимации и 3D-визуалы, которые оживляют продукт и удерживают внимание.",
        ),
        features: {
          en: ["GSAP animations", "Micro-interactions", "WebGL experiences", "Scroll storytelling"],
          uz: ["GSAP animatsiyalar", "Mikro-interaksiyalar", "WebGL tajribalar", "Scroll hikoyasi"],
          ru: ["GSAP-анимации", "Микроинтеракции", "WebGL-опыт", "Сторителлинг при скролле"],
        },
      },
      {
        id: "s6",
        icon: "rocket",
        title: L("Product Strategy", "Mahsulot strategiyasi", "Продуктовая стратегия"),
        description: L(
          "From discovery to launch — we help teams define roadmaps, validate ideas, and ship with confidence.",
          "Discoverydan ishga tushirishgacha — yo'l xaritalari, g'oyalarni tekshirish va ishonchli reliz.",
          "От discovery до запуска — помогаем с роадмапом, валидацией и уверенным релизом.",
        ),
        features: {
          en: ["Product discovery", "UX audits", "Roadmap planning", "Launch support"],
          uz: ["Mahsulot discovery", "UX auditlar", "Roadmap rejalashtirish", "Ishga tushirish yordami"],
          ru: ["Product discovery", "UX-аудиты", "Планирование roadmap", "Поддержка запуска"],
        },
      },
    ],
  },
  clients: {
    badge: L("Trusted Partners", "Ishonchli hamkorlar", "Надёжные партнёры"),
    title: L("Companies we've built for", "Biz ishlab bergan kompaniyalar", "Компании, для которых мы работали"),
    description: L(
      "30+ brands and startups trust DEWIBE to design and ship their digital products.",
      "30+ brend va startap raqamli mahsulotlarini DEWIBE ga ishonadi.",
      "Более 30 брендов и стартапов доверяют DEWIBE разработку цифровых продуктов.",
    ),
    button: L("View our work", "Ishlarimizni ko'rish", "Смотреть работы"),
  },
  about: {
    label: L("Our Team", "Bizning jamoa", "Наша команда"),
    title: L("The people behind DEWIBE", "DEWIBE ortidagi odamlar", "Люди за DEWIBE"),
    description: L(
      "Meet the designers, developers, and strategists who bring your ideas to life.",
      "G'oyalaringizni hayotga olib chiqadigan dizaynerlar, dasturchilar va strateglarni tanishing.",
      "Познакомьтесь с дизайнерами, разработчиками и стратегами, которые воплощают ваши идеи.",
    ),
    ctaText: L(
      "Want to join forces on your next project?",
      "Keyingi loyihangizda hamkorlik qilmoqchimisiz?",
      "Хотите объединиться с нами на следующем проекте?",
    ),
    ctaButton: L("Work With Us", "Biz bilan ishlang", "Работать с нами"),
  },
  contact: {
    label: L("Get In Touch", "Bog'lanish", "Связаться"),
    title: L("Let's build something great together", "Keling, birgalikda ajoyib narsa yaratamiz", "Давайте создадим что-то великое вместе"),
    description: L(
      "Have a project in mind? Our team is ready to collaborate — tell us about your idea and we'll get back to you within 24 hours.",
      "Loyiha bormi? Jamoamiz hamkorlikka tayyor — g'oyangizni yozing, 24 soat ichida javob beramiz.",
      "Есть проект? Наша команда готова к сотрудничеству — расскажите о идее, и мы ответим в течение 24 часов.",
    ),
    emailLabel: L("Email", "Email", "Email"),
    phoneLabel: L("Phone", "Telefon", "Телефон"),
    locationLabel: L("Location", "Manzil", "Адрес"),
    locationValue: L("Tashkent, Uzbekistan", "Toshkent, O'zbekiston", "Ташкент, Узбекистан"),
    availabilityTitle: L("Taking on new clients", "Yangi mijozlar qabul qilinmoqda", "Принимаем новых клиентов"),
    availabilitySubtitle: L(
      "Our team is available for your next project",
      "Jamoamiz keyingi loyihangiz uchun tayyor",
      "Наша команда готова к вашему следующему проекту",
    ),
    nameLabel: L("Name", "Ism", "Имя"),
    emailFieldLabel: L("Email", "Email", "Email"),
    messageLabel: L("Message", "Xabar", "Сообщение"),
    namePlaceholder: L("Your name", "Ismingiz", "Ваше имя"),
    emailPlaceholder: L("you@example.com", "siz@example.com", "you@example.com"),
    messagePlaceholder: L(
      "Tell us about your project...",
      "Loyihangiz haqida yozing...",
      "Расскажите о вашем проекте...",
    ),
    submitButton: L("Send Message", "Xabar yuborish", "Отправить"),
    submittingButton: L("Sending...", "Yuborilmoqda...", "Отправка..."),
    successMessage: L(
      "Message sent! Our team will get back to you soon.",
      "Xabar yuborildi! Tez orada javob beramiz.",
      "Сообщение отправлено! Мы скоро свяжемся с вами.",
    ),
    errorMessage: L(
      "Something went wrong. Please try again.",
      "Xatolik yuz berdi. Qayta urinib ko'ring.",
      "Что-то пошло не так. Попробуйте снова.",
    ),
  },
  footer: {
    description: L(
      "A creative design & development team building immersive digital experiences for brands worldwide.",
      "Butun dunyo brendlari uchun immersiv raqamli tajribalar yaratadigan ijodiy dizayn va dasturlash jamoasi.",
      "Креативная команда дизайна и разработки, создающая иммерсивные цифровые решения для брендов по всему миру.",
    ),
    usefulLinksTitle: L("Useful Link", "Foydali havolalar", "Полезные ссылки"),
    followUsTitle: L("Follow Us", "Bizni kuzating", "Мы в соцсетях"),
    newsletterTitle: L("Subscribe to our newsletter", "Yangiliklarga obuna bo'ling", "Подписка на рассылку"),
    work: L("Work", "Ishlar", "Работы"),
    services: L("Services", "Xizmatlar", "Услуги"),
    about: L("About", "Jamoa", "О нас"),
    contact: L("Contact", "Aloqa", "Контакт"),
    privacy: L("Privacy Policy", "Maxfiylik siyosati", "Политика конфиденциальности"),
  },
};
