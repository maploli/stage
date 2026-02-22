import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sun, Coffee, Moon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useLanguage } from "@/context/LanguageContext";

export function ProgramSection() {
  const { t } = useLanguage();

  const program = [
    {
      day: t("program.day1.title"),
      date: t("program.day1.date"),
      events: [
        { time: "9h-13h", title: t("program.day1.event1"), icon: Sun },
        { time: "14h-18h", title: t("program.day1.event2"), icon: Coffee },
        { time: "19h-21h", title: t("program.day1.event3"), icon: Moon },
      ],
    },
    {
      day: t("program.day2.title"),
      date: t("program.day2.date"),
      events: [
        { time: "9h-13h", title: t("program.day2.event1"), icon: Sun },
        { time: "14h-18h", title: t("program.day2.event2"), icon: Coffee },
        { time: "19h-21h", title: t("program.day2.event3"), icon: Moon },
      ],
    },
    {
      day: t("program.day3.title"),
      date: t("program.day3.date"),
      events: [
        { time: "9h-13h", title: t("program.day3.event1"), icon: Sun },
        { time: "14h-18h", title: t("program.day3.event2"), icon: Coffee },
        { time: "19h-21h", title: t("program.day3.event3"), icon: Moon },
      ],
    },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">{t("nav.programme")}</Badge>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("program.title").replace("innovation", "")} <span className="text-primary">{t("program.title").includes("innovation") ? "innovation" : ""}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("program.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {program.map((day, dayIndex) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: dayIndex * 0.15 }}
              className="relative"
            >
              <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-elegant">
                {/* Header */}
                <div className="bg-primary p-6 text-primary-foreground">
                  <div className="font-display text-2xl font-bold">{day.day}</div>
                  <div className="text-primary-foreground/80">{day.date}</div>
                </div>

                {/* Events */}
                <div className="p-6 space-y-4">
                  {day.events.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="flex gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <event.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-accent mb-1">{event.time}</div>
                        <div className="text-sm font-medium text-foreground">{event.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg" asChild>
            <Link to="/programme">
              {t("hero.cta.program")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
