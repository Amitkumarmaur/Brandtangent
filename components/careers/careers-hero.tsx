"use client"

import {
  LayoutGroup,
  motion,
  useScroll,
  useTransform,
} from "motion/react"
import {
  ArrowRight,
  Briefcase,
  Globe,
  Heart,
  Sparkles,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { TextRotate } from "@/components/ui/text-rotate"
import { ElegantShapesBackground } from "@/components/landing/elegant-shapes"
import { GradientMesh } from "@/components/motion/gradient-mesh"
import CareersHeroShowcase from "@/components/careers/careers-hero-showcase"
import { filterOpenCareers, type CareerRow } from "@/lib/careers"

const highlights = [
  {
    icon: Globe,
    title: "Remote-first",
    body: "Work from anywhere — aligned time zones, async-friendly culture.",
  },
  {
    icon: Sparkles,
    title: "Creative ownership",
    body: "Shape brand strategy and creative that reaches real audiences.",
  },
  {
    icon: Heart,
    title: "People-first",
    body: "Clear expectations, respectful process, no surprise hoops.",
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      delay: 0.15 + i * 0.1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

type Props = {
  careers: CareerRow[]
}

export default function CareersHero({ careers }: Props) {
  const openCount = filterOpenCareers(careers).length
  const { scrollY } = useScroll()
  const meshOpacity = useTransform(scrollY, [0, 450], [1, 0.2])
  const contentY = useTransform(scrollY, [0, 600], [0, -70])
  const showcaseY = useTransform(scrollY, [0, 600], [0, 50])

  const stats = [
    { value: String(Math.max(openCount, 1)), label: "Open roles" },
    { value: "Remote", label: "Work setup" },
    { value: "100%", label: "Applications read" },
  ]

  return (
    <section className="relative min-h-[88vh] overflow-hidden border-t border-border bg-background pb-12 pt-28 sm:pt-32 lg:pt-36 md:pb-16">
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ opacity: meshOpacity }}
      >
        <GradientMesh />
      </motion.div>

      <ElegantShapesBackground />

      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden>
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(var(--hairline) 1px, transparent 1px),
              linear-gradient(90deg, var(--hairline) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div style={{ y: contentY }} className="text-left">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mb-6 inline-flex"
            >
              <span className="pill-tag inline-flex items-center gap-2">
                <Briefcase className="h-3 w-3 text-primary" strokeWidth={1.5} />
                Careers
              </span>
            </motion.div>

            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
              <h1 className="display-xxl mb-6 max-w-xl text-balance text-foreground">
                <span className="block">Build brands</span>
                <span className="block">that drive</span>
                <LayoutGroup>
                  <motion.span layout className="flex flex-wrap items-baseline gap-x-2">
                    <TextRotate
                      texts={["impact", "growth", "clarity", "results"]}
                      mainClassName="text-primary"
                      staggerDuration={0.02}
                      staggerFrom="last"
                      rotationInterval={2800}
                      transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    />
                  </motion.span>
                </LayoutGroup>
              </h1>
            </motion.div>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-subtitle mb-8 max-w-md"
            >
              We hire strategists, designers, and storytellers who care about brand
              outcomes — not templates. Send your resume; we read every submission.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mb-10 flex flex-col items-start gap-3 sm:flex-row"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" asChild>
                  <a href="#open-roles">
                    View open roles
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" variant="outline" asChild>
                  <a href="#apply">Apply now</a>
                </Button>
              </motion.div>
            </motion.div>

            <motion.ul
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mb-10 space-y-3"
            >
              {highlights.map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.li
                    key={item.title}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-normal text-foreground">{item.title}</p>
                      <p className="text-caption">{item.body}</p>
                    </div>
                  </motion.li>
                )
              })}
            </motion.ul>

            <motion.div
              custom={5}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-6 border-t border-border pt-6"
            >
              {stats.map(({ value, label }, i) => (
                <div key={label} className="flex items-center gap-6">
                  {i > 0 && <div className="hidden h-8 w-px bg-border sm:block" />}
                  <div>
                    <motion.p
                      className="tnum text-2xl font-light text-primary"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
                    >
                      {value}
                    </motion.p>
                    <p className="text-caption">{label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: showcaseY }}
            initial={{ opacity: 0, scale: 0.92, rotateY: -8 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <CareersHeroShowcase careers={careers} />

            <motion.div
              className="pointer-events-none absolute -left-6 -top-6 h-28 w-28 rounded-full bg-primary/15 blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.55, 0.3] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              aria-hidden
            />
            <motion.div
              className="pointer-events-none absolute -bottom-6 -right-6 h-36 w-36 rounded-full bg-[rgba(249,107,238,0.12)] blur-3xl"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.25, 0.5, 0.25] }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              aria-hidden
            />

            <motion.div
              className="glass absolute -top-4 right-4 flex items-center gap-2 rounded-full border border-border/60 px-3 py-1.5 shadow-[var(--shadow-1)]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Users className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] font-light text-foreground">
                Small team, big impact
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="hero-gradient pointer-events-none absolute bottom-0 left-0 right-0 h-20" />
    </section>
  )
}
