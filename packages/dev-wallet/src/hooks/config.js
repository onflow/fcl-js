import {
  useState,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js"
import {gql} from "../utils/gql.js"

const query = gql`
  query Config {
    config {
      name
      host
      pid
    }
  }
`

export const useConfig = () => {
  const [config, setConfig] = useState(null)
  useEffect(() => query().then(d => setConfig(d.data.config)), [])
  return config
}
