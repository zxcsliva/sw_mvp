"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BoltIcon, StarIcon, CrownIcon } from "@/components/icons/Icons";
import dynamic from "next/dynamic";

const Home3DViewer = dynamic(
  () => import("./Home3DViewer").then((mod) => mod.Home3DViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Загрузка 3D...</div>
      </div>
    )
  }
);

type ObjectType = "apartment" | "house" | "office";

type ZoneKey =
  | "living"
  | "bedroom"
  | "kitchen"
  | "bathroom"
  | "hallway"
  | "outdoor"
  | "officeArea";

type FeatureKey = "light" | "climate" | "security" | "shades" | "multimedia";

interface StepState {
  objectType: ObjectType | "";
  area: number | "";
  rooms: number | "";
  stage: "build" | "renovation" | "ready" | "";
  zones: Record<ZoneKey, boolean>;
  features: Record<FeatureKey, boolean>;
  level: "basic" | "optimal" | "premium" | "";
}

const initialState: StepState = {
  objectType: "",
  area: "",
  rooms: "",
  stage: "",
  zones: {
    living: true,
    bedroom: true,
    kitchen: true,
    bathroom: false,
    hallway: true,
    outdoor: false,
    officeArea: false
  },
  features: {
    light: true,
    climate: true,
    security: true,
    shades: false,
    multimedia: false
  },
  level: ""
};

const levelMultipliers: Record<"basic" | "optimal" | "premium", number> = {
  basic: 1,
  optimal: 1.35,
  premium: 1.8
};

interface Estimate {
  total: number;
  equipment: number;
  works: number;
  commissioning: number;
}

// Conversion utility (moved outside to be accessible by all step components)
function formatKZT(amountRub: number, lang: "ru" | "en" | "kk") {
  const RUB_TO_KZT = 5.6;
  const amountKzt = Math.round(amountRub * RUB_TO_KZT);
  const locale = lang === "en" ? "en-US" : lang === "kk" ? "kk-KZ" : "ru-RU";
  return new Intl.NumberFormat(locale, { style: "currency", currency: "KZT", maximumFractionDigits: 0 }).format(amountKzt);
}

