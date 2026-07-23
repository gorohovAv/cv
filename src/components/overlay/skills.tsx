import SkillCloud from '../Cloud'
import type { Skill } from '../Cloud'

const skillsData: Skill[] = [
  { name: 'TypeScript', size: 5, descRu: 'Основной язык разработки. Строгая типизация и высокая скорость исполнения позволяют писать надежный и масштабируемый код как для фронтенда, так и для бэкенда.', descEn: 'Primary development language. Strict typing and performance enable writing reliable and scalable code for both frontend and backend.' },
  { name: 'React', size: 4, descRu: 'Библиотека для построения пользовательских интерфейсов. Использую функциональные компоненты, хуки и оптимизации рендеринга для создания легко-поддерживаемых SPA.', descEn: 'Library for building user interfaces. I use functional components, hooks, and rendering optimizations to create maintanable SPAs.' },
  { name: 'PostgreSQL', size: 4, descRu: 'Отраслевой стандарт реляционных СУБД. Работал как с сырыми SQL-запросами, так и через ORM (GORM, Prisma, typeorm). Занимался проектированием схем, индексацией и оптимизацией.', descEn: 'Industry standard relational DBMS. Worked with both raw SQL queries and ORMs (GORM, Prisma, typeorm). Handled schema design, indexing, and optimization.' },
  { name: 'React Native', size: 3, descRu: 'Библиотека для кроссплатформенной мобильной разработки. Применял для создания офлайн-ориентированного фитнес-трекера FitPlot с упором на аналитику.', descEn: 'Library for cross-platform mobile development. Applied to create the offline-oriented fitness tracker FitPlot with a focus on analytics.' },
  { name: 'Zustand', size: 2, descRu: 'Минималистичный и гибкий менеджер состояния для React. Мой базовый выбор для клиентской части приложений.', descEn: 'Minimalist and flexible state manager for React. My default choice for the client side.' },
  { name: 'Python', size: 2, descRu: 'ЯП с обширной экосистемой в области ИИ и не только. Использую для поддержки и развития внутренних инструментов, настройки инференса больших языковых моделей (БЯМ) и создания скриптов автоматизации.', descEn: 'Programming language with vast ecosystem in ai and more. Used for supporting and developing internal tools, setting up LLM inference, and creating automation scripts.' },
  { name: 'Go', size: 1, descRu: 'Применял для настройки ИИ-пайплайнов и создания высоконагруженного бэкенда проекта "Помощник администратора" с использованием Gin и GORM.', descEn: 'Applied for setting up AI pipelines and creating a high-load backend for the "Admin Assistant" project using Gin and GORM.' },
  { name: 'Rust', size: 1, descRu: 'Использовал для написания высокопроизводительного модуля контроля качества, переписав его с Python для значительного прироста скорости обработки.', descEn: 'Used to write a high-performance quality control module, rewriting it from Python for a significant processing speed boost.' },
  { name: 'Helix', size: 1, descRu: 'Графово векторная база данных на базе rust. Настраивал графово-векторную базу знаний для эффективного хранения и поиска связанных данных в контексте RAG-систем.', descEn: 'Graph-vector rust-powered database. Configured a graph-vector knowledge base for efficient storage and retrieval of related data in the context of RAG systems.' },
  { name: 'SQLite', size: 2, descRu: 'Минималистичная альтернатива PostgreSQL. Идеально подходит для локального хранения данных в мобильных приложениях и легких десктопных утилитах.', descEn: 'Minimalist alternative to PostgreSQL. Perfect for local data storage in mobile applications and lightweight desktop utilities.' },
  { name: 'NestJS', size: 3, descRu: 'Полноценный веб-фреймворк на TypeScript для Node.js. Использую для построения масштабируемой и строго типизированной серверной архитектуры.', descEn: 'Full-fledged web framework on TypeScript for Node.js. I use it to build scalable and strictly typed server architecture.' },
]

export default function Skills() {
  return (
    <div className="overlay-section skills-section">
      <SkillCloud skills={skillsData} />
    </div>
  )
}