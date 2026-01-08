import { create } from 'zustand'
import { Weather } from './types'

interface WeatherState {
  currentWeather: Weather | null
  setCurrentWeather: (weather: Weather) => void
}

export const useWeatherStore = create<WeatherState>((set) => ({
  currentWeather: null,
  setCurrentWeather: (weather) => set({ currentWeather: weather }),
}))
