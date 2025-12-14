import { SubmitTaxpayersSpecialVerificationFormArgs } from '../types/verification'

export const submitTaxpayersSpecialVerificationFormArgsToParams = ({
  inputFields,
  documents,
  x_thumbprint,
}: SubmitTaxpayersSpecialVerificationFormArgs) => ({
  taxpayer: {
    ...inputFields,
  },
  documents: documents.map(document => ({
    part: document.part,
    type: document.supportingDocumentType,
    base64: x_thumbprint ? document.encryptedBase64 : document.originalBase64,
    image_file_type: document.imageFileType,
  })),
})
