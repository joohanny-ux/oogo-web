import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";

const sections = [
  {
    title: "목적 및 적용 범위",
    body: "본 약관은 OOGO 웹사이트에서 제공하는 브랜드, 제품, 프로젝트, 아카이브 정보와 비즈니스 문의 서비스의 이용 기준을 정합니다. 웹사이트를 이용하면 본 약관에 동의한 것으로 봅니다."
  },
  {
    title: "웹사이트 이용",
    body: "이용자는 관련 법령과 공공질서에 반하지 않는 범위에서 웹사이트를 이용해야 합니다. 서비스의 정상 운영을 방해하거나 콘텐츠와 시스템을 무단 수집, 복제, 변조하는 행위는 금지됩니다."
  },
  {
    title: "제품 정보",
    body: "웹사이트의 제품 이미지, 사양, 색상 및 공급 가능 여부는 참고 정보입니다. 실제 제품은 화면 환경과 제작 시점에 따라 차이가 있을 수 있으며, 거래 조건과 납기 등은 개별 문의와 계약을 통해 최종 확정됩니다."
  },
  {
    title: "바이어·리테일·협업 문의",
    body: "문의 접수는 상담을 위한 절차이며 계약 체결, 파트너십 승인, 재고 확보 또는 납기를 보장하지 않습니다. 구체적인 권리와 의무는 당사자 간 별도 계약이나 합의가 있는 경우 그 내용을 우선 적용합니다."
  },
  {
    title: "지식재산권",
    body: "로고, 상표, 제품 디자인, 사진, 영상, 문구 및 편집물에 관한 권리는 OOGO 또는 정당한 권리자에게 있습니다. 사전 서면 허가 없이 복제, 배포, 수정, 전시 또는 상업적으로 이용할 수 없습니다."
  },
  {
    title: "외부 링크",
    body: "웹사이트에 연결된 외부 서비스는 각 운영자의 정책에 따라 제공됩니다. OOGO는 외부 서비스의 콘텐츠, 보안 또는 개인정보 처리에 관하여 책임지지 않으므로 해당 서비스의 약관을 확인해 주세요."
  },
  {
    title: "서비스 변경 및 중단",
    body: "OOGO는 운영, 유지보수, 보안 또는 불가피한 사유로 웹사이트의 일부를 변경하거나 일시 중단할 수 있습니다. 이용자에게 중요한 영향이 예상되는 경우 가능한 범위에서 사전에 안내합니다."
  },
  {
    title: "책임 범위",
    body: "OOGO는 합리적인 범위에서 정확한 정보를 제공하기 위해 노력합니다. 다만 법령이 허용하는 범위에서 천재지변, 통신 장애, 이용자의 귀책사유 또는 예측하기 어려운 사유로 발생한 간접 손해에 대한 책임은 제한될 수 있습니다."
  },
  {
    title: "약관 변경 및 고지",
    body: "약관이 변경되는 경우 본 페이지에 시행일과 변경 내용을 게시합니다. 이용자에게 불리한 중요한 변경은 합리적인 기간을 두고 별도로 안내할 수 있습니다."
  },
  {
    title: "준거법 및 관할",
    body: "본 약관은 대한민국 법률을 따릅니다. 웹사이트 이용과 관련한 분쟁은 당사자 간 협의를 우선하며, 해결되지 않는 경우 민사소송법에 따른 관할 법원에서 처리합니다."
  },
  {
    title: "문의처",
    body: "약관과 웹사이트 이용에 관한 문의는 contact@oogolabs.com으로 보내 주세요."
  }
] as const;

export default function TermsConditionsPage() {
  return (
    <>
      <SiteHeader />
      <main className="legal-page">
        <section className="legal-page-intro">
          <p className="eyebrow">LEGAL</p>
          <h1>웹사이트 이용약관</h1>
          <p>OOGO 웹사이트 이용과 제품·비즈니스 문의에 적용되는 기본 운영 기준입니다.</p>
          <p className="legal-page-meta">시행일: 2026년 7월 14일</p>
        </section>
        <section className="legal-page-body" aria-label="Terms sections">
          {sections.map((section) => (
            <article className="legal-block" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </section>
        <p className="legal-page-note">실제 판매, 납품 및 협업에는 당사자 간 개별 계약 조건이 우선 적용됩니다.</p>
      </main>
      <SiteFooter />
    </>
  );
}
