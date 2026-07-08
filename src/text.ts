export const texts: Record<string, { ru: string; en: string }> = {
  // Sidebar
  'sidebar.about': { ru: 'Обо мне', en: 'About' },
  'sidebar.education': { ru: 'Образование', en: 'Education' },
  'sidebar.experience': { ru: 'Опыт работы', en: 'Experience' },
  'sidebar.projects': { ru: 'Проекты', en: 'Projects' },
  'sidebar.language': { ru: 'Язык', en: 'Language' },

  // About
  'about.title': { ru: 'Обо мне', en: 'About Me' },
  'about.name': { ru: 'Иван Иванов', en: 'Ivan Ivanov' },
  'about.role': { ru: 'Fullstack разработчик', en: 'Fullstack Developer' },
  'about.description': {
    ru: 'Опытный разработчик с страстью к созданию элегантных и эффективных решений. Специализируюсь на веб-технологиях, распределенных системах и исследовании космоса.',
    en: 'Experienced developer with a passion for creating elegant and efficient solutions. Specializing in web technologies, distributed systems, and space exploration.'
  },
  'about.location': { ru: 'Москва, Россия', en: 'Moscow, Russia' },
  'about.email': { ru: 'ivan@example.com', en: 'ivan@example.com' },

  // Education
  'education.title': { ru: 'Образование', en: 'Education' },
  'education.msu': { ru: 'МГУ им. М.В. Ломоносова', en: 'Lomonosov Moscow State University' },
  'education.msu.degree': { ru: 'Магистр компьютерных наук', en: 'Master of Computer Science' },
  'education.msu.year': { ru: '2016 — 2018', en: '2016 — 2018' },
  'education.msu.desc': {
    ru: 'Специализация в области алгоритмов и искусственного интеллекта. Дипломная работа по оптимизации распределенных вычислений.',
    en: 'Specialization in algorithms and artificial intelligence. Thesis on optimization of distributed computations.'
  },
  'education.bachelor': { ru: 'МГТУ им. Н.Э. Баумана', en: 'Bauman Moscow State Technical University' },
  'education.bachelor.degree': { ru: 'Бакалавр информатики', en: 'Bachelor of Informatics' },
  'education.bachelor.year': { ru: '2012 — 2016', en: '2012 — 2016' },
  'education.bachelor.desc': {
    ru: 'Изучение фундаментальных основ программирования, структур данных и архитектуры вычислительных систем.',
    en: 'Study of fundamental programming, data structures, and computational system architecture.'
  },

  // Experience
  'experience.title': { ru: 'Опыт работы', en: 'Work Experience' },
  'experience.job1.company': { ru: 'Яндекс', en: 'Yandex' },
  'experience.job1.role': { ru: 'Senior Developer', en: 'Senior Developer' },
  'experience.job1.year': { ru: '2021 — настоящее время', en: '2021 — present' },
  'experience.job1.desc': {
    ru: 'Разработка высоконагруженных сервисов. Оптимизация производительности, менторинг команды, внедрение новых технологий.',
    en: 'Development of high-load services. Performance optimization, team mentoring, implementation of new technologies.'
  },
  'experience.job2.company': { ru: 'VK', en: 'VK' },
  'experience.job2.role': { ru: 'Middle Developer', en: 'Middle Developer' },
  'experience.job2.year': { ru: '2018 — 2021', en: '2018 — 2021' },
  'experience.job2.desc': {
    ru: 'Разработка фронтенд и бэкенд компонентов для социальных сервисов. Работа с микросервисной архитектурой.',
    en: 'Development of frontend and backend components for social services. Working with microservice architecture.'
  },
  'experience.job3.company': { ru: 'Стартап', en: 'Startup' },
  'experience.job3.role': { ru: 'Junior Developer', en: 'Junior Developer' },
  'experience.job3.year': { ru: '2016 — 2018', en: '2016 — 2018' },
  'experience.job3.desc': {
    ru: 'Fullstack разработка веб-приложений. Участие во всех этапах жизненного цикла продукта.',
    en: 'Fullstack web application development. Participation in all stages of the product lifecycle.'
  },

  // Projects
  'projects.title': { ru: 'Проекты', en: 'Projects' },
  'projects.project1.name': { ru: 'Звёздный Навигатор', en: 'Star Navigator' },
  'projects.project1.desc': {
    ru: 'Интерактивная 3D карта звёздного неба с использованием Three.js и WebGL. Визуализация реальных астрономических данных.',
    en: 'Interactive 3D star map using Three.js and WebGL. Visualization of real astronomical data.'
  },
  'projects.project2.name': { ru: 'Распределённый Кэш', en: 'Distributed Cache' },
  'projects.project2.desc': {
    ru: 'Высокопроизводительная система кеширования с поддержкой репликации и шардирования. Написана на Go.',
    en: 'High-performance caching system with replication and sharding support. Written in Go.'
  },
  'projects.project3.name': { ru: 'Нейросетевой Ассистент', en: 'Neural Assistant' },
  'projects.project3.desc': {
    ru: 'Чат-бот на основе трансформерных моделей для автоматизации технической поддержки.',
    en: 'Chatbot based on transformer models for automating technical support.'
  },

  // System
  'system.empty': { ru: 'Выберите звезду', en: 'Select a star' },
  'system.planets': { ru: 'планет', en: 'planets' },

  // Overlay
  'overlay.close': { ru: 'Закрыть', en: 'Close' },
}

export type TextKey = keyof typeof texts