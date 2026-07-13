// File: src/components/overlay/skills.tsx
import SkillCloud from '../Cloud'
import type { Skill } from '../Cloud'
import { useStore } from '../../store/store'
import { getText } from '../../text'

const skillsData: Skill[] = [
  { name: 'TypeScript', size: 5, descRu: 'Основная технология веба', descEn: 'Main web technology' },
  { name: 'React', size: 4, descRu: 'Основная технология веба', descEn: 'Main web technology' },
  { name: 'PostgreSQL', size: 4, descRu: 'Отраслевой стандарт реляционной БД. Работал как с сырыми запросами, так и через ORM', descEn: 'Industry standard relational DB. Worked with both raw queries and ORM' },
  { name: 'React Native', size: 3, descRu: 'Открытый фитнес треккер ФитПлот', descEn: 'Open fitness tracker FitPlot' },
  { name: 'Zustand', size: 2, descRu: 'Мой базовый выбор стора на клиентской части', descEn: 'My basic choice of store on the client side' },
  { name: 'Python', size: 2, descRu: 'Поддержка и развитие проекта "Помощник планировщика", настройка инференса БЯМ', descEn: 'Support and development of "Scheduler Assistant", LLM inference setup' },
  { name: 'Go', size: 1, descRu: 'Настройка ИИ пайплайнов и создание бэкенда проекта "Помощник администратора"', descEn: 'AI pipelines setup and backend for "Admin Assistant"' },
  { name: 'Rust', size: 1, descRu: 'Высокопроизводительный модуль контроля качества', descEn: 'High-performance quality control module' },
  { name: 'Helix', size: 1, descRu: 'Настройка графово-векторной базы знаний', descEn: 'Graph-vector knowledge base setup' },
]

export default function Skills() {
  const language = useStore(s => s.language)
  const t = (key: string) => getText(key, language)

  return (
    <div className="overlay-section skills-section">
      <SkillCloud skills={skillsData} />
    </div>
  )
}