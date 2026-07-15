// 공개 약관·개인정보 처리방침의 로케일별 본문
import type { Locale } from "@/lib/i18n";
import { pickLocaleCopy, type LocaleCopy } from "@/lib/public-copy";

type LegalSection = { title: LocaleCopy; body: LocaleCopy };

type LegalDocument = {
  title: LocaleCopy;
  intro: LocaleCopy;
  effective: LocaleCopy;
  note: LocaleCopy;
  sections: LegalSection[];
};

export const privacyPolicyCopy: LegalDocument = {
  title: {
    ko: "개인정보 처리방침",
    en: "Privacy Policy",
    zh: "隐私政策"
  },
  intro: {
    ko: "OOGO 웹사이트와 문의 양식을 통해 수집되는 개인정보의 처리 기준을 안내합니다.",
    en: "This policy explains how personal information collected through the OOGO website and inquiry form is processed.",
    zh: "本政策说明通过 OOGO 网站与咨询表单收集的个人信息如何被处理。"
  },
  effective: {
    ko: "시행일: 2026년 7월 14일",
    en: "Effective date: July 14, 2026",
    zh: "生效日期：2026年7月14日"
  },
  note: {
    ko: "배포 전 실제 사업자 정보, 위탁사 및 국외 이전 세부 내용을 운영 환경에 맞게 최종 확인해야 합니다.",
    en: "Before production use, confirm operator details, processors, and any cross-border transfer specifics for the live environment.",
    zh: "正式上线前，请根据实际运营环境最终核对经营者信息、受托方及跨境传输细节。"
  },
  sections: [
    {
      title: { ko: "개인정보의 처리 목적", en: "Purpose of processing", zh: "处理目的" },
      body: {
        ko: "OOGO는 바이어, 리테일, 협업, 프레스 및 아카이브 문의를 접수하고 답변하며, 관련 상담과 후속 커뮤니케이션을 진행하기 위해 개인정보를 처리합니다.",
        en: "OOGO processes personal information to receive and respond to buyer, retail, collaboration, press, and archive inquiries, and to carry out related consultation and follow-up communication.",
        zh: "OOGO 为受理并回复采购、零售、合作、媒体及档案咨询，并推进相关沟通与后续联络而处理个人信息。"
      }
    },
    {
      title: { ko: "수집하는 개인정보 항목", en: "Personal information collected", zh: "收集的个人信息" },
      body: {
        ko: "필수 항목은 문의 유형, 이름, 이메일, 문의 내용 및 동의 기록입니다. 회사명, 국가, 연락처 또는 웹사이트는 선택 항목입니다. 보안 기능 사용 시 IP 주소, 브라우저 정보, 접속 시각 등 기술 정보가 자동으로 처리될 수 있습니다.",
        en: "Required fields are inquiry type, name, email, message, and consent record. Company, country, phone, or website are optional. When security features are used, technical data such as IP address, browser information, and access time may be processed automatically.",
        zh: "必填项为咨询类型、姓名、邮箱、咨询内容及同意记录。公司名、国家、电话或网站为选填。使用安全功能时，可能自动处理 IP 地址、浏览器信息、访问时间等技术信息。"
      }
    },
    {
      title: { ko: "처리 근거", en: "Legal basis", zh: "处理依据" },
      body: {
        ko: "문의 양식에서 받은 개인정보는 이용자의 동의와 계약 체결 전 요청에 따른 조치를 근거로 처리합니다. 선택 항목에 동의하지 않아도 문의할 수 있으나 필수 항목에 동의하지 않으면 접수가 제한됩니다.",
        en: "Personal information from the inquiry form is processed based on user consent and steps taken at the user’s request before entering a contract. Optional fields may be declined, but refusing required fields limits submission.",
        zh: "来自咨询表单的个人信息依据用户同意，以及应请求在订立合同前采取的措施进行处理。可不填写选填项，但不同意必填项将限制提交。"
      }
    },
    {
      title: { ko: "보유 및 이용 기간", en: "Retention period", zh: "保存与使用期限" },
      body: {
        ko: "문의 기록은 문의 처리 완료 후 3년간 보관한 뒤 지체 없이 파기합니다. 다만 관련 법령에 별도 보존 의무가 있거나 분쟁 처리를 위해 필요한 경우에는 해당 기간 동안 보관할 수 있습니다.",
        en: "Inquiry records are kept for 3 years after completion and then deleted without delay, unless a longer period is required by law or needed to handle a dispute.",
        zh: "咨询记录在处理完成后保存 3 年并及时销毁。但如相关法律另有保存义务，或为处理争议所必需，可在相应期间内保存。"
      }
    },
    {
      title: { ko: "제3자 제공", en: "Provision to third parties", zh: "向第三方提供" },
      body: {
        ko: "OOGO는 원칙적으로 개인정보를 제3자에게 판매하거나 제공하지 않습니다. 이용자의 별도 동의가 있거나 법령에 근거가 있는 경우에만 필요한 범위에서 제공합니다.",
        en: "OOGO does not sell or provide personal information to third parties as a rule. It is shared only with separate consent or when required by law, and only to the extent necessary.",
        zh: "原则上 OOGO 不向第三方出售或提供个人信息。仅在获得另行同意或有法律依据时，在必要范围内提供。"
      }
    },
    {
      title: { ko: "처리 위탁 및 국외 이전", en: "Processors and cross-border transfer", zh: "处理委托与跨境传输" },
      body: {
        ko: "사이트 운영을 위해 데이터베이스, 호스팅 및 보안 서비스 제공자에게 일부 처리를 위탁할 수 있습니다. 국외 이전이 발생하는 경우 이전 국가, 항목, 목적, 방법, 보유 기간과 거부 방법을 본 방침에 공개하고 필요한 절차를 이행합니다.",
        en: "Some processing may be entrusted to database, hosting, and security providers for site operation. If a cross-border transfer occurs, destination, categories, purpose, method, retention, and how to refuse will be disclosed here and required procedures completed.",
        zh: "为运营网站，可能将部分处理委托给数据库、托管与安全服务提供商。如发生跨境传输，将在本政策中公开目的地、项目、目的、方式、保存期限及拒绝方法，并履行必要手续。"
      }
    },
    {
      title: { ko: "개인정보의 파기", en: "Destruction of personal information", zh: "个人信息的销毁" },
      body: {
        ko: "보유 기간이 끝나거나 처리 목적이 달성된 개인정보는 복구할 수 없는 방법으로 안전하게 삭제합니다. 종이 문서가 있는 경우 분쇄 또는 소각하여 파기합니다.",
        en: "When the retention period ends or the purpose is fulfilled, personal information is deleted securely so it cannot be restored. Paper records, if any, are shredded or incinerated.",
        zh: "保存期限届满或处理目的达成后，将以不可恢复的方式安全删除个人信息。如有纸质文件，则粉碎或焚烧销毁。"
      }
    },
    {
      title: { ko: "정보주체의 권리", en: "Rights of data subjects", zh: "信息主体的权利" },
      body: {
        ko: "이용자는 개인정보의 열람, 정정, 삭제 및 처리 정지를 요청할 수 있습니다. 요청은 contact@oogolabs.com으로 접수하며, 본인 확인 후 관련 법령이 정한 범위에서 처리합니다.",
        en: "Users may request access, correction, deletion, or suspension of processing. Requests can be sent to contact@oogolabs.com and will be handled within the scope of applicable law after identity verification.",
        zh: "用户可请求查阅、更正、删除及停止处理个人信息。请将请求发送至 contact@oogolabs.com，经身份验证后按相关法律范围处理。"
      }
    },
    {
      title: { ko: "안전성 확보 조치", en: "Security measures", zh: "安全保障措施" },
      body: {
        ko: "OOGO는 개인정보 접근 권한 관리, 인증과 접근 통제, 전송 구간 보호, 기록 점검 등 개인정보의 분실, 도난, 유출 및 훼손을 방지하기 위한 합리적인 보호 조치를 적용합니다.",
        en: "OOGO applies reasonable safeguards such as access control, authentication, transport protection, and log review to help prevent loss, theft, leakage, or damage of personal information.",
        zh: "OOGO 采取访问权限管理、认证与访问控制、传输保护、日志检查等合理措施，以防个人信息丢失、被盗、泄露或损毁。"
      }
    },
    {
      title: { ko: "쿠키 및 보안 기술", en: "Cookies and security technology", zh: "Cookie 与安全技术" },
      body: {
        ko: "필수 보안과 스팸 방지를 위해 Cloudflare Turnstile과 같은 기술이 사용될 수 있습니다. 이 과정에서 보안 확인에 필요한 최소한의 기술 정보가 서비스 제공자에 의해 처리될 수 있습니다.",
        en: "Technologies such as Cloudflare Turnstile may be used for required security and spam prevention. Minimal technical information needed for verification may be processed by the provider.",
        zh: "为必要安全与防垃圾，可能使用 Cloudflare Turnstile 等技术。此过程中，服务提供商可能处理验证所需的最少技术信息。"
      }
    },
    {
      title: { ko: "개인정보 문의처", en: "Privacy contact", zh: "隐私联系方式" },
      body: {
        ko: "개인정보 처리와 권리 행사에 관한 문의는 contact@oogolabs.com으로 보내 주세요.",
        en: "For questions about privacy processing or exercising your rights, email contact@oogolabs.com.",
        zh: "有关个人信息处理与权利行使的问题，请发送至 contact@oogolabs.com。"
      }
    },
    {
      title: { ko: "처리방침 변경", en: "Changes to this policy", zh: "政策变更" },
      body: {
        ko: "본 처리방침이 변경되는 경우 시행일과 주요 변경 사항을 이 페이지에 게시합니다. 이용자의 권리에 중요한 영향을 주는 변경은 합리적인 기간을 두고 안내합니다.",
        en: "If this policy changes, the effective date and key updates will be posted on this page. Changes that materially affect user rights will be noticed with a reasonable lead time.",
        zh: "本政策如有变更，将在本页公布生效日期与主要变更。对用户权利有重大影响的变更将给予合理提前告知。"
      }
    }
  ]
};

