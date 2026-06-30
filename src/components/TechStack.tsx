import SectionHeader from './SectionHeader'
import SectionCard from './SectionCard'
import { 
  FaReact, FaNodeJs, FaPython, FaAws, FaMicrosoft 
} from 'react-icons/fa'
import { 
  SiNextdotjs, SiFlutter, SiGooglecloud, SiMongodb, SiTypescript 
} from 'react-icons/si'

const techList = [
  { name: 'React', icon: FaReact, color: '#61DAFB', glowClass: 'hover:border-[#61DAFB]/70 hover:shadow-[0_0_15px_rgba(97,218,251,0.4)]' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#FFFFFF', glowClass: 'hover:border-white/70 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]' },
  { name: 'Node.js', icon: FaNodeJs, color: '#68A063', glowClass: 'hover:border-[#68A063]/70 hover:shadow-[0_0_15px_rgba(104,160,99,0.4)]' },
  { name: 'Python', icon: FaPython, color: '#3776AB', glowClass: 'hover:border-[#3776AB]/70 hover:shadow-[0_0_15px_rgba(55,118,171,0.4)]' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6', glowClass: 'hover:border-[#3178C6]/70 hover:shadow-[0_0_15px_rgba(49,120,198,0.4)]' },
  { name: 'Flutter', icon: SiFlutter, color: '#02569B', glowClass: 'hover:border-[#02569B]/70 hover:shadow-[0_0_15px_rgba(2,86,155,0.4)]' },
  { name: 'MongoDB', icon: SiMongodb, color: '#47A248', glowClass: 'hover:border-[#47A248]/70 hover:shadow-[0_0_15px_rgba(71,162,72,0.4)]' },
  { name: 'AWS Cloud', icon: FaAws, color: '#FF9900', glowClass: 'hover:border-[#FF9900]/70 hover:shadow-[0_0_15px_rgba(255,153,0,0.4)]' },
  { name: 'Google Cloud', icon: SiGooglecloud, color: '#4285F4', glowClass: 'hover:border-[#4285F4]/70 hover:shadow-[0_0_15px_rgba(66,133,244,0.4)]' },
  { name: 'Azure Cloud', icon: FaMicrosoft, color: '#0078D4', glowClass: 'hover:border-[#0078D4]/70 hover:shadow-[0_0_15px_rgba(0,120,212,0.4)]' },
]

export default function TechStack() {
  // Duplicate list to create a seamless infinite marquee effect
  const marqueeItems = [...techList, ...techList]

  return (
    <section className="relative py-8 px-4">
      {/* Inline styles for custom marquee keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .marquee-wrapper:hover .marquee-track {
          animation-play-state: paused;
        }
        .marquee-track {
          animation: marquee 25s linear infinite;
        }
      `}} />

      <div className="mx-auto max-w-6xl">
        <SectionCard className="overflow-hidden">
          <SectionHeader id="tech" kicker="Core Competency" title="Stacks We Wield" subtitle="Cutting-edge technologies and platforms powering our digital engineering workflows." />
          
          <div className="mt-8 relative w-full marquee-wrapper overflow-hidden select-none">
            {/* Soft fade gradients on edges */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#080810] to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#080810] to-transparent z-10" />

            <div className="flex w-max gap-5 py-4 marquee-track">
              {marqueeItems.map((tech, idx) => {
                const Icon = tech.icon
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3.5 px-6 py-4 rounded-xl border border-white/10 bg-white/5 whitespace-nowrap transition-all duration-300 hover:bg-white/10 ${tech.glowClass}`}
                  >
                    <Icon 
                      size={24} 
                      style={{ color: tech.color }} 
                      className="shrink-0 transition-transform duration-300 group-hover:scale-110" 
                    />
                    <span className="font-semibold text-white tracking-wide text-sm">
                      {tech.name}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </SectionCard>
      </div>
    </section>
  )
}
