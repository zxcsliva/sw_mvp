import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

interface ContactFormData {
  type: "contact";
  name: string;
  contact: string;
  object: string;
  description: string;
}

interface ConfiguratorData {
  type: "configurator";
  name: string;
  contact: string;
  object: string;
  description: string;
  objectType: string;
  area: number;
  rooms: number;
  stage: string;
  zones: Record<string, boolean>;
  features: Record<string, boolean>;
  level: string;
  total: number;
  currency: string;
}

type RequestData = ContactFormData | ConfiguratorData;

function formatContactMessage(data: ContactFormData): string {
  return `
📋 <b>ЗАПРОС НА КОНСУЛЬТАЦИЮ</b>

👤 <b>Имя:</b> ${data.name}
📞 <b>Контакт:</b> ${data.contact}
🏢 <b>Объект:</b> ${data.object}
📝 <b>Описание:</b> ${data.description}
`;
}

function formatConfiguratorMessage(data: ConfiguratorData): string {
  const RUB_TO_KZT = 5.6;
  const totalKzt = Math.round(data.total * RUB_TO_KZT);
  
  const zoneNames: Record<string, string> = {
    living: "Гостиная",
    bedroom: "Спальня",
    kitchen: "Кухня",
    bathroom: "Ванная",
    hallway: "Коридор",
    outdoor: "Улица",
    officeArea: "Офис"
  };

  const featureNames: Record<string, string> = {
    light: "Освещение",
    climate: "Климат",
    security: "Безопасность",
    shades: "Шторы",
    multimedia: "Мультимедиа"
  };

  const stageNames: Record<string, string> = {
    build: "На этапе строительства",
    renovation: "На ремонт",
    ready: "Готовое помещение"
  };

  const objectNames: Record<string, string> = {
    apartment: "Квартира",
    house: "Дом",
    office: "Офис"
  };

  const selectedZones = Object.entries(data.zones)
    .filter(([_, v]) => v)
    .map(([k]) => zoneNames[k])
    .join(", ");

  const selectedFeatures = Object.entries(data.features)
    .filter(([_, v]) => v)
    .map(([k]) => featureNames[k])
    .join(", ");

  return `
🛍️ <b>ПРЕДВАРИТЕЛЬНЫЙ ЗАКАЗ</b>

👤 <b>Имя:</b> ${data.name}
📞 <b>Контакт:</b> ${data.contact}
🏢 <b>Объект:</b> ${data.object}
📝 <b>Описание:</b> ${data.description}

━━━━━━━━━━━━━━━━━━━━━━━━
📐 <b>КОНФИГУРАЦИЯ:</b>

🏠 <b>Тип объекта:</b> ${objectNames[data.objectType] || data.objectType}
📏 <b>Площадь:</b> ${data.area} м²
🚪 <b>Комнат:</b> ${data.rooms}
🔨 <b>Этап:</b> ${stageNames[data.stage] || data.stage}

🌍 <b>Зоны:</b> ${selectedZones || "Нет"}
⚙️ <b>Функции:</b> ${selectedFeatures || "Нет"}
💎 <b>Уровень:</b> ${data.level === "basic" ? "Базовый" : data.level === "optimal" ? "Оптимальный" : "Премиум"}

💰 <b>Сметная стоимость:</b> <code>${totalKzt.toLocaleString("ru-RU")} ${data.currency}</code>
`;
}

async function sendTelegramMessage(text: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text,
          parse_mode: "HTML"
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Telegram error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: RequestData = await request.json();

    let message = "";
    if (data.type === "contact") {
      message = formatContactMessage(data as ContactFormData);
    } else if (data.type === "configurator") {
      message = formatConfiguratorMessage(data as ConfiguratorData);
    } else {
      return NextResponse.json(
        { error: "Invalid request type" },
        { status: 400 }
      );
    }

    const success = await sendTelegramMessage(message);

    if (success) {
      return NextResponse.json(
        { success: true, message: "Message sent successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to send message" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
