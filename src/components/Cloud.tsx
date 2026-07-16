import { useState } from 'react'
import { useStore } from '../store/store'
import { getText } from '../text'
import './Cloud.css'

export interface Skill {
  name: string
  size: 1 | 2 | 3 | 4 | 5
  descRu: string
  descEn: string
}

interface SkillCloudProps {
  skills: Skill[]
}

export default function SkillCloud({ skills }: SkillCloudProps) {
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null)
  const language = useStore(s => s.language)

  return (
    <div className="skill-cloud-container">
      <div className="skill-cloud">
        {skills.map((skill, index) => (
          <span
            key={index}
            className={`skill-item size-${skill.size}`}
            onMouseEnter={() => setHoveredSkill(skill)}
            onMouseLeave={() => setHoveredSkill(null)}
          >
            {skill.name}
          </span>
        ))}
      </div>
      <div className="skill-description">
        {hoveredSkill ? (
          <div>
            <p>{language === 'ru' ? hoveredSkill.descRu : hoveredSkill.descEn}</p>
          </div>
        ) : (
          <p className="placeholder">{getText('skills.hover.placeholder', language)}</p>
        )}
      </div>
    </div>
  )
}