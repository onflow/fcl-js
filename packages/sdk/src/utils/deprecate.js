const buildWarningMessage = ({name, transitionsPath}) => {
  console.warn(
    `
    %cFCL/SDK Deprecation Notice
    ============================
    The ${name} builder has been deprecated and will be removed in future versions of the Flow JS-SDK/FCL.
    You can learn more (including a guide on common transition paths) here: ${transitionsPath}
    ============================
  `,
    "font-weight:bold;font-family:monospace;"
  )
}

const buildErrorMessage = ({name, transitionsPath}) => {
  console.error(
    `
    %cFCL/SDK Deprecation Notice
    ============================
    The ${name} builder has been removed from the Flow JS-SDK/FCL.
    You can learn more (including a guide on common transition paths) here: ${transitionsPath}
    ============================
  `,
    "font-weight:bold;font-family:monospace;"
  )
}

const warn = deprecated => buildWarningMessage(deprecated)

const error = deprecated => {
  buildErrorMessage(deprecated)
}

export const deprecate = {
  warn,
  error,
}
