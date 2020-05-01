import {
  useState,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js"
import * as api from "../api/api.js"

export const useConfig = () => {
  const [config, setConfig] = useState(null)
  useEffect(() => api.config().then(d => setConfig(d.data.config)), [])
  return config
}
