export function mergePreference(target: any, source: any) {
  const result = { ...target }

  for (const key in source) {
    if (!Object.hasOwn(source, key)) {
      continue
    }

    if (source[key] === null) {
      delete result[key]
      continue
    }

    if (Array.isArray(source[key])) {
      result[key] = [...source[key]]
      continue
    }

    if (source[key] && typeof source[key] === 'object') {
      result[key] =
        key in result && typeof result[key] === 'object' && !Array.isArray(result[key])
          ? mergePreference(result[key], source[key])
          : mergePreference({}, source[key])
    } else if (source[key] !== null) {
      result[key] = source[key]
    }
  }

  return result
}
