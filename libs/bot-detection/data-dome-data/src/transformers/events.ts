type DataDomeScriptAction = {
  actionType: 'blocked' | 'response_displayed' | 'response_passed' | 'response_error'
  fingerprint: string
  endpointName: string
  responseType?: string
}

export const dataDomeScriptActionEvent = (args: DataDomeScriptAction) => {
  const { actionType, fingerprint, endpointName, responseType } = args

  return {
    event: 'system.datadome_script_action',
    extra: {
      action_type: actionType,
      fingerprint,
      endpoint_name: endpointName,
      response_type: responseType,
    },
  }
}
