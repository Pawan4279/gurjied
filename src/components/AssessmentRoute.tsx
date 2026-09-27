import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api'
import type { Assessment } from '../types'
import AssessmentScreen from './AssessmentScreen'

export default function AssessmentRoute({ onExit }: { onExit: () => void }) {
  const { assessmentId } = useParams()
  const [loadedAssessment, setLoadedAssessment] = useState<{ id: string; assessment?: Assessment; error?: string }>({ id: '' })

  useEffect(() => {
    let active = true
    if (!assessmentId) return
    api(`assessments/${encodeURIComponent(assessmentId)}`)
      .then(data => { if (active) setLoadedAssessment({ id: assessmentId, assessment: data }) })
      .catch(problem => { if (active) setLoadedAssessment({ id: assessmentId, error: (problem as Error).message }) })
    return () => { active = false }
  }, [assessmentId])

  const assessment = loadedAssessment.id === assessmentId ? loadedAssessment.assessment : undefined
  const error = loadedAssessment.id === assessmentId ? loadedAssessment.error : undefined
  if (assessment) return <AssessmentScreen key={assessment.id} assessment={assessment} onExit={onExit} />
  return <main className="route-loading" role={error ? 'alert' : 'status'}>{error || 'Loading assessment…'}{error && <button type="button" onClick={onExit}>Back to dashboard</button>}</main>
}
