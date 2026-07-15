import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { 
  parseHYG, 
  parseNASAExoplanets, 
  getStarColor, 
  matchPlanetToStar,
  type StarData, 
  type PlanetData 
} from './src/csvParser.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface StarSystemData {
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
  color: string
  planets: PlanetData[]
}

async function buildSystems() {
  console.log('🚀 Starting systems pre-compilation...')
  
  const hygPath = path.join(__dirname, 'public', 'hyg_v42.csv')
  const nasaPath = path.join(__dirname, 'public', 'PS_2026.07.09_23.35.24.csv')
  const outputPath = path.join(__dirname, 'public', 'systems.json')

  if (!fs.existsSync(hygPath)) {
    console.error('❌ hyg_v42.csv not found in public/')
    process.exit(1)
  }
  if (!fs.existsSync(nasaPath)) {
    console.error('❌ PS_2026.07.09_23.35.24.csv not found in public/')
    process.exit(1)
  }

  console.log('📖 Reading CSV files...')
  const hygText = fs.readFileSync(hygPath, 'utf-8')
  const nasaText = fs.readFileSync(nasaPath, 'utf-8')

  console.log('⚙️ Parsing stars (applying distance filter)...')
  const stars = parseHYG(hygText)
  
  console.log('⚙️ Parsing exoplanets...')
  const planets = parseNASAExoplanets(nasaText)

  console.log('☀️ Adding Solar System...')
  const sun: StarData = {
    id: 0,
    name: 'Sun',
    ra: 0,
    dec: 0,
    dist: 0,
    mag: 4.83,
    spect: 'G2V',
    x: 0,
    y: 0,
    z: 0,
    gl: '',
    hd: 'HD 1757',
    hip: 'HIP 1757',
  }
  
  const solarPlanetsData = [
    { pl_name: 'Mercury', hostname: 'Sun', pl_orbsmax: 2.0, pl_orbper: 88.0, pl_rade: 0.05 },
    { pl_name: 'Venus', hostname: 'Sun', pl_orbsmax: 3.5, pl_orbper: 224.7, pl_rade: 0.12 },
    { pl_name: 'Earth', hostname: 'Sun', pl_orbsmax: 5.0, pl_orbper: 365.25, pl_rade: 0.13 },
    { pl_name: 'Mars', hostname: 'Sun', pl_orbsmax: 7.0, pl_orbper: 687.0, pl_rade: 0.08 },
    { pl_name: 'Jupiter', hostname: 'Sun', pl_orbsmax: 10.0, pl_orbper: 4331, pl_rade: 2.4 },
    { pl_name: 'Saturn', hostname: 'Sun', pl_orbsmax: 13.0, pl_orbper: 10747, pl_rade: 1.8 },
    { pl_name: 'Uranus', hostname: 'Sun', pl_orbsmax: 16.0, pl_orbper: 30589, pl_rade: 1.2 },
    { pl_name: 'Neptune', hostname: 'Sun', pl_orbsmax: 19.0, pl_orbper: 59800, pl_rade: 1.0 },
  ]
  
  const solarPlanets = solarPlanetsData.map(p => ({
    pl_name: p.pl_name,
    hostname: p.hostname,
    default_flag: 1,
    sy_snum: 1,
    sy_pnum: 1,
    discoverymethod: '',
    disc_year: 0,
    disc_facility: '',
    soltype: '',
    pl_controv_flag: 0,
    pl_refname: '',
    pl_orbper: p.pl_orbper,
    pl_orbpererr1: 0, pl_orbpererr2: 0, pl_orbperlim: 0,
    pl_orbsmax: p.pl_orbsmax,
    pl_orbsmaxerr1: 0, pl_orbsmaxerr2: 0, pl_orbsmaxlim: 0,
    pl_rade: p.pl_rade,
    pl_radeerr1: 0, pl_radeerr2: 0, pl_radelim: 0,
    pl_radj: 0, pl_radjerr1: 0, pl_radjerr2: 0, pl_radjlim: 0,
    pl_bmasse: 0, pl_bmasseerr1: 0, pl_bmasseerr2: 0, pl_bmasselim: 0,
    pl_bmassj: 0, pl_bmassjerr1: 0, pl_bmassjerr2: 0, pl_bmassjlim: 0,
    pl_bmassprov: '',
    pl_orbeccen: 0, pl_orbeccenerr1: 0, pl_orbeccenerr2: 0, pl_orbeccenlim: 0,
    pl_insol: 0, pl_insolerr1: 0, pl_insolerr2: 0, pl_insollim: 0,
    pl_eqt: 0, pl_eqterr1: 0, pl_eqterr2: 0, pl_eqtlim: 0,
    ttv_flag: 0,
    st_refname: '', st_spectype: 'G2V', st_teff: 5778, st_tefferr1: 0, st_tefferr2: 0, st_tefflim: 0,
    st_rad: 1, st_raderr1: 0, st_raderr2: 0, st_radlim: 0,
    st_mass: 1, st_masserr1: 0, st_masserr2: 0, st_masslim: 0,
    st_met: 0, st_meterr1: 0, st_meterr2: 0, st_metlim: 0, st_metratio: '',
    st_logg: 0, st_loggerr1: 0, st_loggerr2: 0, st_logglim: 0,
    sy_refname: '', rastr: '', ra: 0, decstr: '', dec: 0,
    sy_dist: 0, sy_disterr1: 0, sy_disterr2: 0,
    sy_vmag: 0, sy_vmagerr1: 0, sy_vmagerr2: 0,
    sy_kmag: 0, sy_kmagerr1: 0, sy_kmagerr2: 0,
    sy_gaiamag: 0, sy_gaiamagerr1: 0, sy_gaiamagerr2: 0,
    rowupdate: '', pl_pubdate: '', releasedate: '',
  } as PlanetData))
  
  const allStars = [sun, ...stars]
  const allPlanets = [...planets, ...solarPlanets]

  console.log('🔗 Matching planets to stars...')
  const systems: StarSystemData[] = allStars.map(star => {
    const starPlanets = allPlanets.filter(planet => matchPlanetToStar(planet, star).matched)
    
    return {
      id: star.id,
      name: star.name,
      ra: star.ra,
      dec: star.dec,
      dist: star.dist,
      mag: star.mag,
      spect: star.spect,
      x: star.x,
      y: star.y,
      z: star.z,
      color: getStarColor(star.spect),
      planets: starPlanets,
    }
  })

  console.log('💾 Writing systems.json...')
  fs.writeFileSync(outputPath, JSON.stringify(systems), 'utf-8')
  
  console.log(`✅ Successfully built systems.json with ${systems.length} star systems!`)
}

buildSystems().catch(err => {
  console.error('❌ Build failed:', err)
  process.exit(1)
})