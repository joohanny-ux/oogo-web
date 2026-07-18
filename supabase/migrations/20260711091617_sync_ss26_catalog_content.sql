-- Source: 06 OOGO_Catalog_Content_SS26.xlsx, Product pages.
-- Existing publication and image assignments are preserved. New products start as drafts.
create temporary table ss26_catalog_import (
  sort_order integer not null,
  model_code text not null,
  slug text not null,
  locale text not null,
  name text not null,
  frame_material text,
  lens_text text,
  frame_size text,
  size_note text,
  colorway text
) on commit drop;

insert into ss26_catalog_import (
  sort_order, model_code, slug, locale, name, frame_material, lens_text, frame_size, size_note, colorway
) values
  (0, 'OG26001C2', 'og26001c2', 'ko', '황혼의 산책', '고품질 PC 폴리카보네이트 프레임', '광학급 PA12 나일론 렌즈 (스위스 EMS Grilamid TR90 LXS) | UV400 100% 차단 | 충격 방지 | 반사 방지 코팅 | 헤이즈 1.5% 미만 | 초경량 1.0g/cm³', '63□17-145', '렌즈 63mm / 브리지 17mm / 다리 145mm', '투명 브라운 프레임 / 브라운 렌즈'),
  (0, 'OG26001C2', 'og26001c2', 'en', 'Sunset Stroll', 'High-quality PC Frame (Polycarbonate)', 'Optical-grade PA12 Nylon (Swiss EMS Grilamid TR90 LXS) | UV400 100% protection | Anti-impact | Anti-reflective coating | Low haze <1.5% | Lightweight 1.0g/cm³', '63□17-145', 'Lens 63mm / Bridge 17mm / Temple 145mm', 'Transparent Brown Frame / Brown Lenses'),
  (0, 'OG26001C2', 'og26001c2', 'zh', '夕光漫步', '优质PC聚碳酸酯镜框', '光学级PA12尼龙镜片（瑞士EMS Grilamid TR90 LXS）| UV400全波段防护 | 超强抗冲击 | 防反射镀膜 | 雾度<1.5% | 超轻1.0g/cm³', '63□17-145', '镜片宽63mm / 鼻梁17mm / 镜腿145mm', '透茶框茶片'),
  (1, 'OG26001C3', 'og26001c3', 'ko', '안개 속 산책', '고품질 PC 폴리카보네이트 프레임', '광학급 PA12 나일론 렌즈 (스위스 EMS Grilamid TR90 LXS) | UV400 100% 차단 | 충격 방지 | 반사 방지 코팅 | 헤이즈 1.5% 미만 | 초경량 1.0g/cm³', '63□17-145', '렌즈 63mm / 브리지 17mm / 다리 145mm', '투명 그레이 프레임 / 블랙그레이 렌즈'),
  (1, 'OG26001C3', 'og26001c3', 'en', 'Misty Walk', 'High-quality PC Frame (Polycarbonate)', 'Optical-grade PA12 Nylon (Swiss EMS Grilamid TR90 LXS) | UV400 100% protection | Anti-impact | Anti-reflective coating | Low haze <1.5% | Lightweight 1.0g/cm³', '63□17-145', 'Lens 63mm / Bridge 17mm / Temple 145mm', 'Transparent Gray Frame / Dark Gray Lenses'),
  (1, 'OG26001C3', 'og26001c3', 'zh', '迷雾漫行', '优质PC聚碳酸酯镜框', '光学级PA12尼龙镜片（瑞士EMS Grilamid TR90 LXS）| UV400全波段防护 | 超强抗冲击 | 防反射镀膜 | 雾度<1.5% | 超轻1.0g/cm³', '63□17-145', '镜片宽63mm / 鼻梁17mm / 镜腿145mm', '透灰框黑灰片'),
  (2, 'OG26002C1', 'og26002c1', 'ko', '블랙 문', '고품질 PC 폴리카보네이트 프레임', '광학급 PA12 나일론 렌즈 (스위스 EMS Grilamid TR90 LXS) | UV400 100% 차단 | 충격 방지 | 반사 방지 코팅 | 헤이즈 1.5% 미만 | 초경량 1.0g/cm³', '53□22-142', '렌즈 53mm / 브리지 22mm / 다리 142mm', '블랙 프레임 / 블랙그레이 렌즈'),
  (2, 'OG26002C1', 'og26002c1', 'en', 'Black Moon', 'High-quality PC Frame (Polycarbonate)', 'Optical-grade PA12 Nylon (Swiss EMS Grilamid TR90 LXS) | UV400 100% protection | Anti-impact | Anti-reflective coating | Low haze <1.5% | Lightweight 1.0g/cm³', '53□22-142', 'Lens 53mm / Bridge 22mm / Temple 142mm', 'Black Frame / Dark Gray Lenses'),
  (2, 'OG26002C1', 'og26002c1', 'zh', '黑月', '优质PC聚碳酸酯镜框', '光学级PA12尼龙镜片（瑞士EMS Grilamid TR90 LXS）| UV400全波段防护 | 超强抗冲击 | 防反射镀膜 | 雾度<1.5% | 超轻1.0g/cm³', '53□22-142', '镜片宽53mm / 鼻梁22mm / 镜腿142mm', '黑框黑灰片'),
  (3, 'OG26002C3', 'og26002c3', 'ko', '화이트 클라우드', '고품질 PC 폴리카보네이트 프레임', '광학급 PA12 나일론 렌즈 (스위스 EMS Grilamid TR90 LXS) | UV400 100% 차단 | 충격 방지 | 반사 방지 코팅 | 헤이즈 1.5% 미만 | 초경량 1.0g/cm³', '53□22-142', '렌즈 53mm / 브리지 22mm / 다리 142mm', '화이트 프레임 / 블랙그레이 렌즈'),
  (3, 'OG26002C3', 'og26002c3', 'en', 'White Cloud', 'High-quality PC Frame (Polycarbonate)', 'Optical-grade PA12 Nylon (Swiss EMS Grilamid TR90 LXS) | UV400 100% protection | Anti-impact | Anti-reflective coating | Low haze <1.5% | Lightweight 1.0g/cm³', '53□22-142', 'Lens 53mm / Bridge 22mm / Temple 142mm', 'White Frame / Dark Gray Lenses'),
  (3, 'OG26002C3', 'og26002c3', 'zh', '白云之境', '优质PC聚碳酸酯镜框', '光学级PA12尼龙镜片（瑞士EMS Grilamid TR90 LXS）| UV400全波段防护 | 超强抗冲击 | 防反射镀膜 | 雾度<1.5% | 超轻1.0g/cm³', '53□22-142', '镜片宽53mm / 鼻梁22mm / 镜腿142mm', '白框黑灰片'),
  (4, 'OG26003C3', 'og26003c3', 'ko', '포레스트 딥', '고품질 PC 폴리카보네이트 프레임', '광학급 PA12 나일론 렌즈 (스위스 EMS Grilamid TR90 LXS) | UV400 100% 차단 | 충격 방지 | 반사 방지 코팅 | 헤이즈 1.5% 미만 | 초경량 1.0g/cm³', '62□20-145', '렌즈 62mm / 브리지 20mm / 다리 145mm', '투명 그린 프레임 / 짙은 녹색 렌즈'),
  (4, 'OG26003C3', 'og26003c3', 'en', 'Forest Deep', 'High-quality PC Frame (Polycarbonate)', 'Optical-grade PA12 Nylon (Swiss EMS Grilamid TR90 LXS) | UV400 100% protection | Anti-impact | Anti-reflective coating | Low haze <1.5% | Lightweight 1.0g/cm³', '62□20-145', 'Lens 62mm / Bridge 20mm / Temple 145mm', 'Transparent Green Frame / Dark Green Lenses'),
  (4, 'OG26003C3', 'og26003c3', 'zh', '深林秘境', '优质PC聚碳酸酯镜框', '光学级PA12尼龙镜片（瑞士EMS Grilamid TR90 LXS）| UV400全波段防护 | 超强抗冲击 | 防反射镀膜 | 雾度<1.5% | 超轻1.0g/cm³', '62□20-145', '镜片宽62mm / 鼻梁20mm / 镜腿145mm', '透绿框墨绿片'),
  (5, 'OG26003C4', 'og26003c4', 'ko', '실버 미스트', '고품질 PC 폴리카보네이트 프레임', '광학급 PA12 나일론 렌즈 (스위스 EMS Grilamid TR90 LXS) | UV400 100% 차단 | 충격 방지 | 반사 방지 코팅 | 헤이즈 1.5% 미만 | 초경량 1.0g/cm³', '62□20-145', '렌즈 62mm / 브리지 20mm / 다리 145mm', '투명 그레이 프레임 / 그레이 렌즈'),
  (5, 'OG26003C4', 'og26003c4', 'en', 'Silver Mist', 'High-quality PC Frame (Polycarbonate)', 'Optical-grade PA12 Nylon (Swiss EMS Grilamid TR90 LXS) | UV400 100% protection | Anti-impact | Anti-reflective coating | Low haze <1.5% | Lightweight 1.0g/cm³', '62□20-145', 'Lens 62mm / Bridge 20mm / Temple 145mm', 'Transparent Gray Frame / Gray Lenses'),
  (5, 'OG26003C4', 'og26003c4', 'zh', '银雾', '优质PC聚碳酸酯镜框', '光学级PA12尼龙镜片（瑞士EMS Grilamid TR90 LXS）| UV400全波段防护 | 超强抗冲击 | 防反射镀膜 | 雾度<1.5% | 超轻1.0g/cm³', '62□20-145', '镜片宽62mm / 鼻梁20mm / 镜腿145mm', '透灰框灰片'),
  (6, 'OG26004C1', 'og26004c1', 'ko', '블랙 다이아몬드', '고품질 PC 폴리카보네이트 프레임', '광학급 PA12 나일론 렌즈 (스위스 EMS Grilamid TR90 LXS) | UV400 100% 차단 | 충격 방지 | 반사 방지 코팅 | 헤이즈 1.5% 미만 | 초경량 1.0g/cm³', '46□21-128', '렌즈 46mm / 브리지 21mm / 다리 128mm', '블랙 프레임 / 그레이 렌즈'),
  (6, 'OG26004C1', 'og26004c1', 'en', 'Black Diamond', 'High-quality PC Frame (Polycarbonate)', 'Optical-grade PA12 Nylon (Swiss EMS Grilamid TR90 LXS) | UV400 100% protection | Anti-impact | Anti-reflective coating | Low haze <1.5% | Lightweight 1.0g/cm³', '46□21-128', 'Lens 46mm / Bridge 21mm / Temple 128mm', 'Black Frame / Gray Lenses'),
  (6, 'OG26004C1', 'og26004c1', 'zh', '黑钻', '优质PC聚碳酸酯镜框', '光学级PA12尼龙镜片（瑞士EMS Grilamid TR90 LXS）| UV400全波段防护 | 超强抗冲击 | 防反射镀膜 | 雾度<1.5% | 超轻1.0g/cm³', '46□21-128', '镜片宽46mm / 鼻梁21mm / 镜腿128mm', '黑框灰片'),
  (7, 'OG26005C1', 'og26005c1', 'ko', '나이트 팬서', '고품질 PC 폴리카보네이트 프레임', '광학급 PA12 나일론 렌즈 (스위스 EMS Grilamid TR90 LXS) | UV400 100% 차단 | 충격 방지 | 반사 방지 코팅 | 헤이즈 1.5% 미만 | 초경량 1.0g/cm³', '67□19-147', '렌즈 67mm / 브리지 19mm / 다리 147mm', '블랙 프레임 / 블랙그레이 렌즈'),
  (7, 'OG26005C1', 'og26005c1', 'en', 'Night Panther', 'High-quality PC Frame (Polycarbonate)', 'Optical-grade PA12 Nylon (Swiss EMS Grilamid TR90 LXS) | UV400 100% protection | Anti-impact | Anti-reflective coating | Low haze <1.5% | Lightweight 1.0g/cm³', '67□19-147', 'Lens 67mm / Bridge 19mm / Temple 147mm', 'Black Frame / Dark Gray Lenses'),
  (7, 'OG26005C1', 'og26005c1', 'zh', '暗夜猎豹', '优质PC聚碳酸酯镜框', '光学级PA12尼龙镜片（瑞士EMS Grilamid TR90 LXS）| UV400全波段防护 | 超强抗冲击 | 防反射镀膜 | 雾度<1.5% | 超轻1.0g/cm³', '67□19-147', '镜片宽67mm / 鼻梁19mm / 镜腿147mm', '黑框黑灰片'),
  (8, 'OG26005C2', 'og26005c2', 'ko', '그린 라군', '고품질 PC 폴리카보네이트 프레임', '광학급 PA12 나일론 렌즈 (스위스 EMS Grilamid TR90 LXS) | UV400 100% 차단 | 충격 방지 | 반사 방지 코팅 | 헤이즈 1.5% 미만 | 초경량 1.0g/cm³', '67□19-147', '렌즈 67mm / 브리지 19mm / 다리 147mm', '투명 그린 프레임 / 브라운 렌즈'),
  (8, 'OG26005C2', 'og26005c2', 'en', 'Green Lagoon', 'High-quality PC Frame (Polycarbonate)', 'Optical-grade PA12 Nylon (Swiss EMS Grilamid TR90 LXS) | UV400 100% protection | Anti-impact | Anti-reflective coating | Low haze <1.5% | Lightweight 1.0g/cm³', '67□19-147', 'Lens 67mm / Bridge 19mm / Temple 147mm', 'Transparent Green Frame / Brown Lenses'),
  (8, 'OG26005C2', 'og26005c2', 'zh', '翠湖幻境', '优质PC聚碳酸酯镜框', '光学级PA12尼龙镜片（瑞士EMS Grilamid TR90 LXS）| UV400全波段防护 | 超强抗冲击 | 防反射镀膜 | 雾度<1.5% | 超轻1.0g/cm³', '67□19-147', '镜片宽67mm / 鼻梁19mm / 镜腿147mm', '透绿框茶片'),
  (9, 'OG26006C1', 'og26006c1', 'ko', '블랙 펄', '고품질 PC 폴리카보네이트 프레임', '광학급 PA12 나일론 렌즈 (스위스 EMS Grilamid TR90 LXS) | UV400 100% 차단 | 충격 방지 | 반사 방지 코팅 | 헤이즈 1.5% 미만 | 초경량 1.0g/cm³', '52□25-148', '렌즈 52mm / 브리지 25mm / 다리 148mm', '블랙 프레임 / 그레이 렌즈'),
  (9, 'OG26006C1', 'og26006c1', 'en', 'Black Pearl', 'High-quality PC Frame (Polycarbonate)', 'Optical-grade PA12 Nylon (Swiss EMS Grilamid TR90 LXS) | UV400 100% protection | Anti-impact | Anti-reflective coating | Low haze <1.5% | Lightweight 1.0g/cm³', '52□25-148', 'Lens 52mm / Bridge 25mm / Temple 148mm', 'Black Frame / Gray Lenses'),
  (9, 'OG26006C1', 'og26006c1', 'zh', '黑珍珠', '优质PC聚碳酸酯镜框', '光学级PA12尼龙镜片（瑞士EMS Grilamid TR90 LXS）| UV400全波段防护 | 超强抗冲击 | 防反射镀膜 | 雾度<1.5% | 超轻1.0g/cm³', '52□25-148', '镜片宽52mm / 鼻梁25mm / 镜腿148mm', '黑框灰片'),
  (10, 'OG26006C3', 'og26006c3', 'ko', '호피 선셋', '고품질 PC 폴리카보네이트 프레임', '광학급 PA12 나일론 렌즈 (스위스 EMS Grilamid TR90 LXS) | UV400 100% 차단 | 충격 방지 | 반사 방지 코팅 | 헤이즈 1.5% 미만 | 초경량 1.0g/cm³', '52□25-148', '렌즈 52mm / 브리지 25mm / 다리 148mm', '호피(터틀쉘) 프레임 / 그레이 렌즈'),
  (10, 'OG26006C3', 'og26006c3', 'en', 'Tortoise Sunset', 'High-quality PC Frame (Polycarbonate)', 'Optical-grade PA12 Nylon (Swiss EMS Grilamid TR90 LXS) | UV400 100% protection | Anti-impact | Anti-reflective coating | Low haze <1.5% | Lightweight 1.0g/cm³', '52□25-148', 'Lens 52mm / Bridge 25mm / Temple 148mm', 'Tortoiseshell Frame / Gray Lenses'),
  (10, 'OG26006C3', 'og26006c3', 'zh', '玳瑁夕阳', '优质PC聚碳酸酯镜框', '光学级PA12尼龙镜片（瑞士EMS Grilamid TR90 LXS）| UV400全波段防护 | 超强抗冲击 | 防反射镀膜 | 雾度<1.5% | 超轻1.0g/cm³', '52□25-148', '镜片宽52mm / 鼻梁25mm / 镜腿148mm', '玳瑁框灰片'),
  (11, 'OG26007C3', 'og26007c3', 'ko', '카페 오 레', '고품질 PC 폴리카보네이트 프레임', '광학급 PA12 나일론 렌즈 (스위스 EMS Grilamid TR90 LXS) | UV400 100% 차단 | 충격 방지 | 반사 방지 코팅 | 헤이즈 1.5% 미만 | 초경량 1.0g/cm³', '54□21-142', '렌즈 54mm / 브리지 21mm / 다리 142mm', '브라운 프레임 / 그레이 렌즈'),
  (11, 'OG26007C3', 'og26007c3', 'en', 'Café au Lait', 'High-quality PC Frame (Polycarbonate)', 'Optical-grade PA12 Nylon (Swiss EMS Grilamid TR90 LXS) | UV400 100% protection | Anti-impact | Anti-reflective coating | Low haze <1.5% | Lightweight 1.0g/cm³', '54□21-142', 'Lens 54mm / Bridge 21mm / Temple 142mm', 'Brown Frame / Gray Lenses'),
  (11, 'OG26007C3', 'og26007c3', 'zh', '拿铁时光', '优质PC聚碳酸酯镜框', '光学级PA12尼龙镜片（瑞士EMS Grilamid TR90 LXS）| UV400全波段防护 | 超强抗冲击 | 防反射镀膜 | 雾度<1.5% | 超轻1.0g/cm³', '54□21-142', '镜片宽54mm / 鼻梁21mm / 镜腿142mm', '棕框灰片'),
  (12, 'OG26008C4', 'og26008c4', 'ko', '레드 로즈', '고품질 PC 폴리카보네이트 프레임', '광학급 PA12 나일론 렌즈 (스위스 EMS Grilamid TR90 LXS) | UV400 100% 차단 | 충격 방지 | 반사 방지 코팅 | 헤이즈 1.5% 미만 | 초경량 1.0g/cm³', '56□22-148', '렌즈 56mm / 브리지 22mm / 다리 148mm', '레드 프레임 / 블랙그레이 렌즈'),
  (12, 'OG26008C4', 'og26008c4', 'en', 'Red Rose', 'High-quality PC Frame (Polycarbonate)', 'Optical-grade PA12 Nylon (Swiss EMS Grilamid TR90 LXS) | UV400 100% protection | Anti-impact | Anti-reflective coating | Low haze <1.5% | Lightweight 1.0g/cm³', '56□22-148', 'Lens 56mm / Bridge 22mm / Temple 148mm', 'Red Frame / Dark Gray Lenses'),
  (12, 'OG26008C4', 'og26008c4', 'zh', '红玫瑰', '优质PC聚碳酸酯镜框', '光学级PA12尼龙镜片（瑞士EMS Grilamid TR90 LXS）| UV400全波段防护 | 超强抗冲击 | 防反射镀膜 | 雾度<1.5% | 超轻1.0g/cm³', '56□22-148', '镜片宽56mm / 鼻梁22mm / 镜腿148mm', '红框黑灰片'),
  (13, 'OG26009C3', 'og26009c3', 'ko', '모카 드림', '고품질 PC 폴리카보네이트 프레임', '광학급 PA12 나일론 렌즈 (스위스 EMS Grilamid TR90 LXS) | UV400 100% 차단 | 충격 방지 | 반사 방지 코팅 | 헤이즈 1.5% 미만 | 초경량 1.0g/cm³', '55□23-148', '렌즈 55mm / 브리지 23mm / 다리 148mm', '브라운 프레임 / 그레이 렌즈'),
  (13, 'OG26009C3', 'og26009c3', 'en', 'Mocha Dream', 'High-quality PC Frame (Polycarbonate)', 'Optical-grade PA12 Nylon (Swiss EMS Grilamid TR90 LXS) | UV400 100% protection | Anti-impact | Anti-reflective coating | Low haze <1.5% | Lightweight 1.0g/cm³', '55□23-148', 'Lens 55mm / Bridge 23mm / Temple 148mm', 'Brown Frame / Gray Lenses'),
  (13, 'OG26009C3', 'og26009c3', 'zh', '摩卡之梦', '优质PC聚碳酸酯镜框', '光学级PA12尼龙镜片（瑞士EMS Grilamid TR90 LXS）| UV400全波段防护 | 超强抗冲击 | 防反射镀膜 | 雾度<1.5% | 超轻1.0g/cm³', '55□23-148', '镜片宽55mm / 鼻梁23mm / 镜腿148mm', '茶框灰片'),
  (14, 'OG26010C2', 'og26010c2', 'ko', '체리 블라썸', '고품질 PC 폴리카보네이트 프레임', '광학급 PA12 나일론 렌즈 (스위스 EMS Grilamid TR90 LXS) | UV400 100% 차단 | 충격 방지 | 반사 방지 코팅 | 헤이즈 1.5% 미만 | 초경량 1.0g/cm³', '54□21-143', '렌즈 54mm / 브리지 21mm / 다리 143mm', '투명 핑크 프레임 / 브라운 렌즈'),
  (14, 'OG26010C2', 'og26010c2', 'en', 'Cherry Blossom', 'High-quality PC Frame (Polycarbonate)', 'Optical-grade PA12 Nylon (Swiss EMS Grilamid TR90 LXS) | UV400 100% protection | Anti-impact | Anti-reflective coating | Low haze <1.5% | Lightweight 1.0g/cm³', '54□21-143', 'Lens 54mm / Bridge 21mm / Temple 143mm', 'Transparent Pink Frame / Brown Lenses'),
  (14, 'OG26010C2', 'og26010c2', 'zh', '樱花物语', '优质PC聚碳酸酯镜框', '光学级PA12尼龙镜片（瑞士EMS Grilamid TR90 LXS）| UV400全波段防护 | 超强抗冲击 | 防反射镀膜 | 雾度<1.5% | 超轻1.0g/cm³', '54□21-143', '镜片宽54mm / 鼻梁21mm / 镜腿143mm', '透粉框茶片'),
  (15, 'OG26010C3', 'og26010c3', 'ko', '민트 가든', '고품질 PC 폴리카보네이트 프레임', '광학급 PA12 나일론 렌즈 (스위스 EMS Grilamid TR90 LXS) | UV400 100% 차단 | 충격 방지 | 반사 방지 코팅 | 헤이즈 1.5% 미만 | 초경량 1.0g/cm³', '54□21-143', '렌즈 54mm / 브리지 21mm / 다리 143mm', '투명 그린 프레임 / 블랙그레이 렌즈'),
  (15, 'OG26010C3', 'og26010c3', 'en', 'Mint Garden', 'High-quality PC Frame (Polycarbonate)', 'Optical-grade PA12 Nylon (Swiss EMS Grilamid TR90 LXS) | UV400 100% protection | Anti-impact | Anti-reflective coating | Low haze <1.5% | Lightweight 1.0g/cm³', '54□21-143', 'Lens 54mm / Bridge 21mm / Temple 143mm', 'Transparent Green Frame / Dark Gray Lenses'),
  (15, 'OG26010C3', 'og26010c3', 'zh', '薄荷花园', '优质PC聚碳酸酯镜框', '光学级PA12尼龙镜片（瑞士EMS Grilamid TR90 LXS）| UV400全波段防护 | 超强抗冲击 | 防反射镀膜 | 雾度<1.5% | 超轻1.0g/cm³', '54□21-143', '镜片宽54mm / 鼻梁21mm / 镜腿143mm', '透绿框黑灰片'),
  (16, 'OG26011C2', 'og26011c2', 'ko', '매그놀리아', '고품질 PC 폴리카보네이트 프레임', '광학급 PA12 나일론 렌즈 (스위스 EMS Grilamid TR90 LXS) | UV400 100% 차단 | 충격 방지 | 반사 방지 코팅 | 헤이즈 1.5% 미만 | 초경량 1.0g/cm³', '62□16-150', '렌즈 62mm / 브리지 16mm / 다리 150mm', '블랙 프레임 / 그레이핑크 렌즈'),
  (16, 'OG26011C2', 'og26011c2', 'en', 'Magnolia', 'High-quality PC Frame (Polycarbonate)', 'Optical-grade PA12 Nylon (Swiss EMS Grilamid TR90 LXS) | UV400 100% protection | Anti-impact | Anti-reflective coating | Low haze <1.5% | Lightweight 1.0g/cm³', '62□16-150', 'Lens 62mm / Bridge 16mm / Temple 150mm', 'Black Frame / Gray-Pink Lenses'),
  (16, 'OG26011C2', 'og26011c2', 'zh', '玉兰光影', '优质PC聚碳酸酯镜框', '光学级PA12尼龙镜片（瑞士EMS Grilamid TR90 LXS）| UV400全波段防护 | 超强抗冲击 | 防反射镀膜 | 雾度<1.5% | 超轻1.0g/cm³', '62□16-150', '镜片宽62mm / 鼻梁16mm / 镜腿150mm', '黑框灰粉片'),
  (17, 'OG26012C1', 'og26012c1', 'ko', '블랙 오닉스', '고품질 PC 폴리카보네이트 프레임', '광학급 PA12 나일론 렌즈 (스위스 EMS Grilamid TR90 LXS) | UV400 100% 차단 | 충격 방지 | 반사 방지 코팅 | 헤이즈 1.5% 미만 | 초경량 1.0g/cm³', '55□19-146', '렌즈 55mm / 브리지 19mm / 다리 146mm', '블랙 프레임 / 블랙그레이 렌즈'),
  (17, 'OG26012C1', 'og26012c1', 'en', 'Black Onyx', 'High-quality PC Frame (Polycarbonate)', 'Optical-grade PA12 Nylon (Swiss EMS Grilamid TR90 LXS) | UV400 100% protection | Anti-impact | Anti-reflective coating | Low haze <1.5% | Lightweight 1.0g/cm³', '55□19-146', 'Lens 55mm / Bridge 19mm / Temple 146mm', 'Black Frame / Dark Gray Lenses'),
  (17, 'OG26012C1', 'og26012c1', 'zh', '黑曜石', '优质PC聚碳酸酯镜框', '光学级PA12尼龙镜片（瑞士EMS Grilamid TR90 LXS）| UV400全波段防护 | 超强抗冲击 | 防反射镀膜 | 雾度<1.5% | 超轻1.0g/cm³', '55□19-146', '镜片宽55mm / 鼻梁19mm / 镜腿146mm', '黑框黑灰片'),
  (18, 'OG26012C2', 'og26012c2', 'ko', '앰버 글로우', '고품질 PC 폴리카보네이트 프레임', '광학급 PA12 나일론 렌즈 (스위스 EMS Grilamid TR90 LXS) | UV400 100% 차단 | 충격 방지 | 반사 방지 코팅 | 헤이즈 1.5% 미만 | 초경량 1.0g/cm³', '55□19-146', '렌즈 55mm / 브리지 19mm / 다리 146mm', '투명 브라운 프레임 / 브라운 렌즈'),
  (18, 'OG26012C2', 'og26012c2', 'en', 'Amber Glow', 'High-quality PC Frame (Polycarbonate)', 'Optical-grade PA12 Nylon (Swiss EMS Grilamid TR90 LXS) | UV400 100% protection | Anti-impact | Anti-reflective coating | Low haze <1.5% | Lightweight 1.0g/cm³', '55□19-146', 'Lens 55mm / Bridge 19mm / Temple 146mm', 'Transparent Brown Frame / Brown Lenses'),
  (18, 'OG26012C2', 'og26012c2', 'zh', '琥珀微光', '优质PC聚碳酸酯镜框', '光学级PA12尼龙镜片（瑞士EMS Grilamid TR90 LXS）| UV400全波段防护 | 超强抗冲击 | 防反射镀膜 | 雾度<1.5% | 超轻1.0g/cm³', '55□19-146', '镜片宽55mm / 鼻梁19mm / 镜腿146mm', '透茶框茶片'),
  (19, 'OG26013C1', 'og26013c1', 'ko', '블랙 아이스', '고품질 PC 폴리카보네이트 프레임', '광학급 PA12 나일론 렌즈 (스위스 EMS Grilamid TR90 LXS) | UV400 100% 차단 | 충격 방지 | 반사 방지 코팅 | 헤이즈 1.5% 미만 | 초경량 1.0g/cm³', '53□22-145', '렌즈 53mm / 브리지 22mm / 다리 145mm', '블랙 프레임 / 블랙그레이 렌즈'),
  (19, 'OG26013C1', 'og26013c1', 'en', 'Black Ice', 'High-quality PC Frame (Polycarbonate)', 'Optical-grade PA12 Nylon (Swiss EMS Grilamid TR90 LXS) | UV400 100% protection | Anti-impact | Anti-reflective coating | Low haze <1.5% | Lightweight 1.0g/cm³', '53□22-145', 'Lens 53mm / Bridge 22mm / Temple 145mm', 'Black Frame / Dark Gray Lenses'),
  (19, 'OG26013C1', 'og26013c1', 'zh', '黑冰', '优质PC聚碳酸酯镜框', '光学级PA12尼龙镜片（瑞士EMS Grilamid TR90 LXS）| UV400全波段防护 | 超强抗冲击 | 防反射镀膜 | 雾度<1.5% | 超轻1.0g/cm³', '53□22-145', '镜片宽53mm / 鼻梁22mm / 镜腿145mm', '黑框黑灰片'),
  (20, 'OG26014C2', 'og26014c2', 'ko', '다크 오크', '고품질 PC 폴리카보네이트 프레임', '광학급 PA12 나일론 렌즈 (스위스 EMS Grilamid TR90 LXS) | UV400 100% 차단 | 충격 방지 | 반사 방지 코팅 | 헤이즈 1.5% 미만 | 초경량 1.0g/cm³', '59□17-148', '렌즈 59mm / 브리지 17mm / 다리 148mm', '블랙 프레임 / 그라데이션 브라운 렌즈'),
  (20, 'OG26014C2', 'og26014c2', 'en', 'Dark Oak', 'High-quality PC Frame (Polycarbonate)', 'Optical-grade PA12 Nylon (Swiss EMS Grilamid TR90 LXS) | UV400 100% protection | Anti-impact | Anti-reflective coating | Low haze <1.5% | Lightweight 1.0g/cm³', '59□17-148', 'Lens 59mm / Bridge 17mm / Temple 148mm', 'Black Frame / Gradient Brown Lenses'),
  (20, 'OG26014C2', 'og26014c2', 'zh', '深橡木', '优质PC聚碳酸酯镜框', '光学级PA12尼龙镜片（瑞士EMS Grilamid TR90 LXS）| UV400全波段防护 | 超强抗冲击 | 防反射镀膜 | 雾度<1.5% | 超轻1.0g/cm³', '59□17-148', '镜片宽59mm / 鼻梁17mm / 镜腿148mm', '黑框渐茶片'),
  (21, 'OG26014C3', 'og26014c3', 'ko', '허니 무드', '고품질 PC 폴리카보네이트 프레임', '광학급 PA12 나일론 렌즈 (스위스 EMS Grilamid TR90 LXS) | UV400 100% 차단 | 충격 방지 | 반사 방지 코팅 | 헤이즈 1.5% 미만 | 초경량 1.0g/cm³', '59□17-148', '렌즈 59mm / 브리지 17mm / 다리 148mm', '투명 브라운 프레임 / 브라운 렌즈'),
  (21, 'OG26014C3', 'og26014c3', 'en', 'Honey Mood', 'High-quality PC Frame (Polycarbonate)', 'Optical-grade PA12 Nylon (Swiss EMS Grilamid TR90 LXS) | UV400 100% protection | Anti-impact | Anti-reflective coating | Low haze <1.5% | Lightweight 1.0g/cm³', '59□17-148', 'Lens 59mm / Bridge 17mm / Temple 148mm', 'Transparent Brown Frame / Brown Lenses'),
  (21, 'OG26014C3', 'og26014c3', 'zh', '蜜糖心情', '优质PC聚碳酸酯镜框', '光学级PA12尼龙镜片（瑞士EMS Grilamid TR90 LXS）| UV400全波段防护 | 超强抗冲击 | 防反射镀膜 | 雾度<1.5% | 超轻1.0g/cm³', '59□17-148', '镜片宽59mm / 鼻梁17mm / 镜腿148mm', '透茶框茶片'),
  (22, 'OG26015C4', 'og26015c4', 'ko', '올리브 가든', '고품질 PC 폴리카보네이트 프레임', '광학급 PA12 나일론 렌즈 (스위스 EMS Grilamid TR90 LXS) | UV400 100% 차단 | 충격 방지 | 반사 방지 코팅 | 헤이즈 1.5% 미만 | 초경량 1.0g/cm³', '66□13-148', '렌즈 66mm / 브리지 13mm / 다리 148mm', '올리브 프레임 / 블랙그레이 렌즈'),
  (22, 'OG26015C4', 'og26015c4', 'en', 'Olive Garden', 'High-quality PC Frame (Polycarbonate)', 'Optical-grade PA12 Nylon (Swiss EMS Grilamid TR90 LXS) | UV400 100% protection | Anti-impact | Anti-reflective coating | Low haze <1.5% | Lightweight 1.0g/cm³', '66□13-148', 'Lens 66mm / Bridge 13mm / Temple 148mm', 'Olive Frame / Dark Gray Lenses'),
  (22, 'OG26015C4', 'og26015c4', 'zh', '橄榄秘境', '优质PC聚碳酸酯镜框', '光学级PA12尼龙镜片（瑞士EMS Grilamid TR90 LXS）| UV400全波段防护 | 超强抗冲击 | 防反射镀膜 | 雾度<1.5% | 超轻1.0g/cm³', '66□13-148', '镜片宽66mm / 鼻梁13mm / 镜腿148mm', '橄榄框黑灰片'),
  (23, 'OG26016C1', 'og26016c1', 'ko', '블랙 스완', '고품질 PC 폴리카보네이트 프레임', '광학급 PA12 나일론 렌즈 (스위스 EMS Grilamid TR90 LXS) | UV400 100% 차단 | 충격 방지 | 반사 방지 코팅 | 헤이즈 1.5% 미만 | 초경량 1.0g/cm³', '53□19-146', '렌즈 53mm / 브리지 19mm / 다리 146mm', '블랙 프레임 / 블랙그레이 렌즈'),
  (23, 'OG26016C1', 'og26016c1', 'en', 'Black Swan', 'High-quality PC Frame (Polycarbonate)', 'Optical-grade PA12 Nylon (Swiss EMS Grilamid TR90 LXS) | UV400 100% protection | Anti-impact | Anti-reflective coating | Low haze <1.5% | Lightweight 1.0g/cm³', '53□19-146', 'Lens 53mm / Bridge 19mm / Temple 146mm', 'Black Frame / Dark Gray Lenses'),
  (23, 'OG26016C1', 'og26016c1', 'zh', '黑天鹅', '优质PC聚碳酸酯镜框', '光学级PA12尼龙镜片（瑞士EMS Grilamid TR90 LXS）| UV400全波段防护 | 超强抗冲击 | 防反射镀膜 | 雾度<1.5% | 超轻1.0g/cm³', '53□19-146', '镜片宽53mm / 鼻梁19mm / 镜腿146mm', '黑框黑灰片');