export const termsCopy: LegalDocument = {
  title: {
    ko: "웹사이트 이용약관",
    en: "Terms & Conditions",
    zh: "网站使用条款"
  },
  intro: {
    ko: "OOGO 웹사이트 이용과 제품·비즈니스 문의에 적용되는 기본 운영 기준입니다.",
    en: "These terms set the basic operating rules for using the OOGO website and product or business inquiries.",
    zh: "本条款规定使用 OOGO 网站以及产品与商务咨询的基本运营准则。"
  },
  effective: {
    ko: "시행일: 2026년 7월 14일",
    en: "Effective date: July 14, 2026",
    zh: "生效日期：2026年7月14日"
  },
  note: {
    ko: "실제 판매, 납품 및 협업에는 당사자 간 개별 계약 조건이 우선 적용됩니다.",
    en: "Individual contract terms between the parties take priority for actual sales, delivery, and collaboration.",
    zh: "实际销售、交付与合作以当事方之间的个别合同条件优先适用。"
  },
  sections: [
    {
      title: { ko: "목적 및 적용 범위", en: "Purpose and scope", zh: "目的与适用范围" },
      body: {
        ko: "본 약관은 OOGO 웹사이트에서 제공하는 브랜드, 제품, 프로젝트, 아카이브 정보와 비즈니스 문의 서비스의 이용 기준을 정합니다. 웹사이트를 이용하면 본 약관에 동의한 것으로 봅니다.",
        en: "These terms govern use of brand, product, project, and archive information and business inquiry services on the OOGO website. Using the site constitutes agreement to these terms.",
        zh: "本条款规定使用 OOGO 网站所提供的品牌、产品、项目、档案信息及商务咨询服务的准则。使用网站即视为同意本条款。"
      }
    },
    {
      title: { ko: "웹사이트 이용", en: "Website use", zh: "网站使用" },
      body: {
        ko: "이용자는 관련 법령과 공공질서에 반하지 않는 범위에서 웹사이트를 이용해야 합니다. 서비스의 정상 운영을 방해하거나 콘텐츠와 시스템을 무단 수집, 복제, 변조하는 행위는 금지됩니다.",
        en: "Users must use the website within applicable law and public order. Interfering with normal operation or unauthorized collecting, copying, or altering of content and systems is prohibited.",
        zh: "用户须在不违反相关法律与公共秩序的范围内使用网站。禁止妨碍服务正常运营，或擅自采集、复制、篡改内容与系统。"
      }
    },
    {
      title: { ko: "제품 정보", en: "Product information", zh: "产品信息" },
      body: {
        ko: "웹사이트의 제품 이미지, 사양, 색상 및 공급 가능 여부는 참고 정보입니다. 실제 제품은 화면 환경과 제작 시점에 따라 차이가 있을 수 있으며, 거래 조건과 납기 등은 개별 문의와 계약을 통해 최종 확정됩니다.",
        en: "Product images, specifications, colors, and availability on the site are for reference. Actual products may differ by display and production timing. Terms and lead times are finalized through inquiry and contract.",
        zh: "网站上的产品图像、规格、颜色与供应情况为参考信息。实际产品可能因显示环境与生产时点而有差异，交易条件与交期等通过单独咨询与合同最终确定。"
      }
    },
    {
      title: { ko: "바이어·리테일·협업 문의", en: "Buyer, retail, and collaboration inquiries", zh: "采购、零售与合作咨询" },
      body: {
        ko: "문의 접수는 상담을 위한 절차이며 계약 체결, 파트너십 승인, 재고 확보 또는 납기를 보장하지 않습니다. 구체적인 권리와 의무는 당사자 간 별도 계약이나 합의가 있는 경우 그 내용을 우선 적용합니다.",
        en: "Submitting an inquiry is a consultation step and does not guarantee a contract, partnership approval, inventory, or delivery date. Specific rights and duties follow any separate agreement between the parties.",
        zh: "提交咨询是为沟通的流程，不保证订立合同、批准合作、库存或交期。具体权利义务以当事方另有合同或约定为准。"
      }
    },
    {
      title: { ko: "지식재산권", en: "Intellectual property", zh: "知识产权" },
      body: {
        ko: "로고, 상표, 제품 디자인, 사진, 영상, 문구 및 편집물에 관한 권리는 OOGO 또는 정당한 권리자에게 있습니다. 사전 서면 허가 없이 복제, 배포, 수정, 전시 또는 상업적으로 이용할 수 없습니다.",
        en: "Rights in logos, trademarks, product design, photos, video, copy, and editorial materials belong to OOGO or rightful owners. Copying, distributing, modifying, displaying, or commercial use without prior written permission is not allowed.",
        zh: "标志、商标、产品设计、照片、影像、文案与编辑物的权利归 OOGO 或正当权利人所有。未经事先书面许可，不得复制、传播、修改、展示或用于商业用途。"
      }
    },
    {
      title: { ko: "외부 링크", en: "External links", zh: "外部链接" },
      body: {
        ko: "웹사이트에 연결된 외부 서비스는 각 운영자의 정책에 따라 제공됩니다. OOGO는 외부 서비스의 콘텐츠, 보안 또는 개인정보 처리에 관하여 책임지지 않으므로 해당 서비스의 약관을 확인해 주세요.",
        en: "Linked external services are provided under their operators’ policies. OOGO is not responsible for their content, security, or privacy practices; please review those terms.",
        zh: "网站所链外部服务按其运营方政策提供。OOGO 不对外部服务的内容、安全或个人信息处理负责，请查阅相应条款。"
      }
    },
    {
      title: { ko: "서비스 변경 및 중단", en: "Changes and suspension", zh: "服务变更与中断" },
      body: {
        ko: "OOGO는 운영, 유지보수, 보안 또는 불가피한 사유로 웹사이트의 일부를 변경하거나 일시 중단할 수 있습니다. 이용자에게 중요한 영향이 예상되는 경우 가능한 범위에서 사전에 안내합니다.",
        en: "OOGO may change or temporarily suspend parts of the site for operations, maintenance, security, or unavoidable reasons. Where material impact is expected, notice will be given when reasonably possible.",
        zh: "因运营、维护、安全或不可避免的事由，OOGO 可能变更或暂时中断网站部分功能。如可能对用户造成重要影响，将在可行范围内事先告知。"
      }
    },
    {
      title: { ko: "책임 범위", en: "Limitation of liability", zh: "责任范围" },
      body: {
        ko: "OOGO는 합리적인 범위에서 정확한 정보를 제공하기 위해 노력합니다. 다만 법령이 허용하는 범위에서 천재지변, 통신 장애, 이용자의 귀책사유 또는 예측하기 어려운 사유로 발생한 간접 손해에 대한 책임은 제한될 수 있습니다.",
        en: "OOGO aims to provide accurate information within a reasonable scope. To the extent permitted by law, liability for indirect damages from force majeure, network outages, user fault, or unforeseeable causes may be limited.",
        zh: "OOGO 在合理范围内努力提供准确信息。但在法律允许范围内，对因不可抗力、通信故障、用户原因或难以预见事由造成的间接损害，责任可能受限。"
      }
    },
    {
      title: { ko: "약관 변경 및 고지", en: "Changes to these terms", zh: "条款变更与告知" },
      body: {
        ko: "약관이 변경되는 경우 본 페이지에 시행일과 변경 내용을 게시합니다. 이용자에게 불리한 중요한 변경은 합리적인 기간을 두고 별도로 안내할 수 있습니다.",
        en: "If these terms change, the effective date and updates will be posted on this page. Material changes that disadvantage users may also be noticed separately with a reasonable lead time.",
        zh: "条款如有变更，将在本页公布生效日期与变更内容。对用户不利的重要变更，可另行给予合理提前告知。"
      }
    },
    {
      title: { ko: "준거법 및 관할", en: "Governing law and jurisdiction", zh: "管辖法律与法院" },
      body: {
        ko: "본 약관은 대한민국 법률을 따릅니다. 웹사이트 이용과 관련한 분쟁은 당사자 간 협의를 우선하며, 해결되지 않는 경우 민사소송법에 따른 관할 법원에서 처리합니다.",
        en: "These terms are governed by the laws of the Republic of Korea. Disputes related to website use should first be discussed between the parties; if unresolved, they will be handled by the competent court under civil procedure law.",
        zh: "本条款适用大韩民国法律。与网站使用有关的争议优先由当事方协商，未能解决时，由依据民事诉讼法有管辖权的法院处理。"
      }
    },
    {
      title: { ko: "문의처", en: "Contact", zh: "联系方式" },
      body: {
        ko: "약관과 웹사이트 이용에 관한 문의는 contact@oogolabs.com으로 보내 주세요.",
        en: "For questions about these terms or website use, email contact@oogolabs.com.",
        zh: "有关本条款与网站使用的问题，请发送至 contact@oogolabs.com。"
      }
    }
  ]
};

export function resolveLegalDocument(document: LegalDocument, locale: Locale) {
  return {
    title: pickLocaleCopy(locale, document.title),
    intro: pickLocaleCopy(locale, document.intro),
    effective: pickLocaleCopy(locale, document.effective),
    note: pickLocaleCopy(locale, document.note),
    sections: document.sections.map((section) => ({
      title: pickLocaleCopy(locale, section.title),
      body: pickLocaleCopy(locale, section.body)
    }))
  };
}
