interface Env {
  // oxlint-disable-next-line consistent-indexed-object-style
  [key: string]: unknown
}

module 'atropos/css' {
  const classes: CSSModuleClasses
  export default classes
}
