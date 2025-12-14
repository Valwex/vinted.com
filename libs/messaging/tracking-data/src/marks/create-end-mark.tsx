export const enum Attribute {
  EndMarkNamespace = 'data-end-mark-namespace',
  EndMark = 'data-end-mark',
}

const createEndMark = (namespace: string, markName: string) => () => (
  <div
    {...{
      [Attribute.EndMarkNamespace]: namespace,
      [Attribute.EndMark]: markName,
    }}
  />
)

export default createEndMark
