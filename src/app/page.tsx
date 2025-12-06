"use client";

import Link from "next/link";
import { Configurator } from "@/components/Configurator";
import { AnimatedSection } from "@/components/AnimatedSection";
import { AnimatedText } from "@/components/AnimatedText";
import { motion } from "framer-motion";
import { DesignIcon, InstallIcon, SupportIcon, ArrowRightIcon } from "@/components/icons/Icons";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type Lang = "ru" | "en" | "kk";

interface Service {
  title: string;
  desc: string;
  icon: string;
}

interface Solution {
  title: string;
  desc: string;
  tag: number; // base price in RUB, will be formatted to KZT at runtime
}

interface Texts {
  nav: { about: string; services: string; catalog: string; configurator: string };
  cta: { calc: string; startConfigurator: string; consultation: string };
  hero: { kicker: string; title1: string; titleHighlight: string; title2: string; description: string; stat1: string; stat2: string };
  sections: { aboutTitle: string; aboutText: string; servicesTitle: string; catalogTitle: string; configTitle: string; configText: string; contactsTitle: string; contactsText: string };
  services: Service[];
  solutions: Solution[];
  contactPlaceholders: { name: string; contact: string; object: string; description: string };
  contactButton: string;
  footer: { privacy: string; contacts: string; copyright: string };
  languageLabel: string;
  languageSwitch: string;
}

