// File: src/csvParser.ts

export interface StarData {
  id: number
  name: string
  ra: number
  dec: number
  dist: number
  mag: number
  spect: string
  x: number
  y: number
  z: number
  gl: string // Gliese catalog identifier (e.g., "GL 273")
  hd: string // HD catalog identifier
  hip: string // Hipparcos catalog identifier
}

export interface PlanetData {
  pl_name: string
  hostname: string
  default_flag: number
  sy_snum: number
  sy_pnum: number
  discoverymethod: string
  disc_year: number
  disc_facility: string
  soltype: string
  pl_controv_flag: number
  pl_refname: string
  pl_orbper: number
  pl_orbpererr1: number
  pl_orbpererr2: number
  pl_orbperlim: number
  pl_orbsmax: number
  pl_orbsmaxerr1: number
  pl_orbsmaxerr2: number
  pl_orbsmaxlim: number
  pl_rade: number
  pl_radeerr1: number
  pl_radeerr2: number
  pl_radelim: number
  pl_radj: number
  pl_radjerr1: number
  pl_radjerr2: number
  pl_radjlim: number
  pl_bmasse: number
  pl_bmasseerr1: number
  pl_bmasseerr2: number
  pl_bmasselim: number
  pl_bmassj: number
  pl_bmassjerr1: number
  pl_bmassjerr2: number
  pl_bmassjlim: number
  pl_bmassprov: string
  pl_orbeccen: number
  pl_orbeccenerr1: number
  pl_orbeccenerr2: number
  pl_orbeccenlim: number
  pl_insol: number
  pl_insolerr1: number
  pl_insolerr2: number
  pl_insollim: number
  pl_eqt: number
  pl_eqterr1: number
  pl_eqterr2: number
  pl_eqtlim: number
  ttv_flag: number
  st_refname: string
  st_spectype: string
  st_teff: number
  st_tefferr1: number
  st_tefferr2: number
  st_tefflim: number
  st_rad: number
  st_raderr1: number
  st_raderr2: number
  st_radlim: number
  st_mass: number
  st_masserr1: number
  st_masserr2: number
  st_masslim: number
  st_met: number
  st_meterr1: number
  st_meterr2: number
  st_metlim: number
  st_metratio: string
  st_logg: number
  st_loggerr1: number
  st_loggerr2: number
  st_logglim: number
  sy_refname: string
  rastr: string
  ra: number
  decstr: string
  dec: number
  sy_dist: number
  sy_disterr1: number
  sy_disterr2: number
  sy_vmag: number
  sy_vmagerr1: number
  sy_vmagerr2: number
  sy_kmag: number
  sy_kmagerr1: number
  sy_kmagerr2: number
  sy_gaiamag: number
  sy_gaiamagerr1: number
  sy_gaiamagerr2: number
  rowupdate: string
  pl_pubdate: string
  releasedate: string
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current.trim())
  return result
}

function parseNumber(value: string): number {
  if (!value || value === '' || value === '""') return NaN
  const num = parseFloat(value.replace(/"/g, ''))
  return isFinite(num) ? num : NaN
}

function parseString(value: string): string {
  if (!value) return ''
  return value.replace(/^"|"$/g, '').trim()
}

export function parseHYG(text: string): StarData[] {
  const lines = text.split('\n').filter(line => line.trim())
  if (lines.length < 2) return []
  
  const headers = parseCSVLine(lines[0])
  const stars: StarData[] = []
  
  // Find column indices
  const idIdx = headers.indexOf('id')
  const properIdx = headers.indexOf('proper')
  const raIdx = headers.indexOf('ra')
  const decIdx = headers.indexOf('dec')
  const distIdx = headers.indexOf('dist')
  const magIdx = headers.indexOf('mag')
  const spectIdx = headers.indexOf('spect')
  const xIdx = headers.indexOf('x')
  const yIdx = headers.indexOf('y')
  const zIdx = headers.indexOf('z')
  const glIdx = headers.indexOf('gl')
  const hdIdx = headers.indexOf('hd')
  const hipIdx = headers.indexOf('hip')
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length < headers.length) continue
    
    const name = parseString(values[properIdx])
    if (!name) continue // Skip unnamed stars
    
    const dist = parseNumber(values[distIdx])
    if (isNaN(dist) || dist <= 0) continue // Skip stars without valid distance
    
    // Фильтр: показываем только звезды на расстоянии до 500 световых лет от Земли.
    // В базе HYG расстояние (dist) указано в парсеках.
    // 1 парсек ≈ 3.262 световых года. 500 световых лет ≈ 153.28 парсек.
    if (dist > 153.3) continue
    
    stars.push({
      id: parseNumber(values[idIdx]) || i,
      name: name,
      ra: parseNumber(values[raIdx]) || 0,
      dec: parseNumber(values[decIdx]) || 0,
      dist: dist,
      mag: parseNumber(values[magIdx]) || 0,
      spect: parseString(values[spectIdx]),
      x: parseNumber(values[xIdx]) || 0,
      y: parseNumber(values[yIdx]) || 0,
      z: parseNumber(values[zIdx]) || 0,
      gl: parseString(values[glIdx]),
      hd: parseString(values[hdIdx]),
      hip: parseString(values[hipIdx]),
    })
  }
  
  return stars
}