insert into public.products (
  slug, model_code, size, reference_color_name, frame_material,
  lens_material, lens_features, sort_order, published, featured
)
select
  source.slug,
  source.model_code,
  nullif(source.frame_size, ''),
  nullif(source.colorway, ''),
  nullif(source.frame_material, ''),
  nullif(trim(split_part(source.lens_text, '|', 1)), ''),
  array(
    select trim(part)
    from unnest(string_to_array(source.lens_text, '|')) with ordinality as parts(part, position)
    where position > 1 and trim(part) <> ''
  ),
  source.sort_order,
  false,
  false
from ss26_catalog_import as source
where source.locale = 'ko'
  and not exists (
    select 1 from public.products as existing where existing.model_code = source.model_code
  );

update public.products as products
set
  size = nullif(source.frame_size, ''),
  reference_color_name = nullif(source.colorway, ''),
  frame_material = nullif(source.frame_material, ''),
  lens_material = nullif(trim(split_part(source.lens_text, '|', 1)), ''),
  lens_features = array(
    select trim(part)
    from unnest(string_to_array(source.lens_text, '|')) with ordinality as parts(part, position)
    where position > 1 and trim(part) <> ''
  ),
  sort_order = source.sort_order
from ss26_catalog_import as source
where source.locale = 'ko'
  and products.model_code = source.model_code;

insert into public.product_translations (
  product_id, locale, name, colorway, frame_size, size_note,
  frame_material, lens_material, lens_features
)
select
  products.id,
  source.locale,
  source.name,
  nullif(source.colorway, ''),
  nullif(source.frame_size, ''),
  nullif(source.size_note, ''),
  nullif(source.frame_material, ''),
  nullif(trim(split_part(source.lens_text, '|', 1)), ''),
  array(
    select trim(part)
    from unnest(string_to_array(source.lens_text, '|')) with ordinality as parts(part, position)
    where position > 1 and trim(part) <> ''
  )
from ss26_catalog_import as source
join public.products as products on products.model_code = source.model_code
on conflict (product_id, locale) do update set
  name = excluded.name,
  colorway = excluded.colorway,
  frame_size = excluded.frame_size,
  size_note = excluded.size_note,
  frame_material = excluded.frame_material,
  lens_material = excluded.lens_material,
  lens_features = excluded.lens_features;
