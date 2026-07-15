import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";

const sections = [
  {
    title: "개인정보의 처리 목적",
    body: "OOGO는 바이어, 리테일, 협업, 프레스 및 아카이브 문의를 접수하고 답변하며, 관련 상담과 후속 커뮤니케이션을 진행하기 위해 개인정보를 처리합니다."
  },
  {
    title: "수집하는 개인정보 항목",
    body: "필수 항목은 문의 유형, 이름, 이메일, 문의 내용 및 동의 기록입니다. 회사명, 국가, 연락처 또는 웹사이트는 선택 항목입니다. 보안 기능 사용 시 IP 주소, 브라우저 정보, 접속 시각 등 기술 정보가 자동으로 처리될 수 있습니다."
  },
  {
    title: "처리 근거",
    body: "문의 양식에서 받은 개인정보는 이용자의 동의와 계약 체결 전 요청에 따른 조치를 근거로 처리합니다. 선택 항목에 동의하지 않아도 문의할 수 있으나 필수 항목에 동의하지 않으면 접수가 제한됩니다."
  },
  {
    title: "보유 및 이용 기간",
    body: "문의 기록은 문의 처리 완료 후 3년간 보관한 뒤 지체 없이 파기합니다. 다만 관련 법령에 별도 보존 의무가 있거나 분쟁 처리를 위해 필요한 경우에는 해당 기간 동안 보관할 수 있습니다."
  },
  {
    title: "제3자 제공",
    body: "OOGO는 원칙적으로 개인정보를 제3자에게 판매하거나 제공하지 않습니다. 이용자의 별도 동의가 있거나 법령에 근거가 있는 경우에만 필요한 범위에서 제공합니다."
  },
  {
    title: "처리 위탁 및 국외 이전",
    body: "사이트 운영을 위해 데이터베이스, 호스팅 및 보안 서비스 제공자에게 일부 처리를 위탁할 수 있습니다. 국외 이전이 발생하는 경우 이전 국가, 항목, 목적, 방법, 보유 기간과 거부 방법을 본 방침에 공개하고 필요한 절차를 이행합니다."
  },
  {
    title: "개인정보의 파기",
    body: "보유 기간이 끝나거나 처리 목적이 달성된 개인정보는 복구할 수 없는 방법으로 안전하게 삭제합니다. 종이 문서가 있는 경우 분쇄 또는 소각하여 파기합니다."
  },
  {
    title: "정보주체의 권리",
    body: "이용자는 개인정보의 열람, 정정, 삭제 및 처리 정지를 요청할 수 있습니다. 요청은 contact@oogolabs.com으로 접수하며, 본인 확인 후 관련 법령이 정한 범위에서 처리합니다."
  },
  {
    title: "안전성 확보 조치",
    body: "OOGO는 개인정보 접근 권한 관리, 인증과 접근 통제, 전송 구간 보호, 기록 점검 등 개인정보의 분실, 도난, 유출 및 훼손을 방지하기 위한 합리적인 보호 조치를 적용합니다."
  },
  {
    title: "쿠키 및 보안 기술",
    body: "필수 보안과 스팸 방지를 위해 Cloudflare Turnstile과 같은 기술이 사용될 수 있습니다. 이 과정에서 보안 확인에 필요한 최소한의 기술 정보가 서비스 제공자에 의해 처리될 수 있습니다."
  },
  {
    title: "개인정보 문의처",
    body: "개인정보 처리와 권리 행사에 관한 문의는 contact@oogolabs.com으로 보내 주세요."
  },
  {
    title: "처리방침 변경",
    body: "본 처리방침이 변경되는 경우 시행일과 주요 변경 사항을 이 페이지에 게시합니다. 이용자의 권리에 중요한 영향을 주는 변경은 합리적인 기간을 두고 안내합니다."
  }
] as const;

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader />
      <main className="legal-page">
        <section className="legal-page-intro">
          <p className="eyebrow">LEGAL</p>
          <h1>개인정보 처리방침</h1>
          <p>OOGO 웹사이트와 문의 양식을 통해 수집되는 개인정보의 처리 기준을 안내합니다.</p>
          <p className="legal-page-meta">시행일: 2026년 7월 14일</p>
        </section>
        <section className="legal-page-body" aria-label="Privacy sections">
          {sections.map((section) => (
            <article className="legal-block" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </section>
        <p className="legal-page-note">
          배포 전 실제 사업자 정보, 위탁사 및 국외 이전 세부 내용을 운영 환경에 맞게 최종 확인해야 합니다.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
