// File: src/text.ts
export type TextItem = { ru: string; en: string };

export const texts: Record<string, TextItem | TextItem[]> = {
  // Sidebar
  'sidebar.about': { ru: 'Обо мне', en: 'About' },
  'sidebar.education': { ru: 'Образование', en: 'Education' },
  'sidebar.experience': { ru: 'Опыт работы', en: 'Experience' },
  'sidebar.projects': { ru: 'Проекты', en: 'Projects' },
  'sidebar.skills': { ru: 'Навыки', en: 'Skills' },
  'sidebar.contacts': { ru: 'Контакты', en: 'Contacts' },
  'sidebar.license': { ru: 'Лицензия', en: 'License' },
  'sidebar.language': { ru: 'Язык', en: 'Language' },

  // About
  'about.title': { ru: 'Обо мне', en: 'About Me' },
  'about.name': { ru: 'Горохов Артём', en: 'Artem Gorokhov' },
  'about.role': { ru: 'Fullstack-разработчик', en: 'Fullstack Developer' },
  'about.age': { ru: '25 лет', en: '25 years old' },
  'about.location': { ru: 'Санкт-Петербург, Россия', en: 'Saint Petersburg, Russia' },
  'about.email': { ru: 'gorokhoff.art@mail.ru', en: 'gorokhoff.art@mail.ru' },
  'about.phone': { ru: '@Eggplant11', en: '@Eggplant11' }, // Заменено на Telegram
  'about.github': { ru: 'github.com/gorohovAv', en: 'github.com/gorohovAv' },
  'about.github.url': { ru: 'https://github.com/gorohovAv', en: 'https://github.com/gorohovAv' },
  'about.description': {
    ru: 'Fullstack-разработчик широкого профиля. Работаю с веб-, десктоп- и мобильными приложениями (React Native). Закрываю задачи как на клиенте, так и на сервере. Умею использовать ИИ-инструменты в работе без потери качества результата.',
    en: 'Versatile fullstack developer. I work on web, desktop, and mobile (React Native) applications, handling both client and server sides. I integrate AI tools into my workflow without compromising quality.'
  },
  'about.stack.title': { ru: 'Основной стек', en: 'Core Stack' },
  'about.stack.main': {
    ru: 'TypeScript, React, Zustand, Go (Gin, GORM), PostgreSQL',
    en: 'TypeScript, React, Zustand, Go (Gin, GORM), PostgreSQL'
  },
  'about.stack.extra.title': { ru: 'Также работал с', en: 'Also worked with' },
  'about.stack.extra': {
    ru: 'Rust, Python, Django, FastAPI, NestJS, Next.js, Redux Toolkit, Helix, Electron, Docker, Prisma, BEM',
    en: 'Rust, Python, Django, FastAPI, NestJS, Next.js, Redux Toolkit, Helix, Electron, Docker, Prisma, BEM'
  },

  // Education
  'education.title': { ru: 'Образование', en: 'Education' },
  'education.spbpu': { ru: 'Санкт-Петербургский политехнический университет Петра Великого', en: 'Peter the Great Saint Petersburg Polytechnic University' },
  'education.spbpu.degree': { ru: 'Бакалавр', en: 'Bachelor' },
  'education.spbpu.faculty': { ru: 'Энергомашиностроительный факультет, Энергетическое машиностроение', en: 'Faculty of Power Plant Engineering, Power Engineering' },
  'education.spbpu.year': { ru: '2019 — 2023', en: '2019 — 2023' },
  'education.spbpu.maga':{ ru: 'Санкт-Петербургский политехнический университет Петра Великого', en: 'Peter the Great Saint Petersburg Polytechnic University' },
  'education.spbpu.maga.degree':{ru: 'Магистр', en: 'Master'},
  'education.spbpu.maga.faculty':{ru: 'Гидромашиностроительный факультет, Энергетическое машиностроение', en: 'Hydroengineering faculty, Power Engineering'},
  'education.spbpu.maga.year':{ru: '2023 — 2025', en: '2023 — 2025'},
  'education.course.python': { ru: 'Разработчик прикладного ПО на языке Python', en: 'Applied Software Developer in Python' },
  'education.course.python.place': { ru: 'СПбПУ, Программист', en: 'SPbPU, Programmer' },
  'education.course.python.year': { ru: '2024', en: '2024' },
  'education.course.cad': { ru: 'Цифровой инжиниринг энергетического оборудования (CAD/CAM/CAE/PDM)', en: 'Digital Engineering of Power Equipment (CAD/CAM/CAE/PDM)' },
  'education.course.cad.place': { ru: 'СПбПУ, Специалист КТП энергомашиностроения', en: 'SPbPU, Specialist in Engineering Preparation' },
  'education.course.cad.year': { ru: '2023', en: '2023' },
  'education.course.simulation': { ru: 'Цифровое моделирование ЖЦ энергетического оборудования', en: 'Digital Simulation of Power Equipment Lifecycle' },
  'education.course.simulation.place': { ru: 'СПбПУ, Специалист НИОКР', en: 'SPbPU, R&D Specialist' },
  'education.course.simulation.year': { ru: '2024', en: '2024' },

  // Experience
  'experience.title': { ru: 'Опыт работы', en: 'Work Experience' },
  'experience.total': { ru: '3 года 11 месяцев', en: '3 years 11 months' },
  'experience.job1.company': { ru: 'Газпром ЦПС', en: 'Gazprom CPS' },
  'experience.job1.role': { ru: 'Разработчик', en: 'Developer' },
  'experience.job1.year': { ru: 'Ноябрь 2024 — настоящее время', en: 'November 2024 — present' },
  'experience.job1.duration': { ru: '1 год 9 месяцев', en: '1 year 9 months' },
  'experience.job1.desc': { ru: 'Поддержка и создание с нуля внутренних продуктов компании. Стек: TypeScript/JavaScript, Python, Go (Gin, GORM), Rust.', en: 'Support and greenfield development of internal company products. Stack: TypeScript/JavaScript, Python, Go (Gin, GORM), Rust.' },
  'experience.job1.bullets': [
    { ru: 'Веб-приложения на Go/Python + TypeScript/JavaScript (React, Zustand)', en: 'Web apps on Go/Python + TypeScript/JavaScript (React, Zustand)' },
    { ru: 'Десктопная утилита на TypeScript + Electron', en: 'Desktop utility on TypeScript + Electron' },
    { ru: 'Переписывание модуля с Python на Rust с увеличением скорости обработки', en: 'Rewriting a module from Python to Rust for performance gains' },
    { ru: 'Настройка сервисов инференса БЯМ, ИИ-пайплайнов, RAG', en: 'Setting up LLM inference services, AI pipelines, RAG' },
  ],
  'experience.job2.company': { ru: 'Concept Group', en: 'Concept Group' },
  'experience.job2.role': { ru: 'Веб-разработчик', en: 'Web Developer' },
  'experience.job2.year': { ru: 'Май 2024 — Октябрь 2024', en: 'May 2024 — October 2024' },
  'experience.job2.duration': { ru: '6 месяцев', en: '6 months' },
  'experience.job2.desc': { ru: 'Разработка платформы для дизайнеров одежды.', en: 'Development of a platform for fashion designers.' },
  'experience.job2.bullets': [
    { ru: 'Создание библиотеки компонентов, стилизация по БЭМ', en: 'Component library creation, BEM styling' },
    { ru: 'Создание страниц на Next.js', en: 'Page development with Next.js' },
    { ru: 'Настройка Redux store', en: 'Redux store setup' },
    { ru: 'Написание API-методов на Next.js', en: 'Writing API methods on Next.js' },
    { ru: 'Работа с Prisma', en: 'Working with Prisma' },
  ],
  'experience.job3.company': { ru: 'АО «Силовые Машины»', en: 'JSC «Power Machines»' },
  'experience.job3.role': { ru: 'Инженер студенческого КБ', en: 'Student Design Bureau Engineer' },
  'experience.job3.year': { ru: 'Сентябрь 2022 — Июнь 2024', en: 'September 2022 — June 2024' },
  'experience.job3.duration': { ru: '1 год 10 месяцев', en: '1 year 10 months' },
  'experience.job3.desc': { ru: 'Работа в конструкторском бюро.', en: 'Work in the design bureau.' },
  'experience.job3.bullets': [
    { ru: 'Оформление конструкторской документации', en: 'Preparation of design documentation' },
    { ru: 'Создание параметризованных шаблонов', en: 'Creation of parameterized templates' },
  ],

  // Projects (ЛИЧНЫЕ ПРОЕКТЫ)
  'projects.title': { ru: 'Проекты', en: 'Projects' },
  
  'projects.project1.name': { ru: 'Prompt scoop', en: 'Prompt scoop' },
  'projects.project1.desc': { 
    ru: 'Инструмент для конструирования промпта в VS Code. Фичи: инъекция файлов в контекст, структуры БД, информации из гита, макета Figma, перехват логов из консоли.', 
    en: 'VS Code extension for prompt construction. Features: file injection into context, DB structures, git info, Figma layout, console log interception.' 
  },
  'projects.project1.link1': { ru: 'GitHub', en: 'GitHub' },
  'projects.project1.link2': { ru: 'VS Code Marketplace', en: 'VS Code Marketplace' },
  
  'projects.project2.name': { ru: 'fitPlot', en: 'fitPlot' },
  'projects.project2.desc': { 
    ru: 'Удобный офлайн фитнес треккер с упором на аналитику.', 
    en: 'Convenient offline fitness tracker with a focus on analytics.' 
  },
  'projects.project2.link1': { ru: 'GitHub', en: 'GitHub' },
  'projects.project2.link2': { ru: 'RuStore', en: 'RuStore' },

  'projects.project3.name': { ru: 'Интерактивная звездная карта', en: 'Interactive Star Map' },
  'projects.project3.desc': { 
    ru: 'Вы сейчас здесь. Визуализация звездных систем и экзопланет в реальном времени.', 
    en: 'You are here. Real-time visualization of star systems and exoplanets.' 
  },

  // Skills
  'skills.title': { ru: 'Навыки', en: 'Skills' },
  'skills.hover.placeholder': { ru: 'Наведите на технологию, чтобы увидеть описание', en: 'Hover over a technology to see description' },
  'skills.hover.level': { ru: 'Уровень владения', en: 'Proficiency level' },

  // Contacts
  'contacts.title': { ru: 'Контакты', en: 'Contacts' },
  'contacts.email.label': { ru: 'Email', en: 'Email' },
  'contacts.telegram.label': { ru: 'Telegram', en: 'Telegram' }, // Заменено с phone на telegram
  'contacts.github.label': { ru: 'GitHub', en: 'GitHub' },

  // License
  'license.title': { ru: 'Лицензирование', en: 'Licensing' },
  'license.app': { 
    ru: 'Данное веб-приложение лицензируется на условиях лицензии MIT.', 
    en: 'This web application is licensed under the MIT License.' 
  },
  'license.stars': { 
    ru: 'Данные о звездах используют датасет HYG. База данных HYG лицензирована на условиях лицензии Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0).', 
    en: 'Star data uses the HYG dataset. The HYG database is licensed under the Creative Commons Attribution-ShareAlike 4.0 license (CC BY-SA 4.0).' 
  },
  'license.planets': { 
    ru: 'Данные о планетах предоставлены NASA Exoplanet Archive.', 
    en: 'Planet data is provided by the NASA Exoplanet Archive.' 
  },

  // System & Hovers
  'system.empty': { ru: 'Выберите звезду', en: 'Select a star' },
  'system.planets': { ru: 'планет', en: 'planets' },
  'starHover.distance': { ru: 'Расстояние: {distance} св. лет', en: 'Distance: {distance} ly' },
  'starHover.constellation': { ru: 'Созвездие', en: 'Constellation' },
  'starHover.stars': { ru: 'Звёзд: {count}', en: 'Stars: {count}' },
  'starHover.planets': { ru: 'Планет: {count}', en: 'Planets: {count}' },
  'planetHover.orbits': { ru: 'Обращается вокруг', en: 'Orbits' },
  'planetHover.period': { ru: 'Период обращения', en: 'Orbital period' },
  'planetHover.days': { ru: 'дней', en: 'days' },
  'planetHover.mass': { ru: 'Масса', en: 'Mass' },
  'planetHover.radius': { ru: 'Радиус', en: 'Radius' },
  'planetHover.habitable': { ru: 'В зоне обитаемости', en: 'In habitable zone' },
  'overlay.close': { ru: 'Закрыть', en: 'Close' },
}

export type TextKey = keyof typeof texts

export function getText(key: string, lang: 'ru' | 'en'): string {
  const item = texts[key];
  if (item && !Array.isArray(item)) {
    return item[lang] ?? key;
  }
  return key;
}