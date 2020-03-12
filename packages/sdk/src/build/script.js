import {pipe} from "@qvvg/mario"
import {t7l} from "@qvvg/templar"
import {makeScript} from "@onflow/interaction"
import {put} from "@onflow/assigns"

export const script = (...args) => pipe([makeScript, put("code", t7l(...args))])