const texts: Record<Lang, Texts> = {
  ru: {
    nav: {
      about: "О компании",
      services: "Услуги",
      catalog: "Решения",
      configurator: "Конфигуратор"
    },
    cta: {
      calc: "Рассчитать умный дом",
      startConfigurator: "Запустить конфигуратор",
      consultation: "Заказать консультацию"
    },
    hero: {
      kicker: "Умный дом под ключ",
      title1: "Спроектируем и установим ",
      titleHighlight: "умный дом",
      title2: " под ваши сценарии жизни",
      description:
        "Подбор оборудования, проектирование, монтаж и обслуживание систем освещения, климата, безопасности и мультимедиа. Всё в одном приложении и с резервным ручным управлением.",
      stat1: "реализованных объектов",
      stat2: "года гарантии и сервис"
    },
    sections: {
      aboutTitle: "О компании",
      aboutText:
        "Мы проектируем и внедряем комплексные системы умного дома и умного офиса: от подбора оборудования под ваши задачи до монтажа, пусконаладки и долгосрочного обслуживания. Работаем с ведущими брендами, интегрируем решения с голосовыми ассистентами и уже существующей инженерией.",
      servicesTitle: "Услуги",
      catalogTitle: "Готовые решения",
      configTitle: "Онлайн‑конфигуратор умного дома",
      configText:
        "Ответьте на несколько вопросов — получите ориентировочную стоимость проекта и список оборудования. Сохраните конфигурацию и отправьте нам для детальной проработки.",
      contactsTitle: "Контакты",
      contactsText:
        "Оставьте контакты или пришлите план помещения — подготовим предварительный проект и коммерческое предложение."
    },
    services: [
      {
        title: "Проектирование",
        desc: "Разработка концепции, подбор оборудования, схемы размещения и подключений.",
        icon: "📐"
      },
      {
        title: "Монтаж и пусконаладка",
        desc: "Установка, настройка сценариев и обучение пользователей.",
        icon: "🔧"
      },
      {
        title: "Сервис и поддержка",
        desc: "Обслуживание, обновления, удалённый мониторинг и развитие системы.",
        icon: "🛡️"
      }
    ],
    solutions: [
      { title: "Квартира", desc: "Базовый набор освещения, климат‑контроль, безопасность для городской квартиры.", tag: 120000 },
      { title: "Коттедж", desc: "Расширенное управление светом, климатом, шторами, уличным освещением и доступом.", tag: 320000 },
      { title: "Офис", desc: "Сценарное освещение, контроль доступа, климат и мультимедиа для переговорных.", tag: 280000 }
    ],
    contactPlaceholders: {
      name: "Имя",
      contact: "Телефон или e‑mail",
      object: "Город, тип объекта, площадь",
      description: "Опишите задачи или пришлите ссылку на план помещения"
    },
    contactButton: "Отправить заявку",
    footer: {
      privacy: "Политика конфиденциальности",
      contacts: "WhatsApp / Telegram / Телефон",
      copyright: "Все права защищены."
    },
    languageLabel: "RU",
    languageSwitch: "EN"
  },
  en: {
    nav: {
      about: "About",
      services: "Services",
      catalog: "Solutions",
      configurator: "Configurator"
    },
    cta: {
      calc: "Calculate smart home",
      startConfigurator: "Start configurator",
      consultation: "Request consultation"
    },
    hero: {
      kicker: "Turn‑key smart home",
      title1: "We design and install a ",
      titleHighlight: "smart home",
      title2: " tailored to your lifestyle",
      description:
        "Equipment selection, design, installation and maintenance of lighting, climate, security and multimedia systems. Everything in one app with backup manual control.",
      stat1: "completed projects",
      stat2: "years of warranty and service"
    },
    sections: {
      aboutTitle: "About the company",
      aboutText:
        "We design and implement comprehensive smart home and smart office systems: from equipment selection to installation, commissioning and long‑term service. We work with leading brands and integrate with voice assistants and existing engineering systems.",
      servicesTitle: "Services",
      catalogTitle: "Ready‑made solutions",
      configTitle: "Online smart home configurator",
      configText:
        "Answer a few questions to get an approximate project cost and equipment list. Save the configuration and send it to us for a detailed proposal.",
      contactsTitle: "Contacts",
      contactsText:
        "Leave your contacts or send us a floor plan — we will prepare a preliminary design and commercial offer."
    },
    solutions: [
      { title: "Apartment", desc: "Basic lighting, climate control and security package for city apartments.", tag: 120000 },
      { title: "House", desc: "Extended control of lighting, climate, shades, outdoor lights and access.", tag: 320000 },
      { title: "Office", desc: "Scene lighting, access control, climate and multimedia for meeting rooms.", tag: 280000 }
    ],
    services: [
      { title: "Design", desc: "Concept development, equipment selection, layouts and wiring.", icon: "📐" },
      { title: "Installation & Setup", desc: "Installation, scenario setup and user training.", icon: "🔧" },
      { title: "Service & Support", desc: "Maintenance, updates, remote monitoring and system evolution.", icon: "🛡️" }
    ],
    contactPlaceholders: {
      name: "Name",
      contact: "Phone or e‑mail",
      object: "City, object type, area",
      description: "Describe tasks or attach a plan link"
    },
    contactButton: "Send request",
    footer: { privacy: "Privacy policy", contacts: "WhatsApp / Telegram / Phone", copyright: "All rights reserved." },
    languageLabel: "EN",
    languageSwitch: "RU",
  },
  kk: {
    nav: { about: "Компания туралы", services: "Қызметтер", catalog: "Шешімдер", configurator: "Конфигуратор" },
    cta: { calc: "Ақылды үйді есептеу", startConfigurator: "Конфигураторды бастау", consultation: "Кеңес сұрау" },
    hero: {
      kicker: "Толықтай ақылды үй",
      title1: "Ақылды үй —",
      titleHighlight: "сіздің сценарийіңіз",
      title2: " үшін",
      description: "Жабдық, жобалау, орнату және қызмет. Бір қолданбада, қолмен басқару сақталған.",
      stat1: "жоба орындалды",
      stat2: "кепілдік және сервис"
    },
    sections: {
      aboutTitle: "Компания туралы",
      aboutText: "Ақылды үй жүйелерін жобалаймыз: жабдық таңдау, монтаж және техникалық қызмет.",
      servicesTitle: "Қызметтер",
      catalogTitle: "Дайын шешімдер",
      configTitle: "Онлайн ақылды үй конфигураторы",
      configText: "Сұраққа жауап беріңіз — бағасы мен жабдық тізімін алыңыз. Сақтап бізге жіберіңіз.",
      contactsTitle: "Байланыс",
      contactsText: "Байланыс мәліметін қалдырыңыз — жоба және ұсыныс дайындап береміз."
    },
    services: [
      { title: "Жобалау", desc: "Жабдық таңдау, схемалар.", icon: "📐" },
      { title: "Орнату", desc: "Монтаж, сценарийлер, оқыту.", icon: "🔧" },
      { title: "Қызмет", desc: "Техникалық қызмет және қолдау.", icon: "🛡️" }
    ],
    solutions: [
      { title: "Пәтер", desc: "Жарық, климат, қауіпсіздік.", tag: 120000 },
      { title: "Үй", desc: "Барлық жүйелер толықтай интеграцияланған.", tag: 320000 },
      { title: "Офис", desc: "Сценарийлі жарықтандыру және климат.", tag: 280000 }
    ],
    contactPlaceholders: { name: "Аты", contact: "Телефон", object: "Қала, өлшемі", description: "Сипаттама немесе жоспар" },
    contactButton: "Жіберу",
    footer: { privacy: "Құпиялылық", contacts: "WhatsApp / Telegram", copyright: "Құқықтар қорғалған." },
    languageLabel: "KZ",
    languageSwitch: "RU"
  }
};

