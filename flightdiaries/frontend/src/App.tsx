
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import axios from 'axios'
import diaryService from './services/diaryService'
import type { DiaryEntry, Weather, Visibility } from './types'

const weatherOptions: Weather[] = [
  'sunny',
  'rainy',
  'cloudy',
  'stormy',
  'windy'
]

const visibilityOptions: Visibility[] = [
  'great',
  'good',
  'ok',
  'poor'
]

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([])
  const [date, setDate] = useState('')
  const [weather, setWeather] = useState<Weather>('sunny')
  const [visibility, setVisibility] = useState<Visibility>('great')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchDiaries = async () => {
      const data = await diaryService.getAll()
      setDiaries(data)
    }

    void fetchDiaries()
  }, [])

  const submitNewDiary = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const newDiary = {
        date,
        weather,
        visibility
      }

      const createdDiary = await diaryService.create(newDiary)

      setDiaries(diaries.concat(createdDiary))
      setDate('')
      setWeather('sunny')
      setVisibility('great')
      setErrorMessage(null)
    } catch (error: unknown) {
      if (axios.isAxiosError<{ error: string }>(error)) {
        setErrorMessage(
          error.response?.data?.error || error.message
        )
      } else {
        setErrorMessage('An unknown error occurred')
      }
    }
  }

  return (
    <div>
      <h1>Flight Diaries</h1>

      {errorMessage && (
        <div style={{ color: 'red' }}>
          {errorMessage}
        </div>
      )}

      <h2>Add new diary</h2>

      <form onSubmit={submitNewDiary}>
        <div>
          Date:
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        <div>
          <fieldset>
            <legend>Weather</legend>

            {weatherOptions.map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  name="weather"
                  value={option}
                  checked={weather === option}
                  onChange={() => setWeather(option)}
                />
                {option}
              </label>
            ))}
          </fieldset>
        </div>

        <div>
          <fieldset>
            <legend>Visibility</legend>

            {visibilityOptions.map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  name="visibility"
                  value={option}
                  checked={visibility === option}
                  onChange={() => setVisibility(option)}
                />
                {option}
              </label>
            ))}
          </fieldset>
        </div>

        <button type="submit">Add</button>
      </form>

      <h2>Diary entries</h2>

      {diaries.map((diary) => (
        <div key={diary.id}>
          <h3>{diary.date}</h3>
          <p>Weather: {diary.weather}</p>
          <p>Visibility: {diary.visibility}</p>
        </div>
      ))}
    </div>
  )
}

export default App