export function Configurator() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<StepState>(initialState);
  const [show3D, setShow3D] = useState(false);
  const searchParams = useSearchParams();
  const lang = searchParams?.get("lang") === "en" ? "en" : searchParams?.get("lang") === "kk" ? "kk" : "ru" as "ru" | "en" | "kk";

  const canGoNext = useMemo(() => {
    if (step === 1) {
      return Boolean(state.objectType && state.area && state.rooms && state.stage);
    }
    if (step === 2) {
      return (
        Object.values(state.zones).some(Boolean) &&
        Object.values(state.features).some(Boolean)
      );
    }
    if (step === 3) {
      return Boolean(state.level);
    }
    return true;
  }, [step, state]);

  const estimate = useMemo(() => {
    if (!state.objectType || !state.area || !state.rooms || !state.level) {
      return null;
    }

    const activeZones = Object.values(state.zones).filter(Boolean).length || 1;
    const activeFeatures = Object.values(state.features).filter(Boolean).length || 1;

    const basePerM2 =
      state.objectType === "apartment"
        ? 4500
        : state.objectType === "house"
        ? 5200
        : 4800;

    const complexity =
      1 +
      (activeZones - 3) * 0.04 +
      (activeFeatures - 3) * 0.08 +
      (state.stage === "ready" ? 0.15 : 0);

    const multiplier = levelMultipliers[state.level];
    const total = Math.round(basePerM2 * Number(state.area) * complexity * multiplier);

    const equipment = Math.round(total * 0.62);
    const works = Math.round(total * 0.26);
    const commissioning = Math.round(total * 0.12);

    return {
      total,
      equipment,
      works,
      commissioning
    };
  }, [state]);

  const summary = useMemo(() => {
    if (!estimate) return null;
    const typeLabel =
      state.objectType === "apartment"
        ? "квартиры"
        : state.objectType === "house"
        ? "дома"
        : "офиса";

    const levelLabel =
      state.level === "basic"
        ? "Базовый"
        : state.level === "optimal"
        ? "Оптимальный"
        : "Премиум";

    return {
      title: `Оценка проекта умного дома для ${typeLabel} ${state.area} м²`,
      levelLabel
    };
  }, [estimate, state.area, state.level, state.objectType]);

  const toggleZone = (key: ZoneKey) => {
    setState((prev) => ({
      ...prev,
      zones: { ...prev.zones, [key]: !prev.zones[key] }
    }));
  };

  const toggleFeature = (key: FeatureKey) => {
    setState((prev) => ({
      ...prev,
      features: { ...prev.features, [key]: !prev.features[key] }
    }));
  };

  const changeLevel = (level: StepState["level"]) => {
    setState((prev) => ({ ...prev, level }));
  };

  const goNext = () => {
    if (!canGoNext) return;
    setStep((s) => Math.min(4, s + 1));
  };

  const goPrev = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const reset = () => {
    setState(initialState);
    setStep(1);
  };

  return (
    <div className="space-y-6 text-[#f5f5f5]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">
            Быстрый расчёт умного дома
          </h3>
          <p className="text-sm text-[#94a3b8]">
            Шаг {step} из 4
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full gradient-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(step / 4) * 100}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="h-full w-full shimmer"></div>
        </motion.div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Step1 state={state} setState={setState} />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <Step2
                  state={state}
                  toggleZone={toggleZone}
                  toggleFeature={toggleFeature}
                />
              </div>
              <button
                type="button"
                onClick={() => setShow3D(true)}
                className="w-full px-4 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 font-medium hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Показать 3D Визуализацию
              </button>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <Step3 state={state} changeLevel={changeLevel} />
              </div>
              <button
                type="button"
                onClick={() => setShow3D(true)}
                className="w-full px-4 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 font-medium hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Показать 3D Визуализацию
              </button>
            </motion.div>
          )}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <Step4 estimate={estimate} summary={summary} lang={lang} state={state} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D Viewer Modal Overlay */}
        <AnimatePresence>
          {show3D && (step === 2 || step === 3) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShow3D(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setShow3D(false)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {/* 3D Viewer Content */}
                <Home3DViewer
                  objectType={state.objectType}
                  zones={state.zones}
                  features={state.features}
                  level={state.level}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-[#cbd5e1] hover:bg-white/10 hover:border-white/20 transition-all"
        >
          Сбросить
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={step === 1}
            className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-[#cbd5e1] hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Назад
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext}
            className="btn-primary px-6 py-2.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
          >
            {step === 4 ? "Оставить заявку" : "Далее"}
          </button>
        </div>
      </div>

      {/* Estimate Preview */}
      {estimate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-emerald-300">
              Ориентировочная стоимость проекта
            </div>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="text-2xl font-bold text-white"
            >
              {formatKZT(estimate.total)}
            </motion.div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs text-[#cbd5e1]">
            <div>
              <div className="text-[10px] text-[#94a3b8] mb-1">Оборудование</div>
                <div className="font-semibold text-white">
                  {formatKZT(estimate.equipment)}
                </div>
            </div>
            <div>
              <div className="text-[10px] text-[#94a3b8] mb-1">Монтаж</div>
                <div className="font-semibold text-white">
                  {formatKZT(estimate.works)}
                </div>
            </div>
            <div>
              <div className="text-[10px] text-[#94a3b8] mb-1">Пусконаладка</div>
                <div className="font-semibold text-white">
                  {formatKZT(estimate.commissioning)}
                </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-emerald-500/20 text-[11px] text-emerald-200/80">
            Расчёт предварительный. Точная стоимость зависит от выбранных брендов,
            дизайна устройств и особенностей объекта.
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface StepProps {
  state: StepState;
  setState?: React.Dispatch<React.SetStateAction<StepState>>;
}

function Step1({ state, setState }: StepProps) {
  if (!setState) return null;
  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold text-white mb-6">
        Основная информация об объекте
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-[#cbd5e1]">
            Тип объекта
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: "apartment", label: "Квартира" },
              { key: "house", label: "Дом" },
              { key: "office", label: "Офис" }
            ].map((item) => (
              <motion.button
                key={item.key}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    objectType: item.key as ObjectType
                  }))
                }
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  state.objectType === item.key
                    ? "gradient-primary text-[#0a0a0f] shadow-lg shadow-emerald-500/30"
                    : "bg-white/5 border border-white/10 text-[#cbd5e1] hover:bg-white/10 hover:border-white/20"
                }`}
                animate={{
                  scale: state.objectType === item.key ? 1.05 : 1
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-[#cbd5e1]">
            Площадь, м²
          </label>
          <input
            type="number"
            min={20}
            max={1000}
            value={state.area}
            onChange={(e) =>
              setState((prev) => ({
                ...prev,
                area: e.target.value ? Number(e.target.value) : ""
              }))
            }
            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-[#64748b] focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            placeholder="Например, 80"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-[#cbd5e1]">
            Количество комнат
          </label>
          <input
            type="number"
            min={1}
            max={20}
            value={state.rooms}
            onChange={(e) =>
              setState((prev) => ({
                ...prev,
                rooms: e.target.value ? Number(e.target.value) : ""
              }))
            }
            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-[#64748b] focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            placeholder="Например, 3"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-[#cbd5e1]">
            Стадия объекта
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: "build", label: "Строится" },
              { key: "renovation", label: "Ремонт" },
              { key: "ready", label: "Готовый" }
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    stage: item.key as StepState["stage"]
                  }))
                }
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  state.stage === item.key
                    ? "gradient-primary text-[#0a0a0f] shadow-lg shadow-emerald-500/30 scale-105"
                    : "bg-white/5 border border-white/10 text-[#cbd5e1] hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface Step2Props {
  state: StepState;
  toggleZone: (key: ZoneKey) => void;
  toggleFeature: (key: FeatureKey) => void;
}

function Step2({ state, toggleZone, toggleFeature }: Step2Props) {
  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold text-white mb-6">
        Зоны и сценарии управления
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-[#cbd5e1]">
            Зоны
          </label>
          <div className="flex flex-wrap gap-3">
            {[
              { key: "living", label: "Гостиная" },
              { key: "bedroom", label: "Спальни" },
              { key: "kitchen", label: "Кухня" },
              { key: "bathroom", label: "Санузлы" },
              { key: "hallway", label: "Холл / коридор" },
              { key: "outdoor", label: "Улица / двор" },
              { key: "officeArea", label: "Рабочая зона" }
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleZone(item.key as ZoneKey)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  state.zones[item.key as ZoneKey]
                    ? "gradient-primary text-[#0a0a0f] shadow-lg shadow-emerald-500/30"
                    : "bg-white/5 border border-white/10 text-[#cbd5e1] hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-[#cbd5e1]">
            Функции
          </label>
          <div className="flex flex-wrap gap-3">
            {[
              { key: "light", label: "Освещение" },
              { key: "climate", label: "Климат" },
              { key: "security", label: "Безопасность" },
              { key: "shades", label: "Шторы" },
              { key: "multimedia", label: "Мультимедиа" }
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleFeature(item.key as FeatureKey)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  state.features[item.key as FeatureKey]
                    ? "gradient-primary text-[#0a0a0f] shadow-lg shadow-emerald-500/30"
                    : "bg-white/5 border border-white/10 text-[#cbd5e1] hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-200/90">
        При необходимости мы предложим дополнительные элементы (резервное
        управление, серверное оборудование, ИБП) на этапе детального проекта.
      </div>
    </div>
  );
}

interface Step3Props {
  state: StepState;
  changeLevel: (level: StepState["level"]) => void;
}

function Step3({ state, changeLevel }: Step3Props) {
  const cards: {
    key: StepState["level"];
    title: string;
    subtitle: string;
    description: string;
    tags: string[];
    icon: string;
  }[] = [
    {
      key: "basic",
      title: "Базовый",
      subtitle: "Функциональный старт",
      description:
        "Основные сценарии света, климата и безопасности с надёжными брендами среднего ценового сегмента.",
      tags: ["оптимальный бюджет", "массовые серии", "расширяемая система"],
      icon: "basic"
    },
    {
      key: "optimal",
      title: "Оптимальный",
      subtitle: "Баланс дизайна и возможностей",
      description:
        "Расширенный функционал, более гибкие сценарии и более премиальные устройства управления.",
      tags: ["дизайнерские панели", "расширенные сценарии", "высокая надёжность"],
      icon: "optimal"
    },
    {
      key: "premium",
      title: "Премиум",
      subtitle: "Максимальный комфорт",
      description:
        "Дизайнерские решения, глубокая интеграция с инженерией и мультимедиа, кастомные сценарии.",
      tags: ["дизайн‑серии", "минимум видимой автоматики", "кастомные сценарии"],
      icon: "premium"
    }
  ];

  return (
      <div className="space-y-6">
      <div className="text-lg font-semibold text-white mb-6">
        Уровень системы и брендов
      </div>
      <div className="grid gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <button
            key={card.key}
            type="button"
            onClick={() => changeLevel(card.key)}
            className={`group relative flex flex-col rounded-2xl border p-8 text-left transition-all duration-300 min-h-[360px] md:min-h-[380px] ${
              state.level === card.key
                ? "border-emerald-500/50 bg-emerald-500/10 shadow-lg shadow-emerald-500/20 scale-105"
                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
            }`}
            style={{ zIndex: 10, minWidth: 260 }}
          >
            <div className="mb-4 transform group-hover:scale-105 transition-transform flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-2xl text-[#10b981]">
                {(() => {
                  if (card.icon === 'basic') return <BoltIcon className="w-7 h-7 text-[#10b981]" />;
                  if (card.icon === 'optimal') return <StarIcon className="w-7 h-7 text-[#10b981]" />;
                  return <CrownIcon className="w-7 h-7 text-[#10b981]" />;
                })()}
              </div>
              <div>
                <div className="text-2xl font-bold text-white leading-tight">{card.title}</div>
                <div className="text-sm text-emerald-400 mt-1 font-medium">{card.subtitle}</div>
              </div>
            </div>
            <p className="text-sm text-[#cbd5e1] mb-6 leading-relaxed">
              {card.description}
            </p>
            <div className="mt-auto flex flex-wrap gap-3">
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-lg bg-white/5 text-sm text-[#cbd5e1] border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
            {state.level === card.key && (
              <div className="absolute top-4 right-4">
                <div className="h-6 w-6 rounded-full gradient-primary flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-[#0a0a0f]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

interface Estimate {
  total: number;
  equipment: number;
  works: number;
  commissioning: number;
}

interface Step4Props {
  estimate: Estimate | null;
  summary: { title: string; levelLabel: string } | null;
  lang: "ru" | "en" | "kk";
  state: StepState;
}

function Step4({ estimate, summary, lang, state }: Step4Props) {
  const [formData, setFormData] = useState({ name: "", contact: "", object: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "configurator",
          name: formData.name,
          contact: formData.contact,
          object: formData.object,
          description: formData.description,
          objectType: state.objectType,
          area: state.area,
          rooms: state.rooms,
          stage: state.stage,
          zones: state.zones,
          features: state.features,
          level: state.level,
          total: estimate?.total || 0,
          currency: "KZT"
        })
      });

      if (response.ok) {
        setSubmitMessage({ 
          type: "success", 
          text: lang === "ru" ? "Спасибо! Ваша заявка отправлена. Менеджер свяжется с вами скоро." : lang === "en" ? "Thank you! Your order has been sent." : "Рахмет! Сіздің тапсырыс жіберілді." 
        });
        setFormData({ name: "", contact: "", object: "", description: "" });
      } else {
        setSubmitMessage({ type: "error", text: lang === "ru" ? "Ошибка при отправке. Попробуйте позже." : lang === "en" ? "Error sending. Try later." : "Қате. Кейінірек әрекет қойыңыз." });
      }
    } catch (error) {
      setSubmitMessage({ type: "error", text: lang === "ru" ? "Ошибка при отправке. Попробуйте позже." : lang === "en" ? "Error sending. Try later." : "Қате. Кейінірек әрекет қойыңыз." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold text-white mb-6">
        Результат и отправка заявки
      </div>

      <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-xl">
        <div className="text-base font-bold text-white mb-4">
          {summary?.title ?? "Предварительная конфигурация"}
        </div>
        {estimate ? (
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-[#cbd5e1]">Общий ориентир:</span>
              <span className="text-3xl font-bold text-gradient">
                {formatKZT(estimate.total, lang)}
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-3 pt-4 border-t border-white/10">
              <div>
                <div className="text-xs text-[#94a3b8] mb-1">Оборудование</div>
                <div className="text-lg font-semibold text-white">
                  {formatKZT(estimate.equipment, lang)}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#94a3b8] mb-1">Монтаж</div>
                <div className="text-lg font-semibold text-white">
                  {formatKZT(estimate.works, lang)}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#94a3b8] mb-1">Пусконаладка</div>
                <div className="text-lg font-semibold text-white">
                  {formatKZT(estimate.commissioning, lang)}
                </div>
              </div>
            </div>
            <div className="text-sm text-[#94a3b8] pt-2">
              Уровень системы: <span className="text-emerald-400 font-medium">{summary?.levelLabel}</span>. Дальнейший расчёт выполняется
              инженером с учётом планов и выбранных брендов.
            </div>
          </div>
        ) : (
          <div className="text-sm text-[#94a3b8]">
            Заполните предыдущие шаги, чтобы увидеть ориентировочную стоимость.
          </div>
        )}
      </div>

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <div className="text-base font-bold text-white mb-4">
          Оставьте контакты для детального проекта
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isSubmitting}
              className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-[#64748b] focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50"
              placeholder="Имя"
            />
            <input
              type="text"
              required
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              disabled={isSubmitting}
              className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-[#64748b] focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50"
              placeholder="Телефон или e‑mail"
            />
            <input
              type="text"
              required
              value={formData.object}
              onChange={(e) => setFormData({ ...formData, object: e.target.value })}
              disabled={isSubmitting}
              className="md:col-span-2 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-[#64748b] focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50"
              placeholder="Город и удобное время связи"
            />
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isSubmitting}
              className="md:col-span-2 min-h-[100px] px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-[#64748b] focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none disabled:opacity-50"
              placeholder="Сюда можно вставить ссылку на план помещения или кратко описать задачи"
            />
          </div>
          {submitMessage && (
            <div className={`p-4 rounded-xl ${submitMessage.type === "success" ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-300" : "bg-red-500/20 border border-red-500/50 text-red-300"}`}>
              {submitMessage.text}
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-white/10">
            <div className="text-xs text-[#64748b]">
              Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-6 py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Отправка..." : "Получить детальное КП"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
