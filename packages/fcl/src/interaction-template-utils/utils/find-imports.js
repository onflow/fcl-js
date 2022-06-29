function generateImport({contractName, address}) {
    return ({ contractName, address, contract: "" })
}

export function findImports(cadence) {
    let iports = []

    let importsReg = /import \w+ from 0x\w+/g
    let fileImports = cadence.match(importsReg) || []
    for (const fileImport of fileImports) {
        let importReg = /import (\w+) from (0x\w+)/g
        let fileiport = importReg.exec(fileImport)
        if (fileiport) {
            iports.push(generateImport({
                address: fileiport[2],
                contractName: fileiport[1],
            }))
        }
    }

    return iports
} 
