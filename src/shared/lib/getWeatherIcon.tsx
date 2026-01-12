import {
  Sun,
  Moon,
  CloudRain,
  CloudSun,
  CloudMoon,
  Snowflake,
  CloudLightning,
} from "lucide-react";

/**
 * OpenWeatherMap 아이콘 코드를 기반으로 적절한 날씨 아이콘을 반환합니다.
 *
 * @param iconCode - OpenWeatherMap API의 icon 코드 (예: '01d', '01n', '10d')
 * @param className - 아이콘에 적용할 CSS 클래스 (크기, 색상 등)
 * @returns React 아이콘 컴포넌트
 *
 * OpenWeatherMap 아이콘 코드:
 * - 01: Clear sky (맑음)
 * - 02-04: Clouds (구름)
 * - 09-10: Rain (비)
 * - 11: Thunderstorm (천둥번개)
 * - 13: Snow (눈)
 * - 50: Mist/Fog (안개)
 * - 'd' suffix = day (낮), 'n' suffix = night (밤)
 */
export function getWeatherIcon(iconCode: string | undefined, className: string = "h-6 w-6") {
  if (!iconCode) return <Sun className={className} />;

  // OpenWeatherMap 아이콘 코드: 'd' = day, 'n' = night
  const isNight = iconCode.endsWith('n');

  // 01: Clear sky (맑음)
  if (iconCode.startsWith('01')) {
    return isNight ? (
      <Moon className={className} />
    ) : (
      <Sun className={className} />
    );
  }

  // 02, 03, 04: Clouds (구름)
  if (iconCode.startsWith('02') || iconCode.startsWith('03') || iconCode.startsWith('04')) {
    return isNight ? (
      <CloudMoon className={className} />
    ) : (
      <CloudSun className={className} />
    );
  }

  // 09, 10: Rain (비)
  if (iconCode.startsWith('09') || iconCode.startsWith('10')) {
    return <CloudRain className={className} />;
  }

  // 11: Thunderstorm (천둥번개)
  if (iconCode.startsWith('11')) {
    return <CloudLightning className={className} />;
  }

  // 13: Snow (눈)
  if (iconCode.startsWith('13')) {
    return <Snowflake className={className} />;
  }

  // 50: Mist/Fog (안개) - 구름으로 표시
  if (iconCode.startsWith('50')) {
    return isNight ? (
      <CloudMoon className={className} />
    ) : (
      <CloudSun className={className} />
    );
  }

  // Default
  return isNight ? (
    <Moon className={className} />
  ) : (
    <Sun className={className} />
  );
}
