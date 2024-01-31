import {invariant} from "@onflow/utils-invariant"

export async function normalize({template}) {
  invariant(
    template != undefined,
    "generateTemplateId({ template }) -- template must be defined"
  )
  invariant(
    typeof template === "object",
    "generateTemplateId({ template }) -- template must be an object"
  )
  invariant(
    template.f_type === "InteractionTemplate",
    "generateTemplateId({ template }) -- template object must be an InteractionTemplate"
  )
  invariant(
    template.f_version === "1.0.0",
    "generateTemplateId({ template }) -- template object must be version 1.0.0"
  )

  const templateData = template.data

  const messages = Object.keys(templateData.messages).map(messageKey => ({
    key: messageKey,
    i18n: templateData.messages[messageKey]?.i18n.map(
      messageKeyTranslationTag => ({
        tag: messageKeyTranslationTag,
        translation:
          templateData.messages[messageKey]?.i18n?.[messageKeyTranslationTag],
      })
    ),
  }))

  const _args = Object.keys(templateData?.["arguments"]).map(
    async (argumentKey, i) => ({
      ...templateData?.["arguments"]?.[argumentKey],
      label: argumentKey,
      index: i,
      type: templateData?.["arguments"]?.[argumentKey]?.type,
      messages: Object.keys(
        templateData?.["arguments"]?.[argumentKey].messages
      ).map(argumentMessageKey => ({
        key: argumentMessageKey,
        i18n: Object.keys(
          templateData?.["arguments"]?.[argumentKey].messages?.[
            argumentMessageKey
          ]
        ).map(argumentMessageTag => ({
          tag: argumentMessageTag,
          translation:
            templateData?.["arguments"]?.[argumentKey].messages?.[
              argumentMessageKey
            ]?.[argumentMessageTag],
        })),
      })),
    })
  )

  const newTemplate = {
    ...template,
    f_version: "1.1.0",
    data: {
      ...template.data,
      messages,
      parameters: _args,
    },
  }

  return newTemplate
}