export function parseNASAExoplanets(text: string): PlanetData[] {
  const lines = text.split('\n').filter(line => line.trim() && !line.startsWith('#'))
  if (lines.length < 2) return []
  
  const headers = parseCSVLine(lines[0])
  const planets: PlanetData[] = []
  
  // Create index map
  const getIndex = (name: string) => headers.indexOf(name)
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length < headers.length) continue
    
    const hostname = parseString(values[getIndex('hostname')])
    if (!hostname) continue
    
    const planet: PlanetData = {
      pl_name: parseString(values[getIndex('pl_name')]),
      hostname: hostname,
      default_flag: parseNumber(values[getIndex('default_flag')]),
      sy_snum: parseNumber(values[getIndex('sy_snum')]),
      sy_pnum: parseNumber(values[getIndex('sy_pnum')]),
      discoverymethod: parseString(values[getIndex('discoverymethod')]),
      disc_year: parseNumber(values[getIndex('disc_year')]),
      disc_facility: parseString(values[getIndex('disc_facility')]),
      soltype: parseString(values[getIndex('soltype')]),
      pl_controv_flag: parseNumber(values[getIndex('pl_controv_flag')]),
      pl_refname: parseString(values[getIndex('pl_refname')]),
      pl_orbper: parseNumber(values[getIndex('pl_orbper')]),
      pl_orbpererr1: parseNumber(values[getIndex('pl_orbpererr1')]),
      pl_orbpererr2: parseNumber(values[getIndex('pl_orbpererr2')]),
      pl_orbperlim: parseNumber(values[getIndex('pl_orbperlim')]),
      pl_orbsmax: parseNumber(values[getIndex('pl_orbsmax')]),
      pl_orbsmaxerr1: parseNumber(values[getIndex('pl_orbsmaxerr1')]),
      pl_orbsmaxerr2: parseNumber(values[getIndex('pl_orbsmaxerr2')]),
      pl_orbsmaxlim: parseNumber(values[getIndex('pl_orbsmaxlim')]),
      pl_rade: parseNumber(values[getIndex('pl_rade')]),
      pl_radeerr1: parseNumber(values[getIndex('pl_radeerr1')]),
      pl_radeerr2: parseNumber(values[getIndex('pl_radeerr2')]),
      pl_radelim: parseNumber(values[getIndex('pl_radelim')]),
      pl_radj: parseNumber(values[getIndex('pl_radj')]),
      pl_radjerr1: parseNumber(values[getIndex('pl_radjerr1')]),
      pl_radjerr2: parseNumber(values[getIndex('pl_radjerr2')]),
      pl_radjlim: parseNumber(values[getIndex('pl_radjlim')]),
      pl_bmasse: parseNumber(values[getIndex('pl_bmasse')]),
      pl_bmasseerr1: parseNumber(values[getIndex('pl_bmasseerr1')]),
      pl_bmasseerr2: parseNumber(values[getIndex('pl_bmasseerr2')]),
      pl_bmasselim: parseNumber(values[getIndex('pl_bmasselim')]),
      pl_bmassj: parseNumber(values[getIndex('pl_bmassj')]),
      pl_bmassjerr1: parseNumber(values[getIndex('pl_bmassjerr1')]),
      pl_bmassjerr2: parseNumber(values[getIndex('pl_bmassjerr2')]),
      pl_bmassjlim: parseNumber(values[getIndex('pl_bmassjlim')]),
      pl_bmassprov: parseString(values[getIndex('pl_bmassprov')]),
      pl_orbeccen: parseNumber(values[getIndex('pl_orbeccen')]),
      pl_orbeccenerr1: parseNumber(values[getIndex('pl_orbeccenerr1')]),
      pl_orbeccenerr2: parseNumber(values[getIndex('pl_orbeccenerr2')]),
      pl_orbeccenlim: parseNumber(values[getIndex('pl_orbeccenlim')]),
      pl_insol: parseNumber(values[getIndex('pl_insol')]),
      pl_insolerr1: parseNumber(values[getIndex('pl_insolerr1')]),
      pl_insolerr2: parseNumber(values[getIndex('pl_insolerr2')]),
      pl_insollim: parseNumber(values[getIndex('pl_insollim')]),
      pl_eqt: parseNumber(values[getIndex('pl_eqt')]),
      pl_eqterr1: parseNumber(values[getIndex('pl_eqterr1')]),
      pl_eqterr2: parseNumber(values[getIndex('pl_eqterr2')]),
      pl_eqtlim: parseNumber(values[getIndex('pl_eqtlim')]),
      ttv_flag: parseNumber(values[getIndex('ttv_flag')]),
      st_refname: parseString(values[getIndex('st_refname')]),
      st_spectype: parseString(values[getIndex('st_spectype')]),
      st_teff: parseNumber(values[getIndex('st_teff')]),
      st_tefferr1: parseNumber(values[getIndex('st_tefferr1')]),
      st_tefferr2: parseNumber(values[getIndex('st_tefferr2')]),
      st_tefflim: parseNumber(values[getIndex('st_tefflim')]),
      st_rad: parseNumber(values[getIndex('st_rad')]),
      st_raderr1: parseNumber(values[getIndex('st_raderr1')]),
      st_raderr2: parseNumber(values[getIndex('st_raderr2')]),
      st_radlim: parseNumber(values[getIndex('st_radlim')]),
      st_mass: parseNumber(values[getIndex('st_mass')]),
      st_masserr1: parseNumber(values[getIndex('st_masserr1')]),
      st_masserr2: parseNumber(values[getIndex('st_masserr2')]),
      st_masslim: parseNumber(values[getIndex('st_masslim')]),
      st_met: parseNumber(values[getIndex('st_met')]),
      st_meterr1: parseNumber(values[getIndex('st_meterr1')]),
      st_meterr2: parseNumber(values[getIndex('st_meterr2')]),
      st_metlim: parseNumber(values[getIndex('st_metlim')]),
      st_metratio: parseString(values[getIndex('st_metratio')]),
      st_logg: parseNumber(values[getIndex('st_logg')]),
      st_loggerr1: parseNumber(values[getIndex('st_loggerr1')]),
      st_loggerr2: parseNumber(values[getIndex('st_loggerr2')]),
      st_logglim: parseNumber(values[getIndex('st_logglim')]),
      sy_refname: parseString(values[getIndex('sy_refname')]),
      rastr: parseString(values[getIndex('rastr')]),
      ra: parseNumber(values[getIndex('ra')]),
      decstr: parseString(values[getIndex('decstr')]),
      dec: parseNumber(values[getIndex('dec')]),
      sy_dist: parseNumber(values[getIndex('sy_dist')]),
      sy_disterr1: parseNumber(values[getIndex('sy_disterr1')]),
      sy_disterr2: parseNumber(values[getIndex('sy_disterr2')]),
      sy_vmag: parseNumber(values[getIndex('sy_vmag')]),
      sy_vmagerr1: parseNumber(values[getIndex('sy_vmagerr1')]),
      sy_vmagerr2: parseNumber(values[getIndex('sy_vmagerr2')]),
      sy_kmag: parseNumber(values[getIndex('sy_kmag')]),
      sy_kmagerr1: parseNumber(values[getIndex('sy_kmagerr1')]),
      sy_kmagerr2: parseNumber(values[getIndex('sy_kmagerr2')]),
      sy_gaiamag: parseNumber(values[getIndex('sy_gaiamag')]),
      sy_gaiamagerr1: parseNumber(values[getIndex('sy_gaiamagerr1')]),
      sy_gaiamagerr2: parseNumber(values[getIndex('sy_gaiamagerr2')]),
      rowupdate: parseString(values[getIndex('rowupdate')]),
      pl_pubdate: parseString(values[getIndex('pl_pubdate')]),
      releasedate: parseString(values[getIndex('releasedate')]),
    }
    
    planets.push(planet)
  }
  
  return planets
}