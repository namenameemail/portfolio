import { AimMenu } from '../components/aim-menu/AimMenu'
import { NoiseFrame } from '../components/noise-frame/NoiseFrame'
import { About } from '../sections/About'
import { Contact } from '../sections/Contact'
import { Hero } from '../sections/Hero'
import { Projects } from '../sections/Projects'

export function App() {
  return (
    <NoiseFrame>
      <AimMenu devMode>
        <main>
          <Hero />
          <About />
          <Projects />
          <Contact />
        </main>
      </AimMenu>
    </NoiseFrame>
  )
}