// Conversion rate (approx) RUB -> KZT. Adjust if needed.
const RUB_TO_KZT = 5.6;

function formatPriceRubToKzt(amountRub: number, lang: Lang) {
  const amountKzt = Math.round(amountRub * RUB_TO_KZT);
  const locale = lang === "en" ? "en-US" : lang === "kk" ? "kk-KZ" : "ru-RU";
  return new Intl.NumberFormat(locale, { style: "currency", currency: "KZT", maximumFractionDigits: 0 }).format(amountKzt);
}

export default function HomePage() {
  const searchParams = useSearchParams();
  const lang: Lang = searchParams?.get("lang") === "en" ? "en" : searchParams?.get("lang") === "kk" ? "kk" : "ru";
  const t = texts[lang];
  const langOrder: Lang[] = ["ru", "en", "kk"];
  const nextLang = langOrder[(langOrder.indexOf(lang) + 1) % langOrder.length];
  const nextLabel = texts[nextLang].languageLabel;
  const [scrolled, setScrolled] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", contact: "", object: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          name: contactForm.name,
          contact: contactForm.contact,
          object: contactForm.object,
          description: contactForm.description
        })
      });

      if (response.ok) {
        setSubmitMessage({ type: "success", text: lang === "ru" ? "Спасибо! Ваша заявка отправлена." : lang === "en" ? "Thank you! Your request has been sent." : "Рахмет! Сіздің сұрау жіберілді." });
        setContactForm({ name: "", contact: "", object: "", description: "" });
      } else {
        setSubmitMessage({ type: "error", text: lang === "ru" ? "Ошибка при отправке. Попробуйте позже." : lang === "en" ? "Error sending request. Try later." : "Жіберу кезінде қате. Кейінірек әрекет қойыңыз." });
      }
    } catch (error) {
      setSubmitMessage({ type: "error", text: lang === "ru" ? "Ошибка при отправке. Попробуйте позже." : lang === "en" ? "Error sending request. Try later." : "Жіберу кезінде қате. Кейінірек әрекет қойыңыз." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-[#0a0a0f] text-[#f5f5f5]">
      {/* Premium Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-strong border-b border-white/10 py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center text-2xl font-bold text-[#0a0a0f] shadow-lg shadow-emerald-500/30">
                S
              </div>
              <div className="absolute inset-0 rounded-xl gradient-primary opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-wider text-white">
                SunWell
              </span>
              <span className="text-[10px] text-[#94a3b8] leading-tight">
                {lang === "ru"
                  ? "Интеллектуальные системы"
                  : "Intelligent systems"}
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: "#about", label: t.nav.about },
              { href: "#services", label: t.nav.services },
              { href: "#catalog", label: t.nav.catalog },
              { href: "#configurator", label: t.nav.configurator }
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-[#cbd5e1] hover:text-white transition-colors duration-300 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="glass rounded-full px-3 py-1.5 flex items-center gap-2 text-xs">
              {(["ru", "en", "kk"] as Lang[]).map((code, idx) => (
                <span key={code} className="inline-flex items-center">
                  <Link
                    href={`?lang=${code}`}
                    className={`px-2 py-0.5 rounded-md transition-colors text-sm font-medium ${lang === code ? 'text-emerald-400 bg-white/5' : 'text-[#94a3b8] hover:text-emerald-300'}`}
                    aria-current={lang === code ? 'page' : undefined}
                  >
                    {code === 'ru' ? 'RU' : code === 'en' ? 'EN' : 'KZ'}
                  </Link>
                  {idx < 2 && <span className="text-[#475569] mx-1">/</span>}
                </span>
              ))}
            </div>
            <Link
              href="#configurator"
              className="btn-primary text-sm font-semibold hidden sm:inline-flex"
            >
              {t.cta.calc}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-32">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0f172a] to-[#0a0a0f]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent_50%)]"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs font-semibold text-emerald-400 w-fit"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-2 w-2 rounded-full bg-emerald-400"
              ></motion.span>
              {t.hero.kicker}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="heading-premium text-5xl md:text-6xl lg:text-7xl text-white leading-tight"
            >
              {t.hero.title1}
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-gradient block"
              >
                {t.hero.titleHighlight}
              </motion.span>
              {t.hero.title2}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg text-[#cbd5e1] leading-relaxed max-w-2xl"
            >
              {t.hero.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap gap-4 items-center"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Link href="#configurator" className="btn-primary">
                  {t.cta.startConfigurator}
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Link href="#contact" className="btn-secondary">
                  {t.cta.consultation}
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex gap-12 pt-8"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="text-4xl font-bold text-white mb-1"
                >
                  50+
                </motion.div>
                <div className="text-sm text-[#94a3b8]">{t.hero.stat1}</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="text-4xl font-bold text-white mb-1"
                >
                  3
                </motion.div>
                <div className="text-sm text-[#94a3b8]">{t.hero.stat2}</div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:block hidden"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="card-premium glow-emerald-strong p-8"
            >
              <Configurator />
            </motion.div>
            <motion.div
              animate={{
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-3xl blur-2xl -z-10"
            ></motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="section-spacing relative bg-gradient-to-b from-[#0a0a0f] to-[#0f172a]"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection direction="up" className="max-w-4xl">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="heading-premium text-4xl md:text-5xl text-white mb-6"
            >
              {t.sections.aboutTitle}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-[#cbd5e1] leading-relaxed"
            >
              {t.sections.aboutText}
            </motion.p>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="section-spacing relative bg-[#0f172a]"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection direction="up">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="heading-premium text-4xl md:text-5xl text-white mb-16"
            >
              {t.sections.servicesTitle}
            </motion.h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8">
            {t.services.map((item: Service, idx: number) => (
              <AnimatedSection
                key={item.title}
                direction="up"
                delay={idx * 0.1}
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="card-premium group"
                >
                  <motion.div
                    whileHover={{ scale: 1.06 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="mb-4"
                  >
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-lg text-[#0a0a0f] shadow-lg shadow-emerald-500/30">
                      {(() => {
                        if (item.title.toLowerCase().includes('design') || item.title.toLowerCase().includes('проект')) return <DesignIcon className="w-6 h-6 text-[#0a0a0f]" />;
                        if (item.title.toLowerCase().includes('install') || item.title.toLowerCase().includes('монтаж')) return <InstallIcon className="w-6 h-6 text-[#0a0a0f]" />;
                        return <SupportIcon className="w-6 h-6 text-[#0a0a0f]" />;
                      })()}
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[#cbd5e1] leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section
        id="catalog"
        className="section-spacing relative bg-gradient-to-b from-[#0f172a] to-[#0a0a0f]"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection direction="up">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="heading-premium text-4xl md:text-5xl text-white mb-16"
            >
              {t.sections.catalogTitle}
            </motion.h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8">
            {t.solutions.map((item: Solution, idx: number) => (
              <AnimatedSection
                key={item.title}
                direction="scale"
                delay={idx * 0.15}
              >
                <motion.div
                  whileHover={{ y: -10, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="card-premium group flex flex-col"
                >
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-[#cbd5e1] mb-6 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-sm"
                    >
                      {formatPriceRubToKzt(item.tag, lang)}
                    </motion.span>
                    <motion.div whileHover={{ x: 5 }}>
                      <Link
                        href="#configurator"
                        className="text-emerald-400 hover:text-emerald-300 font-medium text-sm flex items-center gap-2 group/link"
                      >
                        Настроить
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="inline-block"
                        >
                          <ArrowRightIcon className="w-4 h-4" />
                        </motion.span>
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Configurator Section */}
      <section
        id="configurator"
        className="section-spacing relative bg-[#0a0a0f]"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection direction="up" className="max-w-3xl mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="heading-premium text-4xl md:text-5xl text-white mb-6"
            >
              {t.sections.configTitle}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-[#cbd5e1] leading-relaxed"
            >
              {t.sections.configText}
            </motion.p>
          </AnimatedSection>
          <AnimatedSection direction="scale" delay={0.3}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="card-premium glow-emerald-strong max-w-5xl mx-auto"
            >
              <Configurator />
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="section-spacing relative bg-gradient-to-b from-[#0a0a0f] to-[#0f172a]"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection direction="up" className="max-w-3xl mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="heading-premium text-4xl md:text-5xl text-white mb-6"
            >
              {t.sections.contactsTitle}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-[#cbd5e1] leading-relaxed"
            >
              {t.sections.contactsText}
            </motion.p>
          </AnimatedSection>
          <AnimatedSection direction="scale" delay={0.3}>
            <motion.form
              onSubmit={handleContactSubmit}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card-premium max-w-3xl space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <motion.input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="glass rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-white placeholder:text-[#64748b] focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50"
                  placeholder={t.contactPlaceholders.name}
                  disabled={isSubmitting}
                />
                <motion.input
                  type="text"
                  required
                  value={contactForm.contact}
                  onChange={(e) => setContactForm({ ...contactForm, contact: e.target.value })}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="glass rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-white placeholder:text-[#64748b] focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50"
                  placeholder={t.contactPlaceholders.contact}
                  disabled={isSubmitting}
                />
              </div>
              <motion.input
                type="text"
                required
                value={contactForm.object}
                onChange={(e) => setContactForm({ ...contactForm, object: e.target.value })}
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="glass rounded-xl border border-white/10 bg-white/5 px-4 py-4 w-full text-white placeholder:text-[#64748b] focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50"
                placeholder={t.contactPlaceholders.object}
                disabled={isSubmitting}
              />
              <motion.textarea
                required
                value={contactForm.description}
                onChange={(e) => setContactForm({ ...contactForm, description: e.target.value })}
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="glass rounded-xl border border-white/10 bg-white/5 px-4 py-4 w-full min-h-[120px] text-white placeholder:text-[#64748b] focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none disabled:opacity-50"
                placeholder={t.contactPlaceholders.description}
                disabled={isSubmitting}
              />
              {submitMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl ${submitMessage.type === "success" ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-300" : "bg-red-500/20 border border-red-500/50 text-red-300"}`}
                >
                  {submitMessage.text}
                </motion.div>
              )}
              <motion.button
                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (lang === "ru" ? "Отправка..." : lang === "en" ? "Sending..." : "Жіберу...") : t.contactButton}
              </motion.button>
            </motion.form>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0f] border-t border-white/10 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="text-sm text-[#64748b]">
            © {new Date().getFullYear()} SunWell. {t.footer.copyright}
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-[#64748b]">
            <a href="#" className="hover:text-emerald-400 transition-colors">
              {t.footer.privacy}
            </a>
            <span className="text-[#475569]">{t.footer.contacts}</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
