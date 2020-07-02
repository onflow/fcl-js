import crypto from 'crypto'
import {CREATE_ACCOUNT_CADENCE} from "./six-create-account.js"

const hashSixCreateAccount = () => {
    console.log(crypto.createHash('sha256').update(CREATE_ACCOUNT_CADENCE, 'utf8').digest('hex'))
}

hashSixCreateAccount()
