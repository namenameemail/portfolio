import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { About } from '../sections/About'
import { Contact } from '../sections/Contact'
import { Hero } from '../sections/Hero'
import { Projects } from '../sections/Projects'

export function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
